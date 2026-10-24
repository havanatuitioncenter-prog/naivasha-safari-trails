import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Upload, X, Save } from 'lucide-react';
import { Button } from './ui/button';
import { toursQueryOptions, type ManagedTour } from '@/lib/tours.functions';
import { adminSaveTour, adminDeleteTour, adminUploadPhoto } from '@/lib/admin.functions';
import { tourSchema, photoSchema } from '@/lib/tour-schemas';
const inputClass='mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-foreground';
const lines=(value:FormDataEntryValue|null)=>String(value??'').split('\n').map(s=>s.trim()).filter(Boolean);
type Draft={id?:string;name:string;duration:string;area:string;naivasha:boolean;summary:string;highlights:string[];includes:string[];images:string[];photoUrls:string[];image?:string};
const blank:Draft={name:'',duration:'',area:'',naivasha:false,summary:'',highlights:[],includes:[],images:[],photoUrls:[]};
export function AdminTours(){
 const {data:tours,error:loadError,isPending}=useQuery(toursQueryOptions);
 const queryClient=useQueryClient();
 const save=useServerFn(adminSaveTour),remove=useServerFn(adminDeleteTour),upload=useServerFn(adminUploadPhoto);
 const [draft,setDraft]=useState<Draft|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [deleteTarget,setDeleteTarget]=useState<ManagedTour|null>(null);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(!draft)return;
  const data=new FormData(event.currentTarget);
  const result=tourSchema.safeParse({id:draft.id,name:data.get('name'),area:data.get('area'),duration:data.get('duration'),summary:data.get('summary'),naivasha:data.get('naivasha')==='on',highlights:lines(data.get('highlights')),includes:lines(data.get('includes')),images:draft.images});
  if(!result.success){setError(result.error.issues[0]?.message??'Check tour details.');return;}
  setBusy(true);setError('');
  try{await save({data:result.data});await queryClient.invalidateQueries({queryKey:['tours']});setDraft(null);setNotice('Tour saved.');}catch{setError('Could not save this tour. Check its name is unique and try again.');}finally{setBusy(false);}
 }
 async function addPhotos(files:FileList|null){
  if(!files||!draft)return;setBusy(true);setError('');
  try{
   if(draft.images.length+files.length>12)throw new Error('A tour can have up to 12 photos.');
   for(const file of Array.from(files)){
    if(file.size>5*1024*1024)throw new Error('Choose photos smaller than 5 MB.');
    const base64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]??'');reader.onerror=reject;reader.readAsDataURL(file);});
    const parsed=photoSchema.safeParse({name:file.name,type:file.type,base64});
    if(!parsed.success)throw new Error('Choose JPG, PNG or WebP photos.');
    const photo=await upload({data:parsed.data});
    setDraft(current=>current?{...current,images:[...current.images,photo.path],photoUrls:[...current.photoUrls,photo.url]}:null);
   }
  }catch(e){setError(e instanceof Error?e.message:'Could not upload photos.');}finally{setBusy(false);}
 }
 async function deleteTour(){if(!deleteTarget)return;setBusy(true);try{await remove({data:{id:deleteTarget.id}});await queryClient.invalidateQueries({queryKey:['tours']});setDeleteTarget(null);setNotice('Tour deleted. Existing bookings are kept.');}catch{setError('Could not delete this tour.');}finally{setBusy(false);}}
 return <div>
 <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-3xl font-semibold text-primary">Tour catalogue</h2><Button onClick={()=>{setDraft({...blank});setError('');setNotice('');}} disabled={busy}><Plus />Add tour</Button></div>
 {error&&<p role="alert" className="mb-4 text-destructive">{error}</p>}{notice&&<p role="status" className="mb-4 text-primary">{notice}</p>}
 {draft&&<form onSubmit={submit} className="mb-8 space-y-5 border-y py-6" key={draft.id??'new'}><div className="flex justify-between"><h3 className="font-display text-2xl text-primary">{draft.id?'Edit tour':'New tour'}</h3><Button type="button" variant="ghost" size="icon" aria-label="Close tour editor" disabled={busy} onClick={()=>setDraft(null)}><X /></Button></div>
 <div className="grid gap-5 sm:grid-cols-2">{(['name','duration','area'] as const).map(key=><label key={key} className="text-sm font-medium capitalize">{key}<input name={key} defaultValue={draft[key]} maxLength={key==='name'?150:100} required className={inputClass}/></label>)}<label className="flex items-center gap-3 text-sm"><input type="checkbox" name="naivasha" defaultChecked={draft.naivasha}/>Naivasha experience</label></div>
 <label className="block text-sm font-medium">Tour description<textarea name="summary" rows={4} defaultValue={draft.summary} minLength={10} maxLength={2000} required className={inputClass}/></label>
 <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-medium">Highlights (one per line)<textarea name="highlights" rows={4} defaultValue={draft.highlights.join('\n')} className={inputClass}/></label><label className="text-sm font-medium">Proposed inclusions (one per line)<textarea name="includes" rows={4} defaultValue={draft.includes.join('\n')} className={inputClass}/></label></div>
 <fieldset><legend className="font-medium">Tour photos</legend><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{draft.photoUrls.map((url,index)=><div key={draft.images[index]} className="relative"><img src={url} alt={`Tour photo ${index+1}`} className="aspect-[4/3] w-full rounded-md object-cover"/><Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1" aria-label={`Remove photo ${index+1}`} disabled={busy} onClick={()=>setDraft(current=>current?{...current,images:current.images.filter((_,i)=>i!==index),photoUrls:current.photoUrls.filter((_,i)=>i!==index)}:null)}><X/></Button>{index===0&&<p className="mt-1 text-xs text-muted-foreground">Cover photo</p>}</div>)}</div><label className="mt-4 flex items-center gap-2 text-sm font-medium"><Upload className="h-4 w-4"/>Add pictures<input type="file" aria-label="Add tour pictures" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={e=>{void addPhotos(e.target.files);e.target.value='';}} className="max-w-full text-sm"/></label><p className="mt-2 text-xs text-muted-foreground">JPG, PNG or WebP · up to 5 MB each · 12 photos maximum</p></fieldset>
 <Button type="submit" disabled={busy}><Save />{busy?'Please wait…':'Save tour'}</Button></form>}
 {deleteTarget&&<div role="alertdialog" aria-label="Delete tour confirmation" className="mb-6 border border-destructive p-5"><p>Delete “{deleteTarget.name}”? Existing bookings and reviews will be kept.</p><div className="mt-4 flex gap-3"><Button variant="destructive" disabled={busy} onClick={deleteTour}>Delete tour</Button><Button variant="outline" disabled={busy} onClick={()=>setDeleteTarget(null)}>Cancel</Button></div></div>}
 {isPending?<p>Loading tours…</p>:loadError?<p role="alert">Tours could not be loaded.</p>:!tours?.length?<p>No tours yet.</p>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{tours.map(t=><article key={t.id} className="overflow-hidden rounded-lg border bg-card"><img src={t.image} alt={t.name} className="aspect-[4/3] w-full object-cover"/><div className="p-4"><h3 className="font-display text-2xl font-semibold text-primary">{t.name}</h3><p className="mt-2 text-sm text-muted-foreground">{t.area} · {t.duration}</p><div className="mt-4 flex gap-2"><Button variant="outline" size="sm" disabled={busy} onClick={()=>{setDraft({...t});setError('');setNotice('');}}><Pencil/>Edit</Button><Button variant="ghost" size="sm" disabled={busy} className="text-destructive" onClick={()=>setDeleteTarget(t)}><Trash2/>Delete</Button></div></div></article>)}</div>}
 </div>;
}
