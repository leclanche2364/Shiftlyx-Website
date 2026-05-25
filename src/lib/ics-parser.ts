/**
 * ICS (iCalendar) Parser — TypeScript port of the Shiftlyx Dart parser.
 *
 * Parses raw ICS content (from HealthRota, Rotamaster, etc.) into
 * ShiftInput objects that can be fed into the fatigue engine.
 * All computation happens client-side.
 */

import { ShiftInput } from './fatigue-engine';

// ---------- Types ----------

interface DateTimeRange {
  start: Date;
  end: Date;
}

interface ParseResult {
  shifts: ShiftInput[];
  errors: string[];
  totalEvents: number;
  parsed: number;
  failed: number;
}

// ---------- Constants ----------

const EXCLUDED_PATTERNS = ['OFF', 'SICK', 'TRAINING', 'MATERNITY', 'PATERNITY', 'CARER', 'UNPAID'];

type ShiftCode = ShiftInput['shiftCode'];

const KNOWN_MAPPINGS: Record<string, ShiftCode> = {
  'LD': 'LD',
  'LONG DAY': 'LD',
  'LONGDAY': 'LD',
  'MLD': 'MLD',
  'MEDIUM LONG DAY': 'MLD',
  'MEDIUMLONGDAY': 'MLD',
  'TW': 'TW',
  'TWILIGHT': 'TW',
  'N': 'N',
  'NIGHT': 'N',
  'NIGHT SHIFT': 'N',
  'NIT': 'N',
  'NTS': 'N',
  'AL': 'AL',
  'ANNUAL LEAVE': 'AL',
  'ANNUALLEAVE': 'AL',
  'SL': 'SL',
  'STUDY LEAVE': 'SL',
  'STUDYLEAVE': 'SL',
  'OFF': 'OFF',
  'DAY OFF': 'OFF',
  'DAYOFF': 'OFF',
  'DO': 'OFF',
  'E': 'LD',
  'EARLY': 'LD',
  'L': 'TW',
  'LATE': 'TW',
  'D': 'LD',
  'DAY': 'LD',
};

// ---------- Main Parser ----------

export function parseICS(icsContent: string): ParseResult {
  const errors: string[] = [];
  const shifts: ShiftInput[] = [];
  let veventCount = 0;
  let parsedCount = 0;
  let failedCount = 0;

  try {
    const lines = normalizeLineFolding(icsContent)
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const veventBlocks = extractVeventBlocks(lines);

    for (const block of veventBlocks) {
      veventCount++;
      try {
        const props = parseProperties(block);
        const uid = props['UID'] || `fallback-${block.join('').length}`;
        const summary = props['SUMMARY'] || '';
        const location = props['LOCATION'] || '';
        const description = props['DESCRIPTION'] || '';

        // Skip excluded patterns
        if (isExcluded(summary)) {
          parsedCount++;
          continue;
        }

        // Parse dates
        const ranges = parseDateRanges(props);

        if (ranges.length === 0) {
          failedCount++;
          errors.push(`No valid DTSTART/DTEND for event: ${summary}`);
          continue;
        }

        // Handle RRULE expansion
        const rrule = props['RRULE'];
        let expandedRanges: DateTimeRange[] = ranges;
        if (rrule) {
          expandedRanges = expandRecurrence(ranges[0], rrule);
        }

        // Expand multi-day events and map shifts
        const singleDayRanges: DateTimeRange[] = [];
        for (const range of expandedRanges) {
          singleDayRanges.push(...expandMultiDay(range));
        }

        for (const range of singleDayRanges) {
          const cleanedTitle = cleanTitle(summary);
          const mapping = mapFromString(cleanedTitle);

          if (!mapping.code && mapping.confidence < 0.3) {
            failedCount++;
            errors.push(`Unable to map shift type from "${summary}" (cleaned: "${cleanedTitle}")`);
            continue;
          }

          const code = mapping.code || 'LD'; // fallback
          const dateStr = formatDate(range.start);

          shifts.push({
            date: dateStr,
            shiftCode: code,
            startTime: formatTime(range.start),
            endTime: formatTime(range.end),
          });

          parsedCount++;
        }
      } catch (e) {
        failedCount++;
        errors.push(`Failed to parse VEVENT block: ${e}`);
      }
    }
  } catch (e) {
    errors.push(`Failed to parse ICS content: ${e}`);
  }

  return { shifts, errors, totalEvents: veventCount, parsed: parsedCount, failed: failedCount };
}

