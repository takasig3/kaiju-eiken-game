/* Word Arrow lobby — no group registration, shared game invitation. */
(async function(){
'use strict';
const panel=document.createElement('section');panel.id='wa-online';panel.hidden=false;
const style=document.createElement('style');style.textContent=`
#wa-online{position:fixed;inset:0;z-index:99999;background:#0e1b32;color:#fff;overflow:auto;overscroll-behavior:contain;padding:clamp(14px,4vw,28px) 14px 38px;font-family:system-ui,-apple-system,sans-serif}
#wa-online[hidden]{display:none!important}
#wa-online .wa-card{max-width:510px;margin:0 auto;border:1px solid #49688c;border-radius:27px;background:#192e4e;padding:clamp(18px,4vw,25px);box-shadow:0 12px 40px #0004}
#wa-online h1{font-size:clamp(25px,5vw,32px);margin:0 0 5px;font-weight:900}
#wa-online h2{font-size:clamp(21px,5vw,27px);margin:0 0 10px;font-weight:900}
#wa-online p{margin:7px 0 13px;line-height:1.55}
#wa-online .wa-status{color:#9ed5c3;font-weight:800;font-size:15px;margin:0 0 17px}
#wa-online .wa-banner{padding:21px 19px;background:linear-gradient(115deg,#192e4e,#315982);border:1px solid #597ca5;border-radius:22px;margin-bottom:20px}
#wa-online .wa-banner small{font-weight:900;color:#ffc35d;letter-spacing:.14em;font-size:12px}
#wa-online .wa-subcard{border:1px solid #52739a;background:#233957;border-radius:22px;padding:19px;margin:16px 0}
#wa-online label{display:block;font-weight:800;margin:10px 0 8px}
#wa-online input{display:block;width:100%;background:#10233f;color:#fff;border:1px solid #647e9f;border-radius:11px;padding:14px;font:inherit;box-sizing:border-box;margin:9px 0 12px}
#wa-online button{border:0;border-radius:13px;padding:13px 18px;font:inherit;font-weight:900;cursor:pointer;background:#e7ae3e;color:#13233b;margin:4px 7px 4px 0}
#wa-online button.secondary{background:#dce6f3;color:#162940}
#wa-online button.start{display:block;width:100%;background:#d93625;color:white;font-size:clamp(18px,5vw,24px);padding:18px 10px;margin:19px 0 8px}
#wa-online .wa-hint{font-size:12px;color:#c5d4e7;line-height:1.55}
#wa-online #wa-share-box[hidden]{display:none!important}
#wa-online .wa-qr{display:block;width:205px;max-width:85%;margin:16px auto;background:white;padding:10px;border-radius:12px}
#wa-online #wa-lobby-ranking{margin-top:0}#wa-online #wa-lobby-world-rank{max-height:230px;overflow:auto}#wa-online .wa-rank-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin:8px 0}#wa-online .wa-rank-tabs button{font-size:12px;padding:9px 3px;margin:0;background:#315274;color:white}#wa-online .wa-rank-tabs button[aria-selected="true"]{background:#f4b84e;color:#14213b}#wa-online .wa-rank-list{padding:0;list-style:none;margin:8px 0}#wa-online .wa-rank-list li{display:flex;gap:8px;align-items:center;padding:9px 4px;border-bottom:1px solid #ffffff24;font-size:14px}#wa-online .wa-rank-list strong{margin-left:auto;white-space:nowrap}#wa-online #wa-lobby-world-rank li{font-size:14px}#wa-online #wa-lobby-companion{cursor:pointer}#wa-online .wa-result{font-size:13px;color:#a7e8c8;min-height:18px}
`;document.head.append(style);document.body.append(panel);
const gameUrl=location.origin+location.pathname;
panel.innerHTML=`<div class="wa-card"><h1>🏹 ワードアロー</h1><p id="wa-status" class="wa-status">オンライン接続を確認中…</p>
<div class="wa-subcard" id="wa-lobby-ranking"><h2>🏆 ランキング</h2><div class="wa-rank-tabs" id="wa-rank-tabs" role="tablist" aria-label="コース別ランキング"></div><div id="wa-lobby-world-rank" aria-live="polite">ランキングを読み込み中…</div></div>
<div class="wa-subcard"><h2>🦊 プレイヤー名</h2><p>ランキングに表示する名前（20文字まで）</p><input id="wa-nick" maxlength="20" autocomplete="nickname" placeholder="例：たろう"><button id="wa-save">名前を保存</button><p id="wa-name-result" class="wa-result"></p></div>
<button class="start" id="wa-start">🎮 ゲームを始める</button>
<div class="wa-subcard"><h2>🔗 友達を招待</h2><p>リンクかQRコードを送るだけで、同じゲームに参加できます。</p><button id="wa-share" class="secondary" aria-expanded="false">招待リンク・QRコードを表示</button><div id="wa-share-box" hidden><label for="wa-invite-url">ゲームのURL</label><input id="wa-invite-url" readonly><button id="wa-copy">📋 リンクをコピー</button><button id="wa-native" class="secondary">共有する</button><img class="wa-qr" id="wa-qr" alt="ワードアロー招待QRコード"><p class="wa-hint">QRコードの表示にはインターネット接続が必要です。</p></div></div>
<p class="wa-hint">ニックネームはこの端末にも保存します。匿名アカウントは端末・ブラウザを変えると引き継がれない場合があります。</p></div>`;
const $=id=>document.getElementById(id),status=$('wa-status');
const nickKey='wa-online-nickname';
let saved=localStorage.getItem(nickKey)||'';
// Preserve the nickname stored by earlier versions when a recognizable key exists.
if(!saved){for(const k of ['wa-nickname','wa_nickname','word-arrow-nickname','wa_player_name']){let v=localStorage.getItem(k);if(v&&v.length<=20){saved=v;break}}}
$('wa-nick').value=saved;
let client=null;
try{const cfg=window.WORD_ARROW_SUPABASE;if(!cfg?.url||!cfg?.publishableKey||!window.supabase)throw Error('Supabase設定が読み込まれていません');client=window.supabase.createClient(cfg.url,cfg.publishableKey);let {data,error}=await client.auth.getSession();if(error)throw error;if(!data.session){const r=await client.auth.signInAnonymously();if(r.error)throw r.error;}status.textContent='オンライン接続済み';}catch(e){status.textContent='オンライン接続を確認できません（ゲームは利用できます）';}
$('wa-save').onclick=async()=>{let name=$('wa-nick').value.trim().slice(0,20);if(!name){$('wa-name-result').textContent='名前を入力してください';return}localStorage.setItem(nickKey,name);$('wa-name-result').textContent='この端末に名前を保存しました';if(client){try{const r=await client.rpc('wa_set_profile',{p_nickname:name,p_avatar:'🦊'});if(r.error)throw r.error;$('wa-name-result').textContent='名前を保存しました';}catch(e){$('wa-name-result').textContent='端末に保存しました。オンラインプロフィールの更新は確認できませんでした';}}};
$('wa-start').onclick=()=>{panel.hidden=true};
const courses=[['e','英検4級','eiken4'],['e5','英検5級','eiken5'],['k','漢検4級','kanken4'],['k5','漢検5級','kanken5'],['wh','世界史','world']];
let activeCourse='e';
function rankEscape(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function showLobbyRanking(){
 const dest=$('wa-lobby-world-rank');const selected=activeCourse;
 const course=courses.find(x=>x[0]===selected);dest.textContent=course[1]+'の上位3名を読み込み中…';
 if(selected==='wh'){
  if(window.WAWorldOnline?.render){window.WAWorldOnline.render('wa-lobby-world-rank',3);return}
  dest.textContent='世界史ランキングを読み込めません';return;
 }
 try{
  if(!client)throw Error('オンライン未接続');
  const {data,error}=await client.rpc('wa_course_ranking',{p_subject:course[2],p_limit:3});if(error)throw error;
  if(activeCourse!==selected)return;
  const rows=Array.isArray(data)?data:[];
  dest.innerHTML=rows.length?'<ol class="wa-rank-list">'+rows.map((r,i)=>'<li><span>'+(i===0?'🥇':i===1?'🥈':'🥉')+'</span><span>'+rankEscape(r.nickname||'ななし')+'</span><strong>'+Number(r.score||0).toLocaleString()+' pt</strong></li>').join('')+'</ol>':'<p>まだ記録がありません。最初の挑戦者になろう！</p>';
 }catch(e){if(activeCourse===selected)dest.innerHTML='<p>この科目のオンラインランキングは未設定です。</p><p class="wa-hint">付属のSQLをSupabaseに適用してください。</p>'}
}
const tabs=$('wa-rank-tabs');courses.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c[1];b.setAttribute('role','tab');b.onclick=()=>{activeCourse=c[0];[...tabs.children].forEach((x,i)=>x.setAttribute('aria-selected',String(courses[i][0]===activeCourse)));showLobbyRanking()};tabs.append(b)});tabs.firstElementChild.setAttribute('aria-selected','true');showLobbyRanking();
window.WACourseRanking={refresh:showLobbyRanking};
$('wa-share').onclick=()=>{const host=$('wa-share-box');host.hidden=!host.hidden;$('wa-share').setAttribute('aria-expanded',String(!host.hidden));if(!host.hidden){$('wa-invite-url').value=gameUrl;$('wa-qr').src='https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=12&data='+encodeURIComponent(gameUrl)}};
$('wa-copy').onclick=async()=>{try{await navigator.clipboard.writeText(gameUrl);$('wa-copy').textContent='✓ コピーしました'}catch(e){$('wa-invite-url').select();$('wa-copy').textContent='URLを選択しました'}};
$('wa-native').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'ワードアロー',url:gameUrl})}catch(e){}}else{$('wa-invite-url').select();}};
})();

/* Submit regular-course results after a completed battle. */
window.WAOnline={submitNormalScore:async function(r){
 const cfg=window.WORD_ARROW_SUPABASE;
 if(!cfg?.url||!cfg?.publishableKey||!window.supabase)throw Error('Supabase未設定');
 const c=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{storageKey:'wa-course-auth'}});
 let {data,error}=await c.auth.getSession();if(error)throw error;
 if(!data.session){const a=await c.auth.signInAnonymously();if(a.error)throw a.error}
 const nickname=(localStorage.getItem('wa-online-nickname')||localStorage.getItem('wordarrow-name')||'ななし').slice(0,20);
 const result=await c.rpc('wa_course_submit_score',{p_subject:r.subject,p_nickname:nickname,p_score:Math.max(0,Math.floor(r.score||0)),p_stages:Math.max(0,Math.floor(r.stages||0))});
 if(result.error)throw result.error;
 window.WACourseRanking?.refresh();return result.data;
}};
