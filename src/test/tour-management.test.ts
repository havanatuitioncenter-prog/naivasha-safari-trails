import { describe,it,expect } from 'vitest';
import { tourSchema } from '@/lib/tour-schemas';
import { buildPlan } from '@/lib/planner';
const tour={name:'New Nairobi Safari',area:'Nairobi',duration:'Full day',summary:'A wildlife safari in Nairobi.',naivasha:false,highlights:['Wildlife'],includes:['Guide'],images:['12345678-1234-1234-1234-123456789012.jpg']};
describe('Managed tours',()=>{
 it('accepts new tours with pictures',()=>expect(tourSchema.safeParse(tour).success).toBe(true));
 it('accepts updates with an existing tour ID',()=>expect(tourSchema.safeParse({...tour,id:'12345678-1234-1234-1234-123456789012'}).success).toBe(true));
 it('only recommends the supplied live catalogue',()=>{const result=buildPlan({days:2,interests:['wildlife'],pace:'balanced'},[{...tour,image:'photo.jpg'}]);expect(result.tours.map(t=>t.name)).toEqual(['New Nairobi Safari']);expect(buildPlan({days:2,interests:[],pace:'balanced'},[]).tours).toEqual([]);});
 it('rejects arbitrary file paths',()=>expect(tourSchema.safeParse({...tour,images:['../private.jpg']}).success).toBe(false));
});