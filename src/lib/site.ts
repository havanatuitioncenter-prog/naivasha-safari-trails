import hellsgate from "@/assets/hellsgate.jpg";
import crescent from "@/assets/crescent.jpg";
import mara from "@/assets/mara.jpg";
import hero from "@/assets/hero-naivasha.jpg";

export const PHONE_DISPLAY = "+254 790 990300";
export const PHONE_TEL = "+254790990300";
export const EMAIL = "info@daystarglobetours.co.ke";

export function whatsappLink(message = "Hello Daystar Globe Tours, I'd like to enquire about a safari.") {
  return `https://wa.me/254790990300?text=${encodeURIComponent(message)}`;
}

export type Tour = {
  name: string;
  duration: string;
  area: string;
  image: string;
  summary: string;
  highlights: string[];
};

export const tours: Tour[] = [
  {
    name: "Lake Naivasha Boat Safari",
    duration: "Half day",
    area: "Naivasha",
    image: hero,
    summary: "Glide past hippo pods, fish eagles and pelicans on Kenya's freshwater jewel.",
    highlights: ["Hippo viewing", "Fish eagle feeding", "Papyrus channels"],
  },
  {
    name: "Crescent Island Walking Safari",
    duration: "Half day",
    area: "Naivasha",
    image: crescent,
    summary: "Walk on foot among giraffes, zebras and wildebeest with an expert guide.",
    highlights: ["Guided bush walk", "Giraffe close-ups", "Lake views"],
  },
  {
    name: "Hell's Gate Cycling Adventure",
    duration: "Full day",
    area: "Naivasha",
    image: hellsgate,
    summary: "Cycle between towering red cliffs, then hike the dramatic Ol Njorowa gorge.",
    highlights: ["Bike hire included", "Gorge hike", "Fischer's Tower"],
  },
  {
    name: "Mount Longonot Hike & Lake Combo",
    duration: "Full day",
    area: "Naivasha",
    image: hero,
    summary: "Summit the volcano's crater rim at sunrise, then relax by Lake Naivasha.",
    highlights: ["Crater rim views", "Packed lunch", "Evening boat ride"],
  },
  {
    name: "Naivasha & Lake Nakuru Explorer",
    duration: "2 days",
    area: "Rift Valley",
    image: crescent,
    summary: "Rhinos, flamingos and tree-climbing lions in Nakuru, plus Naivasha's lake and wildlife.",
    highlights: ["Rhino sanctuary", "Flamingo shores", "Lakeside lodge"],
  },
  {
    name: "Maasai Mara via Naivasha",
    duration: "4 days",
    area: "Maasai Mara",
    image: mara,
    summary: "Kenya's greatest game reserve, the Big Five and the Great Migration, with a Naivasha stopover.",
    highlights: ["Big Five game drives", "Maasai village visit", "Naivasha boat ride"],
  },
];
