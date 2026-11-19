/* Word Arrow: 13 companions, cumulative points across all five courses. */
(function(){'use strict';
const prefix='wa-companion-standalone-v1:';
const thresholds=[0,0,0,40000,80000,120000,160000,200000,250000,300000,400000,500000,700000];
const names=['ライボルトン','アクアフィン','アースゴーレム','モンスター4','モンスター5','モンスター6','モンスター7','モンスター8','モンスター9','モンスター10','お助けキャラ','5連鎖の隠し相棒','10連鎖の隠し相棒'];
const get=(k,d)=>{try{let v=localStorage.getItem(prefix+k);return v===null?d:JSON.parse(v)}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(prefix+k,JSON.stringify(v))}catch(e){}};
const legacy=suffix=>{try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('wa-guild-v2:')&&k.endsWith(':'+suffix))return JSON.parse(localStorage.getItem(k))}}catch(e){}return null};
// Recover older cumulative totals without ever replacing a higher saved total with zero.
function recoveredPoints(){
 const candidates=[get('points',0),legacy('companion-total-points'),legacy('companion-points')];
 try{for(let i=0;i<localStorage.length;i++){
  const k=localStorage.key(i)||'';
  if(!/^(wa-guild-v2:.*:(companion-total-points|companion-points)|wa-companion-standalone-v1:points)$/.test(k))continue;
  try{candidates.push(JSON.parse(localStorage.getItem(k)))}catch(e){}
 }}catch(e){}
 return Math.max(0,...candidates.map(x=>Number(x)).filter(x=>Number.isFinite(x)&&x>=0));
}
let points=recoveredPoints();
let selected=Math.max(0,Math.min(12,Number(get('selected',legacy('companion')||0))||0));
set('points',points);
const imagePath=i=>i===11?'special-ally.webp':i===12?'special-ally-10.webp':i===10?'special-ally.webp':'assets/monster-'+String(i+1).padStart(2,'0')+'.webp';
const foodKey='food-count';
let food=Math.max(0,Number(get(foodKey,3))||0);
const fmt=n=>Math.floor(n).toLocaleString('ja-JP');
const css=document.createElement('style');css.textContent=`
#wa-companion{position:fixed;z-index:9000;right:clamp(4px,2vw,18px);bottom:calc(8px + env(safe-area-inset-bottom,0px));width:clamp(82px,12vw,135px);text-align:center;pointer-events:none;font:800 12px system-ui,sans-serif}
#wa-companion button{background:none;border:0;padding:0;cursor:pointer;pointer-events:auto}
#wa-companion img{display:block;width:100%;max-height:130px;object-fit:contain;filter:drop-shadow(0 4px 5px #0005);animation:wa-comp-float 2.2s ease-in-out infinite}
#wa-companion .bubble{display:inline-block;background:#fff;border:2px solid #e3b95e;border-radius:99px;padding:3px 8px;color:#14233b;white-space:nowrap;box-shadow:0 2px 5px #0002}
@keyframes wa-comp-float{50%{transform:translateY(-7px)}}
#wa-comp-modal{position:fixed;inset:0;z-index:100020;background:#0b1b30c9;display:flex;align-items:center;justify-content:center;padding:16px}
#wa-comp-modal[hidden]{display:none!important}
#wa-comp-modal .dialog{max-width:570px;width:100%;max-height:85dvh;overflow:auto;background:#1b3150;border:1px solid #7c99c0;border-radius:18px;color:white;padding:20px;text-align:center;font:16px system-ui}
#wa-comp-modal .wa-comp-header{display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:-12px;background:#1b3150;z-index:2;padding:6px 0}#wa-comp-modal .wa-comp-header h2{margin:0}#wa-comp-modal .picker{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:14px 0}
#wa-comp-modal button{cursor:pointer;border:2px solid #6985ad;background:#2d496b;color:#fff;border-radius:10px;padding:7px}
#wa-comp-modal button.active{border-color:#ffd469}
#wa-comp-modal button:disabled{opacity:.65;cursor:default}
#wa-comp-modal .picker img{width:100%;aspect-ratio:1;object-fit:contain}
#wa-comp-modal .wa-secret{aspect-ratio:1;display:grid;place-items:center;font-size:clamp(36px,6vw,64px);font-weight:900;color:#ffda72;text-shadow:0 3px 10px #0009}
#wa-comp-modal .picker small{display:block;line-height:1.35;font-size:11px;overflow-wrap:anywhere}
#wa-comp-modal .wa-feed{margin:12px 0;padding:12px;background:#304d70;border-radius:14px;display:grid;gap:8px;justify-items:center}
#wa-comp-modal .wa-feed button{background:#ffd56e;color:#24324a;font-weight:900;min-height:48px;padding:9px 18px}
#wa-comp-modal .wa-feed img{height:90px;max-width:120px;object-fit:contain}
#wa-comp-modal .wa-feed .happy{animation:wa-comp-happy .65s ease-in-out}
@keyframes wa-comp-happy{0%,100%{transform:scale(1)}40%{transform:translateY(-14px) scale(1.2)}70%{transform:rotate(8deg)}}
#wa-comp-modal .wa-progress{color:#c6d6ed;font-size:13px;margin:4px 0 10px}
@media(max-width:699px){#wa-companion{width:100px;right:3px;bottom:calc(3px + env(safe-area-inset-bottom,0px))}#wa-companion img{max-height:98px}#wa-companion .bubble{font-size:10px}#wa-comp-modal .dialog{padding:12px}#wa-comp-modal .picker{gap:5px}}
@media(prefers-reduced-motion:reduce){#wa-companion img{animation:none}}
`;document.head.append(css);
const root=document.createElement('div');root.id='wa-companion';root.innerHTML='<div class="bubble">がんばれ！</div><button aria-label="相棒を選ぶ" type="button"><img alt="応援する相棒"></button>';document.body.append(root);
const modal=document.createElement('div');modal.id='wa-comp-modal';modal.hidden=true;document.body.append(modal);
function refresh(){if(points<thresholds[selected]){selected=0;set('selected',selected)}const img=root.querySelector('img');img.src=imagePath(selected);img.alt=names[selected]}
function open(){
 modal.hidden=false;
 const next=thresholds.find(x=>x>points);
 const progress=next===undefined?'全13体を解放しました！':'次の解放まで '+fmt(next-points)+' pt';
 modal.innerHTML='<div class="dialog" role="dialog" aria-modal="true" aria-label="マイ相棒"><div class="wa-comp-header"><h2>🐾 マイ相棒</h2><button type="button" id="wa-comp-close">✕ 閉じる</button></div><p>最初の3体は自由に選べます。累計ポイントで順番に解放！</p><p>累計ポイント：<strong>'+fmt(points)+' pt</strong></p><p class="wa-progress">'+progress+'</p><div class="wa-feed"><img id="wa-feed-img" src="'+imagePath(selected)+'" alt="選択中の相棒"><strong>'+names[selected]+'</strong><span id="wa-food-count">🍙 ご飯：'+fmt(food)+'個</span><button type="button" id="wa-feed-btn" '+(food<=0?'disabled':'')+'>🍚 ご飯をあげる</button><p id="wa-feed-message" aria-live="polite">'+(food>0?'ご飯をあげて相棒を喜ばせよう！':'ご飯がありません')+'</p></div><div class="picker">'+names.map((n,i)=>{const locked=points<thresholds[i];const secret=locked&&i>=11;return '<button type="button" data-i="'+i+'" '+(locked?'disabled':'')+' class="'+(selected===i?'active':'')+'" aria-label="'+(secret?'隠し相棒':n)+(locked?' 未解放':'')+'">'+(secret?'<div class="wa-secret" aria-hidden="true">？</div>':'<img src="'+imagePath(i)+'" alt="" onerror="this.style.visibility=\'hidden\'">')+'<small>'+(locked?'🔒 '+fmt(thresholds[i])+'pt':n)+'</small></button>'}).join('')+'</div></div>';
 modal.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{selected=Number(b.dataset.i);set('selected',selected);refresh();open()});
 modal.querySelector('#wa-feed-btn').onclick=()=>{if(food<=0)return;food--;set(foodKey,food);modal.querySelector('#wa-food-count').textContent='🍙 ご飯：'+fmt(food)+'個';const messages=['おいしい！ありがとう！','元気いっぱい！','もっとがんばるね！','やったー！'];modal.querySelector('#wa-feed-message').textContent=messages[Math.floor(Math.random()*messages.length)];const im=modal.querySelector('#wa-feed-img');im.classList.remove('happy');void im.offsetWidth;im.classList.add('happy');modal.querySelector('#wa-feed-btn').disabled=food<=0;};
 modal.querySelector('#wa-comp-close').onclick=()=>modal.hidden=true;
}
function addPoints(delta){delta=Number(delta);if(!Number.isFinite(delta)||delta<=0)return;points+=delta;set('points',points);if(!modal.hidden)open()}
/* Called by the main game's score update; count positive increments only, not a new game's reset. */
let runScore=0;
window.addEventListener('wa:companion-new-run',()=>{runScore=0});
window.addEventListener('wa:companion-score',e=>{const n=Number(e.detail&&e.detail.score);if(!Number.isFinite(n)||n<0)return;if(n<runScore){runScore=n;return}const delta=n-runScore;runScore=n;addPoints(delta)});
window.WACompanion={getPoints:()=>points,addPoints,open,addFood:(n=1)=>{food+=Math.max(0,Math.floor(Number(n)||0));set(foodKey,food);if(!modal.hidden)open();},getFood:()=>food};
root.querySelector('button').onclick=open;document.addEventListener('click',e=>{if(e.target.closest('#wa-lobby-companion'))open()});modal.onclick=e=>{if(e.target===modal)modal.hidden=true};refresh();
})();
