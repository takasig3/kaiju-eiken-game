/* Standalone ten-question practice. Does not modify the main battle or daily Supabase records. */
(function(){'use strict';
const modal=document.createElement('div');modal.id='wa-ten-modal';modal.hidden=true;document.body.append(modal);
const style=document.createElement('style');style.textContent=`#wa-ten-modal{position:fixed;inset:0;z-index:100030;background:#07182cdd;display:grid;place-items:center;padding:14px}#wa-ten-modal[hidden]{display:none}#wa-ten-modal .panel{background:#203b5c;color:white;border:2px solid #769ac3;border-radius:18px;padding:18px;width:min(100%,550px);max-height:90dvh;overflow:auto;font:16px system-ui}#wa-ten-modal button{padding:12px;margin:5px 0;border-radius:10px;border:1px solid #8aabd0;background:#345b86;color:white;font-size:16px;cursor:pointer}#wa-ten-modal .option{display:block;width:100%;text-align:left}#wa-ten-modal .top{display:flex;align-items:center;justify-content:space-between;gap:10px}#wa-ten-modal .correct{background:#207657}#wa-ten-modal .incorrect{background:#91434c}#wa-ten-modal .prompt{font-size:21px;font-weight:800;white-space:pre-wrap;overflow-wrap:anywhere;margin:18px 0}#wa-ten-modal .feedback{padding:12px;background:#152b44;border-radius:8px}`;document.head.append(style);
let mode='e',items=[],idx=0,correct=0,answered=false;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function makeItems(m){
 const standard=(typeof WA_400_QUESTIONS!=='undefined'?WA_400_QUESTIONS:[]).filter(x=>x.mode===m&&Array.isArray(x.options)&&x.options.length>=2&&x.answer!=null&&x.stem);
 const exam=standard.map(x=>({prompt:x.stem,answer:String(x.answer),choices:x.options.map(String),explanation:x.explanation||''}));
 if(m==='wh'){
  const pool=(typeof WA_WORLD_QUESTIONS!=='undefined'?WA_WORLD_QUESTIONS:[]).filter(x=>x.q&&Array.isArray(x.options)&&x.options[x.answer]!=null);
  const eras=['古代','中世','近世','近代','現代'];let chosen=[];
  let accuracy=[];try{accuracy=JSON.parse(localStorage.getItem('wordarrow-world-accuracy')||'[]')}catch(e){}
  const recent=accuracy.slice(-20),rate=recent.length?recent.filter(Boolean).length/recent.length:0.65;
  const level=recent.length<10?2:rate>=.8?3:rate<.5?1:2;
  eras.forEach(era=>{const subset=pool.filter(x=>x.era===era);chosen.push(...shuffle(subset.filter(x=>x.level===level).concat(shuffle(subset.filter(x=>x.level!==level)))).slice(0,2))});
  if(chosen.length<10){const used=new Set(chosen.map(x=>x.id));chosen.push(...shuffle(pool.filter(x=>!used.has(x.id))).slice(0,10-chosen.length))}
  return shuffle(chosen).slice(0,10).map(x=>({prompt:x.q,answer:String(x.options[x.answer]),choices:shuffle(x.options.map(String)),explanation:(x.era||'')+'：'+(x.explain||'')}));
 }
 if(m==='e'||m==='e5'){
  const raw=m==='e5'?(typeof E5_POOL!=='undefined'?E5_POOL:[]):(typeof EPOOL!=='undefined'?EPOOL.map(x=>({en:x[0],ja:x[1],s:x[3]})):[]);
  const pool=raw.filter(x=>x.en&&x.ja);const words=shuffle(pool).slice(0,35).map(x=>({prompt:'「'+x.ja+'」を英語で答えよう',answer:x.en,choices:shuffle([x.en,...shuffle([...new Set(pool.filter(y=>y.en!==x.en).map(y=>y.en))]).slice(0,3)]),explanation:x.s||''}));
  return shuffle([...exam,...words]).slice(0,10);
 }
 const raw=m==='k5'?(typeof K5_POOL!=='undefined'?K5_POOL:[]):(typeof KJ!=='undefined'?KJ.map(x=>({k:x[0],r:x[3],w:x[2]})):[]);
 const pool=raw.filter(x=>x.k&&x.r);
 const kanji=shuffle(pool).slice(0,35).map(x=>({prompt:'「'+x.k+'」の読みは？',answer:x.r,choices:shuffle([x.r,...shuffle([...new Set(pool.filter(y=>y.r!==x.r).map(y=>y.r))]).slice(0,3)]),explanation:x.w||''}));
 return shuffle([...exam,...kanji]).slice(0,10);
}
function shell(inner){modal.innerHTML='<div class="panel" role="dialog" aria-modal="true" aria-label="10問チャレンジ"><div class="top"><b>📝 10問チャレンジ</b><button type="button" id="wa-ten-close">✕ 閉じる</button></div>'+inner+'</div>';modal.querySelector('#wa-ten-close').onclick=close}
function close(){modal.hidden=true}
function render(){answered=false;if(idx>=items.length){shell('<h2>結果発表！</h2><p style="font-size:26px">'+correct+' / '+items.length+' 問正解 🎉</p><p>通常のゲームポイントには加算されません。</p><button id="wa-ten-again">もう一度挑戦</button>');modal.querySelector('#wa-ten-again').onclick=()=>open(mode);return}
 const q=items[idx];shell('<p>第'+(idx+1)+'問 / '+items.length+'　正解 '+correct+'問</p><div class="prompt">'+esc(q.prompt)+'</div><div id="wa-ten-options">'+q.choices.map((o,i)=>'<button type="button" class="option" data-option="'+i+'">'+esc(o)+'</button>').join('')+'</div><div id="wa-ten-feedback" aria-live="polite"></div>');modal.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const picked=q.choices[Number(b.dataset.option)];const ok=picked===q.answer;if(ok)correct++;modal.querySelectorAll('[data-option]').forEach(el=>{el.disabled=true;if(q.choices[Number(el.dataset.option)]===q.answer)el.classList.add('correct');else if(el===b)el.classList.add('incorrect')});const fb=modal.querySelector('#wa-ten-feedback');fb.innerHTML='<div class="feedback">'+(ok?'⭕ 正解！':'❌ 不正解')+'<p>正解：'+esc(q.answer)+'</p><p>'+esc(q.explanation)+'</p></div><button id="wa-ten-next">'+(idx===items.length-1?'結果を見る':'次の問題へ')+'</button>';modal.querySelector('#wa-ten-next').onclick=()=>{idx++;render()}})}
function open(m){mode=m;items=makeItems(m);idx=0;correct=0;modal.hidden=false;if(!items.length){shell('<p>問題データを取得できませんでした。科目：'+esc(m)+'。index.htmlとwa-ten-challenge.jsのバージョンを確認してください。</p>');return}render()}
modal.addEventListener('click',e=>{if(e.target===modal)close()});window.WATenChallenge={open};
})();
