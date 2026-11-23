/* Companion restored as an independent feature; no guild required. */
(function(){'use strict';
const key='wa-companion-standalone-v1';
const names=['ライボルトン','アクアフィン','アースゴーレム','モンスター4','モンスター5','モンスター6','モンスター7','モンスター8','モンスター9','モンスター10','5連鎖のお助けキャラ','10連鎖のお助けキャラ','イタズラ・バットJr.'];
const unlock=[0,0,0,40000,80000,120000,160000,200000,250000,300000,400000,500000,700000];
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(key+':'+k))??d}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(key+':'+k,JSON.stringify(v))}catch(e){}};
const legacy=(suffix)=>{try{for(let i=0;i<localStorage.length;i++){let k=localStorage.key(i);if(k&&k.startsWith('wa-guild-v2:')&&k.endsWith(':'+suffix))return localStorage.getItem(k)}}catch(e){}return null};
let points=get('points',null);if(points===null){points=Number(legacy('companion-total-points')||0);set('points',points)}
let selected=get('selected',null);if(selected===null){selected=Number(legacy('companion')||0);set('selected',selected)}
const css=document.createElement('style');css.textContent=`
#wa-companion{position:fixed;z-index:9000;right:clamp(4px,2vw,18px);bottom:calc(8px + env(safe-area-inset-bottom,0px));width:clamp(82px,12vw,135px);text-align:center;pointer-events:none;font:800 12px system-ui,sans-serif}
#wa-companion button{background:none;border:0;padding:0;cursor:pointer;pointer-events:auto}
#wa-companion img{display:block;width:100%;max-height:130px;object-fit:contain;filter:drop-shadow(0 4px 5px #0005);animation:wa-comp-float 2.2s ease-in-out infinite}
#wa-companion .bubble{display:inline-block;background:#fff;border:2px solid #e3b95e;border-radius:99px;padding:3px 8px;color:#14233b;white-space:nowrap;box-shadow:0 2px 5px #0002}
@keyframes wa-comp-float{50%{transform:translateY(-7px)}}
#wa-comp-modal{position:fixed;inset:0;z-index:100020;background:#0b1b30c9;display:flex;align-items:center;justify-content:center;padding:16px}
#wa-comp-modal[hidden]{display:none!important}
#wa-comp-modal .dialog{max-width:480px;width:100%;max-height:85dvh;overflow:auto;background:#1b3150;border:1px solid #7c99c0;border-radius:18px;color:white;padding:20px;text-align:center;font:16px system-ui}
#wa-comp-modal .picker{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:14px 0}
#wa-comp-modal button{cursor:pointer;border:2px solid #6985ad;background:#2d496b;color:#fff;border-radius:10px;padding:7px}
#wa-comp-modal button.active{border-color:#ffd469}
#wa-comp-modal button:disabled{opacity:.45;cursor:default}
#wa-comp-modal .picker img{width:100%;aspect-ratio:1;object-fit:contain}
#wa-comp-modal .wa-secret{aspect-ratio:1;display:grid;place-items:center;font-size:48px;color:#ffda72;font-weight:900}
@media(max-width:699px){#wa-companion{width:100px;right:3px;bottom:calc(3px + env(safe-area-inset-bottom,0px))}#wa-companion img{max-height:98px}#wa-companion .bubble{font-size:10px}}
@media(prefers-reduced-motion:reduce){#wa-companion img{animation:none}}
`;document.head.append(css);
const root=document.createElement('div');root.id='wa-companion';root.innerHTML='<div class="bubble">がんばれ！</div><button aria-label="相棒を選ぶ" type="button"><img alt="応援する相棒"></button>';document.body.append(root);
const modal=document.createElement('div');modal.id='wa-comp-modal';modal.hidden=true;document.body.append(modal);
const path=i=>i===10?'special-ally.webp':i===11?'special-ally-10.webp':i===12?'assets/wa-prank-bat.webp':'assets/monster-'+String(i+1).padStart(2,'0')+'.webp';
function refresh(){selected=Math.min(12,Math.max(0,selected));if(points<unlock[selected])selected=0;root.querySelector('img').src=path(selected);root.querySelector('img').alt=names[selected];}
function open(){modal.hidden=false;modal.innerHTML='<div class="dialog" role="dialog" aria-modal="true"><h2>🐾 マイ相棒</h2><p>相棒を選ぼう！ 最初の3体は自由に選べます。</p><p>累計ポイント：'+Math.floor(points).toLocaleString()+' pt</p><div class="picker">'+names.map((n,i)=>'<button data-i="'+i+'" '+(points<unlock[i]?'disabled':'')+' class="'+(selected===i?'active':'')+'"><img src="'+path(i)+'" alt="'+n+'" onerror="this.style.display=\'none\'"><small>'+(points<unlock[i]?'🔒 '+unlock[i].toLocaleString()+'pt':n)+'</small></button>').join('')+'</div><button id="wa-comp-close">閉じる</button></div>';modal.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{selected=Number(b.dataset.i);set('selected',selected);refresh();open()});modal.querySelector('#wa-comp-close').onclick=()=>modal.hidden=true;}
let runScore=0;
window.addEventListener('wa:companion-new-run',()=>{runScore=0});
window.addEventListener('wa:companion-score',e=>{const n=Number(e.detail&&e.detail.score);if(!Number.isFinite(n)||n<0)return;if(n<runScore){runScore=n;return}const delta=n-runScore;runScore=n;if(delta>0){points+=delta;set('points',points);if(!modal.hidden)open()}});
window.WACompanion={getPoints:()=>points,addPoints:(delta)=>{delta=Number(delta);if(Number.isFinite(delta)&&delta>0){points+=delta;set('points',points);if(!modal.hidden)open()}},open};
root.querySelector('button').onclick=open;modal.onclick=e=>{if(e.target===modal)modal.hidden=true};refresh();
})();