// ---------- ICS Parsing Utilities ----------

function normalizeLineFolding(content: string): string {
  return content.replace(/\r?\n[ \t]/g, '');
}

function extractVeventBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let currentBlock: string[] | null = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      currentBlock = [line];
    } else if (line === 'END:VEVENT' && currentBlock) {
      currentBlock.push(line);
      blocks.push(currentBlock);
      currentBlock = null;
    } else if (currentBlock) {
      currentBlock.push(line);
    }
  }

  return blocks;
}

function parseProperties(block: string[]): Record<string, string> {
  const props: Record<string, string> = {};

  for (const line of block) {
    if (line.startsWith('BEGIN:') || line.startsWith('END:')) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const nameWithParams = line.substring(0, colonIdx);
    const value = line.substring(colonIdx + 1);
    const name = nameWithParams.split(';')[0].toUpperCase();

    if (!(name in props)) {
      props[name] = value;
    }
  }

  return props;
}

// ---------- Date Parsing ----------

function parseDateRanges(props: Record<string, string>): DateTimeRange[] {
  const dtstartRaw = props['DTSTART'];
  const dtendRaw = props['DTEND'];

  if (!dtstartRaw) return [];

  const isAllDay = isAllDayFormat(dtstartRaw);

  if (isAllDay) {
    const startDate = parseDateOnly(dtstartRaw);
    const endDate = dtendRaw ? parseDateOnly(dtendRaw) : new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    return [{
      start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0),
      end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59),
    }];
  } else {
    const start = parseDateTime(dtstartRaw);
    if (!dtendRaw) return [];
    const end = parseDateTime(dtendRaw);

    if (end <= start) {
      const nextDay = new Date(end);
      nextDay.setDate(nextDay.getDate() + 1);
      return [{ start, end: nextDay }];
    }

    return [{ start, end }];
  }
}

function isAllDayFormat(raw: string): boolean {
  const value = raw.split(':').pop()?.trim() || raw;
  if (value.length === 8 && /^\d{8}$/.test(value)) return true;
  return raw.includes('VALUE=DATE');
}

function parseDateOnly(raw: string): Date {
  const colonIdx = raw.lastIndexOf(':');
  const cleaned = colonIdx >= 0 ? raw.substring(colonIdx + 1) : raw;
  const year = parseInt(cleaned.substring(0, 4), 10);
  const month = parseInt(cleaned.substring(4, 6), 10);
  const day = parseInt(cleaned.substring(6, 8), 10);
  return new Date(year, month - 1, day);
}

function parseDateTime(raw: string): Date {
  const colonIdx = raw.lastIndexOf(':');
  const cleaned = colonIdx >= 0 ? raw.substring(colonIdx + 1) : raw;
  const datePart = cleaned.substring(0, 8);
  const timePart = cleaned.substring(9, 15);

  const year = parseInt(datePart.substring(0, 4), 10);
  const month = parseInt(datePart.substring(4, 6), 10);
  const day = parseInt(datePart.substring(6, 8), 10);
  const hour = parseInt(timePart.substring(0, 2), 10);
  const minute = parseInt(timePart.substring(2, 4), 10);
  const second = parseInt(timePart.substring(4, 6), 10);

  return new Date(year, month - 1, day, hour, minute, second);
}

function formatDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// ---------- RRULE Expansion ----------

