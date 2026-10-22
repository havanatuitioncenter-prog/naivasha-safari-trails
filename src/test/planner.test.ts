import { describe, expect, it } from "vitest";
import { buildPlan, durationDays } from "@/lib/planner";
import { tours } from "@/lib/site";

describe("durationDays", () => {
  it("parses multi-day durations", () => {
    expect(durationDays("4 days / 3 nights")).toBe(4);
    expect(durationDays("2 days / 1 night")).toBe(2);
  });
  it("treats half day as 0.5 and full day as 1", () => {
    expect(durationDays("Half day · approx. 3 hrs")).toBe(0.5);
    expect(durationDays("Full day")).toBe(1);
  });
});

describe("buildPlan", () => {
  it("always includes arrival and return days", () => {
    const plan = buildPlan({ days: 5, interests: ["wildlife"], pace: "balanced" });
    expect(plan.days.at(0)?.title).toBe("Arrival & pick-up");
    expect(plan.days.at(-1)?.title).toBe("Return to Nairobi");
  });

  it("never schedules more tour days than the traveller has", () => {
    const plan = buildPlan({ days: 2, interests: ["wildlife"], pace: "packed" });
    const tourDays = plan.tours.reduce((sum, t) => sum + durationDays(t.duration), 0);
    expect(tourDays).toBeLessThanOrEqual(2);
  });

  it("prefers beach tours for beach interests", () => {
    const plan = buildPlan({ days: 7, interests: ["beach"], pace: "relaxed" });
    expect(plan.tours.some((t) => t.name === "Diani Beach Holiday")).toBe(true);
  });

  it("only recommends tours that exist in the catalogue", () => {
    const plan = buildPlan({ days: 10, interests: ["hiking", "birds"], pace: "balanced" });
    for (const tour of plan.tours) {
      expect(tours).toContain(tour);
    }
  });
});
