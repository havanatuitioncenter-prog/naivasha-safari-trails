import { z } from "zod";

const text = (max: number) => z.string().trim().min(1, "This field is required.").max(max).refine(v => !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v), "Please remove unsupported characters.");
export const tourChoice = text(150);
export const safariQuestions = [
 { key: 'group', label: 'Who are you travelling with?', options: ['Solo', 'Couple', 'Family', 'Friends / group'] },
 { key: 'accommodation', label: 'What accommodation do you prefer?', options: ['Budget', 'Mid-range', 'Luxury', 'Not sure yet'] },
 { key: 'interests', label: 'What would you most like to experience?', options: ['Wildlife', 'Birdwatching', 'Lakes & boat trips', 'Hiking', 'Beach', 'Culture'] },
] as const;
export const safariAnswersSchema = z.object({
 group: z.enum(['', 'Solo','Couple','Family','Friends / group']).default(''),
 accommodation: z.enum(['', 'Budget','Mid-range','Luxury','Not sure yet']).default(''),
 interests: z.array(z.enum(['Wildlife','Birdwatching','Lakes & boat trips','Hiking','Beach','Culture'])).default([]),
 pickup: z.string().trim().max(200).default(''), needs: z.string().trim().max(1000).default(''),
});
export const bookingSchema = z.object({
  name: text(100), email: z.string().trim().email("Enter a valid email.").max(255),
  phone: z.string().trim().min(7).max(30).regex(/^[+0-9 ()-]+$/, "Enter a valid phone number."),
  tour: tourChoice,
  travel_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => {
    const date = new Date(`${v}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === v && v >= new Date().toISOString().slice(0,10);
  }, "Choose today or a future date."),
  guests: z.coerce.number().int().min(1).max(100),
  message: z.string().trim().max(2000), website: z.string().max(0, "Unable to submit."),
  safari_answers: safariAnswersSchema.default({}),
});
export const reviewSchema = z.object({
  name: text(100), country: z.string().trim().max(100), tour: tourChoice,
  rating: z.coerce.number().int().min(1).max(5), review: text(2000).refine(v => v.length >= 10, "Write at least 10 characters."),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to share your review publicly." }) }),
  website: z.string().max(0, "Unable to submit."),
});