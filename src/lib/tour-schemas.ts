import { z } from 'zod';
export const tourSchema = z.object({
 id: z.string().uuid().optional(), name: z.string().trim().min(2).max(150),
 duration: z.string().trim().min(1).max(100), area: z.string().trim().min(1).max(100),
 naivasha: z.boolean(), summary: z.string().trim().min(10).max(2000),
 highlights: z.array(z.string().trim().min(1).max(200)).max(20),
 includes: z.array(z.string().trim().min(1).max(200)).max(20),
 images: z.array(z.string().regex(/^[a-f0-9-]+\.(jpg|png|webp)$/)).max(12),
});
export const photoSchema = z.object({ name: z.string().max(200), type: z.enum(['image/jpeg','image/png','image/webp']), base64: z.string().min(1).max(7000000) });
