/**
 * Fatigue Engine — TypeScript port of the Shiftlyx Dart fatigue engine.
 *
 * Calculates a 0-100 fatigue score from a list of shifts.
 * All computation happens client-side. No server needed.
 */

// ---------- Types ----------

export interface ShiftInput {
  date: string; // '2026-05-24'
  shiftCode: 'LD' | 'MLD' | 'TW' | 'N' | 'AL' | 'SL' | 'OFF';
  startTime?: string; // '07:30'
  endTime?: string;   // '20:00'
}

export type FatigueSeverity = 'low' | 'medium' | 'high';

export interface FatigueFlag {
  code: string;
  title: string;
  message: string;
  severity: FatigueSeverity;
}

export interface FatigueAnalysis {
  score: number;
  nightCount: number;
  maxConsecutiveWorkDays: number;
  maxConsecutiveNights: number;
  shortRecoveryCount: number;
  circadianDisruptionCount: number;
  recoveryBlockCount: number;
  flags: FatigueFlag[];
  componentScores: Record<string, number>;
  headline: string;
}

// ---------- Helpers ----------

function dateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayKey(d: Date): string {
  const dd = dateOnly(d);
  const m = String(dd.getMonth() + 1).padStart(2, '0');
  const day = String(dd.getDate()).padStart(2, '0');
  return `${dd.getFullYear()}-${m}-${day}`;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isWorkShift(code: string): boolean {
  return code === 'LD' || code === 'MLD' || code === 'TW' || code === 'N';
}

function isNightShift(code: string): boolean {
  return code === 'N';
}

function defaultStartTime(code: string): string {
  switch (code) {
    case 'LD': return '07:30';
    case 'MLD': return '09:00';
    case 'TW': return '12:00';
    case 'N': return '19:30';
    default: return '00:00';
  }
}

function defaultEndTime(code: string): string {
  switch (code) {
    case 'LD': return '20:00';
    case 'MLD': return '17:00';
    case 'TW': return '20:00';
    case 'N': return '08:00';
    default: return '00:00';
  }
}

function shiftStart(s: ShiftInput): Date {
  const d = parseDate(s.date);
  const t = s.startTime || defaultStartTime(s.shiftCode);
  const [h, m] = t.split(':').map(Number);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
}

function shiftEnd(s: ShiftInput): Date {
  const d = parseDate(s.date);
  const t = s.endTime || defaultEndTime(s.shiftCode);
  const [h, m] = t.split(':').map(Number);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
  // If end <= start, add a day (night shifts)
  if (end <= shiftStart(s)) {
    end.setDate(end.getDate() + 1);
  }
  return end;
}

// ---------- Engine ----------

export function analyzeShifts(
  shifts: ShiftInput[],
  commuteMinutes = 0,
): FatigueAnalysis {
  if (shifts.length === 0) {
    return {
      score: 0, nightCount: 0, maxConsecutiveWorkDays: 0,
      maxConsecutiveNights: 0, shortRecoveryCount: 0,
      circadianDisruptionCount: 0, recoveryBlockCount: 0,
      flags: [], componentScores: {}, headline: 'No shifts to analyse',
    };
  }

  // Sort by date
  const sorted = [...shifts].sort(
    (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime(),
  );

  const workShifts = sorted.filter(s => isWorkShift(s.shiftCode));

  if (workShifts.length === 0) {
    return {
      score: 0, nightCount: 0, maxConsecutiveWorkDays: 0,
      maxConsecutiveNights: 0, shortRecoveryCount: 0,
      circadianDisruptionCount: 0, recoveryBlockCount: 0,
      flags: [], componentScores: {}, headline: 'No work shifts found',
    };
  }

  const nightCount = workShifts.filter(s => isNightShift(s.shiftCode)).length;
  const maxConsecutiveWorkDays = maxConsecutiveWork(workShifts);
  const maxConsecutiveNights = maxConsecNight(workShifts);
  const shortRecoveryCount = shortRecovery(workShifts);
  const circadianDisruptionCount = circadianDisruption(workShifts);
  const recoveryBlockCount = recoveryBlocks(sorted);

  const componentScores: Record<string, number> = {
    nights: nightCount * 8,
    consecutive_work_days: maxConsecutiveWorkDays <= 3 ? 0 : (maxConsecutiveWorkDays - 3) * 6,
    consecutive_nights: maxConsecutiveNights <= 2 ? 0 : (maxConsecutiveNights - 2) * 8,
    short_recovery: shortRecoveryCount * 10,
    circadian_disruption: circadianDisruptionCount * 9,
    commute: commutePenalty(commuteMinutes),
    recovery_credit: -Math.min(recoveryBlockCount * 4, 12),
  };

  const rawScore = Object.values(componentScores).reduce((a, b) => a + b, 0);
  const score = Math.max(0, Math.min(100, rawScore));

  const flags = buildFlags({
    nightCount, maxConsecutiveWorkDays, maxConsecutiveNights,
    shortRecoveryCount, circadianDisruptionCount, commuteMinutes,
  });

  const headline =
    score >= 75 ? 'High fatigue risk' :
    score >= 50 ? 'Moderate fatigue risk' :
    score >= 25 ? 'Mild fatigue risk' :
    'Low fatigue risk';

  return {
    score, nightCount, maxConsecutiveWorkDays, maxConsecutiveNights,
    shortRecoveryCount, circadianDisruptionCount, recoveryBlockCount,
    flags, componentScores, headline,
  };
}

// ---------- Sub-calculations ----------

function maxConsecutiveWork(workShifts: ShiftInput[]): number {
  let maxRun = 0, currentRun = 0;
  let prevDate: Date | null = null;
  for (const s of workShifts) {
    const d = parseDate(s.date);
    if (prevDate === null) {
      currentRun = 1;
    } else {
      const gap = Math.round((d.getTime() - prevDate.getTime()) / 86400000);
      currentRun = gap === 1 ? currentRun + 1 : 1;
    }
    maxRun = Math.max(maxRun, currentRun);
    prevDate = d;
  }
  return maxRun;
}

function maxConsecNight(workShifts: ShiftInput[]): number {
  let maxRun = 0, currentRun = 0;
  let prevDate: Date | null = null;
  for (const s of workShifts) {
    if (!isNightShift(s.shiftCode)) {
      currentRun = 0;
      prevDate = null;
      continue;
    }
    const d = parseDate(s.date);
    if (prevDate === null) {
      currentRun = 1;
    } else {
      const gap = Math.round((d.getTime() - prevDate.getTime()) / 86400000);
      currentRun = gap === 1 ? currentRun + 1 : 1;
    }
    maxRun = Math.max(maxRun, currentRun);
    prevDate = d;
  }
  return maxRun;
}

function shortRecovery(workShifts: ShiftInput[]): number {
  let count = 0;
  for (let i = 0; i < workShifts.length - 1; i++) {
    const prevEnd = shiftEnd(workShifts[i]);
    const nextStart = shiftStart(workShifts[i + 1]);
    const gap = (nextStart.getTime() - prevEnd.getTime()) / 3600000;
    if (gap < 11) count++;
  }
  return count;
}

function circadianDisruption(workShifts: ShiftInput[]): number {
  let count = 0;
  for (let i = 0; i < workShifts.length - 1; i++) {
    const cur = workShifts[i];
    const next = workShifts[i + 1];
    if (!isNightShift(cur.shiftCode)) continue;
    if (isNightShift(next.shiftCode)) continue;
    const gap = (shiftStart(next).getTime() - shiftEnd(cur).getTime()) / 3600000;
    if (gap < 36) count++;
  }
  return count;
}

function recoveryBlocks(shifts: ShiftInput[]): number {
  if (shifts.length === 0) return 0;
  const first = parseDate(shifts[0].date);
  const last = parseDate(shifts[shifts.length - 1].date);

  const byDay = new Map<string, ShiftInput>();
  for (const s of shifts) {
    byDay.set(dayKey(parseDate(s.date)), s);
  }

  let count = 0, offRun = 0;
  const cursor = new Date(first);
  while (cursor <= last) {
    const key = dayKey(cursor);
    const shift = byDay.get(key);
    if (!shift || !isWorkShift(shift.shiftCode)) {
      offRun++;
    } else {
      if (offRun >= 2) count++;
      offRun = 0;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (offRun >= 2) count++;
  return count;
}

function commutePenalty(minutes: number): number {
  if (minutes <= 30) return 0;
  if (minutes <= 45) return 2;
  if (minutes <= 60) return 4;
  if (minutes <= 90) return 7;
  return 10;
}

function buildFlags(args: {
  nightCount: number;
  maxConsecutiveWorkDays: number;
  maxConsecutiveNights: number;
  shortRecoveryCount: number;
  circadianDisruptionCount: number;
  commuteMinutes: number;
}): FatigueFlag[] {
  const flags: FatigueFlag[] = [];

  if (args.nightCount >= 3) {
    flags.push({
      code: 'night_load', title: 'High night load',
      message: 'This schedule has a heavy concentration of night shifts.',
      severity: 'medium',
    });
  }
  if (args.maxConsecutiveWorkDays >= 4) {
    flags.push({
      code: 'consecutive_work_days', title: 'Long work streak',
      message: `${args.maxConsecutiveWorkDays} consecutive work days may reduce recovery quality.`,
      severity: args.maxConsecutiveWorkDays >= 6 ? 'high' : 'medium',
    });
  }
  if (args.maxConsecutiveNights >= 3) {
    flags.push({
      code: 'consecutive_nights', title: 'Stacked nights',
      message: `${args.maxConsecutiveNights} consecutive nights increase circadian strain.`,
      severity: args.maxConsecutiveNights >= 4 ? 'high' : 'medium',
    });
  }
  if (args.shortRecoveryCount > 0) {
    flags.push({
      code: 'short_recovery', title: 'Short recovery gap',
      message: `${args.shortRecoveryCount} shift gap${args.shortRecoveryCount === 1 ? '' : 's'} appear too short for good recovery.`,
      severity: args.shortRecoveryCount >= 2 ? 'high' : 'medium',
    });
  }
  if (args.circadianDisruptionCount > 0) {
    flags.push({
      code: 'circadian_disruption', title: 'Circadian disruption',
      message: 'Night-to-day transitions are happening too quickly.',
      severity: args.circadianDisruptionCount >= 2 ? 'high' : 'medium',
    });
  }
  if (args.commuteMinutes >= 60) {
    flags.push({
      code: 'commute_load', title: 'Commute strain',
      message: `A ${args.commuteMinutes} minute commute adds extra fatigue pressure.`,
      severity: args.commuteMinutes >= 90 ? 'high' : 'low',
    });
  }
  return flags;
}
