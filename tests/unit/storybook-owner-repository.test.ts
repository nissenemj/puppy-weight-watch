// @vitest-environment node
import {expect,it,vi}from'vitest';
import type{SupabaseClient}from'@supabase/supabase-js';
import{supabaseImageRepository}from'../../supabase/functions/_shared/supabaseImages';
it.each([false,true])('cleans a delete-during-attachment upload while preserving committed copies: %s',async(committed)=>{
 const owner='10000000-0000-4000-8000-000000000001',id='20000000-0000-4000-8000-000000000001',book='30000000-0000-4000-8000-000000000001';let deleted=false;
 const path=`${owner}/books/${book}/satukuva-${id}.png`;
 const remove=vi.fn(async()=>({error:null}));
 const query=(table:string)=>{const chain={select:()=>chain,eq:()=>chain,is:()=>chain,maybeSingle:async()=>({data:table==='image_jobs'?{id,owner_id:owner,request_id:id,spec:{style:'dog-photo-transform-v1',scene:'princess',inputPath:`${owner}/${id}.png`,notes:''},status:'ready',created_at:'2026-11-09T12:00:00Z',started_at:null,object_path:`${owner}/${id}.png`,error_code:null}:{id:book},error:null})};return chain;};
 const mock={from:query,rpc:vi.fn(async(name:string)=>name==='attach_storybook_image'?{data:null,error:{message:'book_or_image_not_found'}}:{data:deleted&&!committed?[{path}]:[],error:null}),storage:{from:()=>({download:async()=>{deleted=true;return{data:new Blob(['png']),error:null};},upload:async()=>({error:null}),remove})}};
 const repo=supabaseImageRepository(mock as unknown as SupabaseClient);
 await expect(repo.attach(owner,id,book)).rejects.toThrow('book_or_image_not_found');
 if(committed)expect(remove).not.toHaveBeenCalled();else expect(remove).toHaveBeenCalledWith([path]);
});
