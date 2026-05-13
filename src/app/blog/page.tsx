import type { Metadata } from "next";
import BlogIndexContent from "./blog-index-content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical advice for NHS shift workers on fatigue management, rota planning, recovery, and partner sync — written by shift workers, for shift workers.",
  alternates: {
    canonical: "https://www.shiftlyx.com/blog",
  },
  openGraph: {
    title: "Blog — Shiftlyx",
    description:
      "Practical advice for NHS shift workers on fatigue management, rota planning, recovery, and partner sync.",
  },
};

export default function BlogPage() {
  return <BlogIndexContent />;
}
