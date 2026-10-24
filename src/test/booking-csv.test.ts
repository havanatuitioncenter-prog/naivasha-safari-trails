import { describe,it,expect } from 'vitest';
import { bookingsCsv,csvCell } from '@/lib/booking-csv';
describe('Booking CSV',()=>{
 it('exports booking data including safari answers',()=>{
  const csv=bookingsCsv([{id:'ref',created_at:'2026-10-24',name:'Family, Kenya',email:'visitor@example.com',phone:'+254790990300',tour:'Naivasha',travel_date:'2027-01-01',guests:4,status:'new',message:'A "family" trip\nplease',admin_note:'',confirmed_at:null,safari_answers:{group:'Family'}}]);
  expect(csv).toContain('"Family, Kenya"');expect(csv).toContain('"A ""family"" trip\nplease"');expect(csv).toContain('"{""group"":""Family""}"');
 });
 it('neutralizes spreadsheet formulas',()=>{expect(csvCell('=HYPERLINK("bad")')).toBe('"\'=HYPERLINK(""bad"")"');expect(csvCell(' +1')).toBe('"\' +1"');});
 it('exports every supplied row instead of limiting to the admin display',()=>{const rows=Array.from({length:250},(_,i)=>({id:String(i),created_at:'',name:'Visitor',email:'visitor@example.com',phone:'1234567',tour:'Kenya',travel_date:'2027-01-01',guests:1,status:'new',message:'',admin_note:'',confirmed_at:null}));expect(bookingsCsv(rows).split('\r\n')).toHaveLength(251);});
});