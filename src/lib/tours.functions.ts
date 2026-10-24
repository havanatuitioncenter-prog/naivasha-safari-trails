import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { queryOptions } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';
import { tours as originalTours, tourSlug, type Tour } from './site';
export type ManagedTour = Tour & { id: string; slug: string; images: string[]; photoUrls: string[] };
export const listTours = createServerFn({ method: 'GET' }).handler(async (): Promise<ManagedTour[]> => {
 const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
 if (!url || !key) throw new Error('Tours are temporarily unavailable.');
 const client = createClient<Database>(url,key,{ auth:{persistSession:false,autoRefreshToken:false}, global:{fetch:(input,init)=>{ const h=new Headers(init?.headers); if(key.startsWith('sb_')&&h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization'); h.set('apikey',key); return fetch(input,{...init,headers:h}); }} });
 const {data,error}=await client.from('tours').select('*').order('sort_order').order('created_at');
 if(error) throw new Error('Tours are temporarily unavailable.');
 const paths=[...new Set((data??[]).flatMap(t=>t.images))];
 const urls=new Map<string,string>();
 if(paths.length){
  // Only sign object paths already read from the public catalogue; no caller-supplied paths.
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {data:signed,error:signError}=await supabaseAdmin.storage.from('tour-photos').createSignedUrls(paths,3600);
  if(signError) throw new Error('Tour photos are temporarily unavailable.');
  for(const item of signed??[]) if(item.path&&item.signedUrl) urls.set(item.path,item.signedUrl.replace(url,import.meta.env.VITE_SUPABASE_URL));
 }
 return (data??[]).map(t=>{const photoUrls=t.images.map(p=>urls.get(p)).filter((p):p is string=>Boolean(p));return {...t, photoUrls,image:photoUrls[0]??originalTours.find(o=>tourSlug(o.name)===t.slug)?.image??originalTours[0]?.image??''};});
});
export const toursQueryOptions = queryOptions({queryKey:['tours'],queryFn:()=>listTours(),staleTime:60000});