function expandRecurrence(firstOccurrence: DateTimeRange, rrule: string): DateTimeRange[] {
  const results: DateTimeRange[] = [firstOccurrence];

  const params: Record<string, string> = {};
  for (const part of rrule.split(';')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx !== -1) {
      params[part.substring(0, eqIdx)] = part.substring(eqIdx + 1);
    }
  }

  const freq = params['FREQ'];
  const interval = parseInt(params['INTERVAL'] || '1', 10);
  const count = params['COUNT'] ? parseInt(params['COUNT'], 10) : null;
  const untilRaw = params['UNTIL'];

  if (!freq) return results;

  const shiftDuration = firstOccurrence.end.getTime() - firstOccurrence.start.getTime();
  const maxEnd = new Date(firstOccurrence.start.getTime() + 365 * 86400000);
  let occurrenceCount = 1;

  const stepMs = freq === 'WEEKLY'
    ? 7 * interval * 86400000
    : interval * 86400000;

  let cursor = new Date(firstOccurrence.start.getTime() + stepMs);

  while (cursor.getTime() < maxEnd.getTime()) {
    if (count !== null && occurrenceCount >= count) break;
    if (untilRaw) {
      const until = parseRRuleUntil(untilRaw);
      if (cursor > until) break;
    }

    results.push({
      start: new Date(cursor),
      end: new Date(cursor.getTime() + shiftDuration),
    });

    occurrenceCount++;
    cursor = new Date(cursor.getTime() + stepMs);
  }

  return results;
}

function parseRRuleUntil(raw: string): Date {
  if (raw.length === 8 && /^\d{8}$/.test(raw)) {
    return parseDateOnly(raw);
  }
  const cleaned = raw.replace(/[^0-9T]/g, '');
  return parseDateTime(cleaned);
}

// ---------- Multi-Day Expansion ----------

function expandMultiDay(range: DateTimeRange): DateTimeRange[] {
  const duration = range.end.getTime() - range.start.getTime();

  if (duration <= 26 * 3600000) {
    return [range];
  }

  const days: DateTimeRange[] = [];
  const cursor = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate(), 0, 0);
  const lastDate = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate(), 0, 0);

  while (cursor < lastDate) {
    days.push({
      start: new Date(cursor),
      end: new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 23, 59),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

// ---------- Shift Title Mapping ----------

function isExcluded(summary: string): boolean {
  const upper = summary.toUpperCase().trim();
  return EXCLUDED_PATTERNS.some(p => upper.startsWith(p) || upper.includes(p));
}

function cleanTitle(summary: string): string {
  return summary
    .trim()
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapFromString(raw: string): { code: ShiftCode | null; confidence: number } {
  if (!raw) return { code: null, confidence: 0 };

  const cleaned = raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s/]/g, '')
    .trim();

  // Exact match
  if (cleaned in KNOWN_MAPPINGS) {
    return { code: KNOWN_MAPPINGS[cleaned], confidence: 1.0 };
  }

  // Partial matches (before word split to avoid single-letter matches)
  if (cleaned.includes('LONG DAY') || cleaned.includes('LONGDAY'))
    return { code: 'LD', confidence: 0.8 };
  if (cleaned.includes('MEDIUM LONG DAY') || cleaned.includes('MEDIUMLONGDAY'))
    return { code: 'MLD', confidence: 0.8 };
  if (cleaned.includes('ANNUAL LEAVE') || cleaned.includes('ANNUALLEAVE'))
    return { code: 'AL', confidence: 0.8 };
  if (cleaned.includes('STUDY LEAVE') || cleaned.includes('STUDYLEAVE'))
    return { code: 'SL', confidence: 0.8 };
  if (cleaned.includes('DAY OFF') || cleaned.includes('DAYOFF'))
    return { code: 'OFF', confidence: 0.8 };
  if (cleaned.includes('NIGHT'))
    return { code: 'N', confidence: 0.8 };
  if (cleaned.includes('TWILIGHT'))
    return { code: 'TW', confidence: 0.8 };

  // Word-level match
  const words = cleaned.split(/[\s/]+/);
  for (const word of words) {
    if (word in KNOWN_MAPPINGS) {
      return { code: KNOWN_MAPPINGS[word], confidence: 0.7 };
    }
  }

  return { code: null, confidence: 0 };
}
