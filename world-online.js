/* World history leaderboard: uses existing supabase-config.js and anonymous auth. */
(function(){
'use strict';
let clientPromise;
function check(r){if(r.error)throw r.error;return r.data}
async function getClient(){
 if(clientPromise)return clientPromise;
 clientPromise=(async()=>{
  const cfg=window.WORD_ARROW_SUPABASE;
  if(!cfg || !cfg.url || !cfg.publishableKey)throw Error('supabase-config.js が未設定です');
  if(!window.supabase)throw Error('Supabaseライブラリを読み込めません');
  const c=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{storageKey:'wa-world-auth'}});
  let s=check(await c.auth.getSession()).session;
  if(!s)s=check(await c.auth.signInAnonymously()).session;
  if(!s?.user)throw Error('匿名認証に失敗しました。SupabaseのAnonymous Sign-insを有効にしてください');
  return c;
 })();
 try{return await clientPromise}catch(e){clientPromise=null;throw e}
}
function esc(v){return String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
async function submit(r){
 const c=await getClient();
 return check(await c.rpc('wa_world_submit_score',{p_nickname:String(r.nickname||'ななし').slice(0,20),p_score:Math.max(0,Math.floor(r.score||0)),p_stages:Math.max(0,Math.min(10,Math.floor(r.stages||0))),p_correct:Math.max(0,Math.floor(r.correct||0)),p_total:Math.max(0,Math.floor(r.total||0))}));
}
async function render(id){
 const el=document.getElementById(id);if(!el)return;
 el.innerHTML='<p style="font-weight:800">🌍 世界史・みんなのランキングを読み込み中…</p>';
 try{
  const c=await getClient();const rows=check(await c.rpc('wa_world_ranking',{p_limit:30}))||[];
  if(!document.getElementById(id))return;
  el.innerHTML='<h3 style="margin:16px 0 8px">🌍 世界史・みんなのランキング TOP 30</h3>'+
    '<p style="font-size:12px;color:#667">全参加者の自己ベスト。ほかの端末からも閲覧できます。</p>'+
    (rows.length?'<ol style="padding-left:30px">'+rows.map(x=>'<li style="padding:7px 0;border-bottom:1px solid #ddd"><b>'+esc(x.nickname)+'</b>　<strong>'+Number(x.score).toLocaleString()+' pt</strong> <small>STAGE '+Number(x.stages)+'</small></li>').join('')+'</ol>':'<p>まだ記録がありません。最初の挑戦者になろう！</p>')+
    '<button type="button" id="wa-world-refresh-'+id+'" style="padding:9px 14px;border-radius:9px;border:1px solid #aaa;background:white;color:#18242f">↻ 更新</button>';
  const btn=document.getElementById('wa-world-refresh-'+id);if(btn)btn.onclick=()=>render(id);
 }catch(e){if(document.getElementById(id))el.textContent='世界史ランキングを表示できません：'+e.message+'。SQLと匿名ログイン設定を確認してください。'}
}
window.WAWorldOnline={submit,render};
})();
