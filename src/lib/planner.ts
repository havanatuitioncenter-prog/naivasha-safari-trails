import { tours, type Tour } from "./site";

export const interests = [
  { id: "wildlife", label: "Big game & wildlife", keywords: ["big five", "game drive", "rhino", "elephant", "lion", "wildlife", "migration", "safari"] },
  { id: "birds", label: "Birds & nature", keywords: ["bird", "eagle", "pelican", "flamingo", "papyrus", "birdwatching"] },
  { id: "water", label: "Lakes & boat trips", keywords: ["boat", "lake", "hippo", "cruise", "snorkel", "dhow", "dolphin"] },
  { id: "hiking", label: "Hiking & adventure", keywords: ["hike", "climb", "crater", "cycling", "bike", "gorge", "walk"] },
  { id: "beach", label: "Beach & relaxation", keywords: ["beach", "ocean", "sand", "resort", "unwind", "spa"] },
  { id: "culture", label: "Culture & people", keywords: ["maasai", "village", "swahili", "culture"] },
] as const;

export type InterestId = (typeof interests)[number]["id"];

export type PlanAnswers = {
  days: number;
  interests: InterestId[];
  pace: "relaxed" | "balanced" | "packed";
};

export type PlanDay = { day: number; title: string; detail: string };

export type SafariPlan = {
  tours: Tour[];
  days: PlanDay[];
  note: string;
};

// Rough trip length in days, parsed from the tour's duration label.
export function durationDays(duration: string): number {
  const match = duration.match(/(\d+)\s*day/);
  if (match) return Number(match[1]);
  if (/half day/i.test(duration)) return 0.5;
  return 1; // "Full day" and anything else
}

function scoreTour(tour: Tour, selected: InterestId[]): number {
  if (selected.length === 0) return tour.naivasha ? 2 : 1;
  const haystack = `${tour.name} ${tour.summary} ${tour.highlights.join(" ")}`.toLowerCase();
  let score = 0;
  for (const interest of interests) {
    if (!selected.includes(interest.id)) continue;
    for (const keyword of interest.keywords) {
      if (haystack.includes(keyword)) {
        score += 1;
        break;
      }
    }
  }
  return score * 10 + (tour.naivasha ? 2 : 1);
}

export function buildPlan(answers: PlanAnswers): SafariPlan {
  const capacity = Math.max(1, Math.min(answers.days, 14));
  const ranked = [...tours].sort((a, b) => scoreTour(b, answers.interests) - scoreTour(a, answers.interests));

  const chosen: Tour[] = [];
  let used = 0;
  for (const tour of ranked) {
    const length = durationDays(tour.duration);
    if (chosen.length > 0 && used + length > capacity) continue;
    if (scoreTour(tour, answers.interests) === 0 && chosen.length > 0) continue;
    chosen.push(tour);
    used += length;
    if (used >= capacity) break;
  }
  if (chosen.length === 0) chosen.push(ranked[0]);

  const days: PlanDay[] = [{ day: 1, title: "Arrival & pick-up", detail: "We meet you in Nairobi — hotel, apartment or JKIA airport — and brief you on the journey ahead." }];
  let cursor = 1;
  for (const tour of chosen) {
    const length = Math.max(1, Math.round(durationDays(tour.duration)));
    for (let i = 0; i < length && cursor < capacity; i++) {
      cursor += 1;
      days.push({
        day: cursor,
        title: i === 0 ? tour.name : `${tour.name} (continued)`,
        detail: i === 0 ? tour.summary : `More time around ${tour.area}: ${tour.highlights.slice(0, 2).join(" and ")}.`,
      });
    }
    if (cursor >= capacity) break;
  }
  while (cursor < capacity) {
    cursor += 1;
    days.push({
      day: cursor,
      title: "Flexible day around Lake Naivasha",
      detail: "Keep this day loose for a boat ride, a lakeside lunch or a second visit to a favourite spot.",
    });
  }
  days.push({ day: capacity + 1, title: "Return to Nairobi", detail: "Travel back to Nairobi with generous time for your onward plans or flight." });

  const paceNote =
    answers.pace === "relaxed"
      ? "Paced gently, with breathing room between activities."
      : answers.pace === "packed"
        ? "Packed with as much as your days allow."
        : "A balanced mix of activity and downtime.";

  return { tours: chosen, days, note: paceNote };
}
