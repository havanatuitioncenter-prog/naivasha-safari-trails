import hellsgate from "@/assets/hellsgate.jpg";
import crescent from "@/assets/crescent.jpg";
import mara from "@/assets/mara.jpg";
import naivasha from "@/assets/hero-naivasha.jpg";
import amboseli from "@/assets/amboseli.jpg";
import diani from "@/assets/diani.jpg";

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
  naivasha: boolean;
  image: string;
  summary: string;
  highlights: string[];
  includes: string[];
};

export const tours: Tour[] = [
  {
    name: "Lake Naivasha Boat Safari",
    duration: "Half day · approx. 3 hrs",
    area: "Lake Naivasha",
    naivasha: true,
    image: naivasha,
    summary: "Cruise Kenya's beautiful freshwater lake past hippo pods, fish eagles, pelicans and over 400 bird species, with Mount Longonot on the horizon.",
    highlights: ["Hippo viewing", "Fish eagle feeding", "Papyrus channels", "Birdwatching"],
    includes: ["1-hour guided boat ride", "Life jackets", "Park & boat fees", "Bottled water"],
  },
  {
    name: "Crescent Island Walking Safari",
    duration: "Half day · approx. 4 hrs",
    area: "Lake Naivasha",
    naivasha: true,
    image: crescent,
    summary: "Reach the island by boat and walk freely among giraffes, zebras, wildebeest, waterbuck and gazelles — one of the few places in Kenya to safari on foot.",
    highlights: ["Walk among giraffes", "Boat transfer", "Expert naturalist guide"],
    includes: ["Boat transfer", "Guided walk", "Entry fees", "Bottled water"],
  },
  {
    name: "Hell's Gate Cycling & Gorge Hike",
    duration: "Full day",
    area: "Naivasha",
    naivasha: true,
    image: hellsgate,
    summary: "Cycle between towering red cliffs past grazing zebra and buffalo, see Fischer's Tower, then descend into the dramatic Ol Njorowa Gorge with a local guide.",
    highlights: ["Bike ride", "Ol Njorowa Gorge", "Fischer's Tower", "Geothermal spa option"],
    includes: ["Bike hire", "Park fees", "Gorge guide", "Packed lunch"],
  },
  {
    name: "Mount Longonot Crater Hike",
    duration: "Full day",
    area: "Naivasha",
    naivasha: true,
    image: naivasha,
    summary: "Climb the dormant volcano to its crater rim for sweeping views over the Rift Valley and Lake Naivasha. Optional full crater-rim loop for keen hikers.",
    highlights: ["Crater rim views", "Rift Valley panorama", "Optional rim loop"],
    includes: ["Transport", "Park fees", "Hiking guide", "Packed lunch & water"],
  },
  {
    name: "Naivasha Day Trip from Nairobi",
    duration: "Full day",
    area: "Nairobi → Naivasha",
    naivasha: true,
    image: crescent,
    summary: "Stop at the Great Rift Valley viewpoint, take a boat ride on Lake Naivasha, walk Crescent Island and return to Nairobi in the evening.",
    highlights: ["Rift Valley viewpoint", "Boat ride", "Crescent Island walk"],
    includes: ["Nairobi pick-up & drop-off", "Boat & entry fees", "Lunch", "Driver-guide"],
  },
  {
    name: "Naivasha & Lake Nakuru Explorer",
    duration: "2 days / 1 night",
    area: "Naivasha & Nakuru",
    naivasha: true,
    image: crescent,
    summary: "Spot rhinos, flamingos and tree-climbing lions in Lake Nakuru National Park, then enjoy a lakeside stay and boat ride on Lake Naivasha.",
    highlights: ["Rhino sanctuary", "Flamingo shores", "Lakeside lodge", "Baboon Cliff"],
    includes: ["Safari vehicle", "Park fees", "Full-board lodge", "Boat ride"],
  },
  {
    name: "Maasai Mara via Naivasha",
    duration: "4 days / 3 nights",
    area: "Maasai Mara",
    naivasha: false,
    image: mara,
    summary: "Kenya's greatest reserve — the Big Five, vast plains and the Great Migration (July–October) — with a relaxing Naivasha stopover on the way.",
    highlights: ["Big Five game drives", "Maasai village visit", "Naivasha boat ride"],
    includes: ["4x4 safari vehicle", "Park fees", "Full-board camps", "Professional guide"],
  },
  {
    name: "Amboseli Elephant Safari",
    duration: "3 days / 2 nights",
    area: "Amboseli",
    naivasha: false,
    image: amboseli,
    summary: "Huge elephant herds against the backdrop of Mount Kilimanjaro, plus lions, cheetahs and swamp birdlife.",
    highlights: ["Kilimanjaro views", "Big tusker elephants", "Observation Hill"],
    includes: ["4x4 safari vehicle", "Park fees", "Full-board lodge", "Guide"],
  },
  {
    name: "Diani Beach Holiday",
    duration: "5 days / 4 nights",
    area: "South Coast",
    naivasha: false,
    image: diani,
    summary: "Unwind on white sands by the Indian Ocean — snorkelling at Kisite marine park, a dhow sunset cruise and Swahili culture.",
    highlights: ["Snorkelling & dolphins", "Dhow cruise", "Beach resort"],
    includes: ["Transfers", "Beach hotel", "Kisite excursion", "Breakfast & dinner"],
  },
];

export const testimonials = [
  { name: "Sarah M.", from: "United Kingdom", text: "The Crescent Island walk was magical — walking next to giraffes! Our guide was so knowledgeable and everything was perfectly organised." },
  { name: "James & Wanjiku", from: "Nairobi, Kenya", text: "We did the Naivasha day trip and the boat ride with hippos was the highlight. Very professional and great value." },
  { name: "Lukas B.", from: "Germany", text: "Four days in the Mara via Naivasha — we saw all of the Big Five. Daystar answered every WhatsApp message quickly. Highly recommended." },
];

export const faqs = [
  { q: "Where do your tours start?", a: "We operate across Kenya. Most Naivasha tours can start from Naivasha town or with a pick-up from Nairobi, and longer safaris start wherever suits you." },
  { q: "Can tours be customised?", a: "Yes. Every itinerary can be adjusted for private groups, families, budget or luxury stays." },
  { q: "How do I book?", a: "Send us a WhatsApp message, call or email with your dates and group size and we'll send you a quote." },
  { q: "When is the best time to visit?", a: "Kenya is great year-round. The dry seasons (June–October and January–February) are best for game viewing, and the Great Migration is in the Mara from July to October." },
];
