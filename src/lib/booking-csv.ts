export type CsvBooking = {id:string;created_at:string;name:string;email:string;phone:string;tour:string;travel_date:string;guests:number;message:string;status:string;admin_note:string;confirmed_at:string|null;safari_answers?:unknown};
const keys: (keyof CsvBooking)[]=['id','created_at','name','email','phone','tour','travel_date','guests','status','message','admin_note','confirmed_at','safari_answers'];
export function csvCell(value:unknown):string {
 let text=value==null?'':typeof value==='object'?JSON.stringify(value):String(value);
 if(/^[\s]*[=+\-@]/.test(text)) text="'"+text;
 return '"'+text.replace(/"/g,'""')+'"';
}
export function bookingsCsv(rows:CsvBooking[]):string {return '\uFEFF'+[keys.map(csvCell).join(','),...rows.map(row=>keys.map(key=>csvCell(row[key])).join(','))].join('\r\n');}
