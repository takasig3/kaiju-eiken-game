/* World history ranking in the existing leaderboard; refreshes with its update button. */
(function(){
 'use strict';
 const ID='wa-world-shared-ranking';
 let scheduled=false;
 function attach(){
  if(scheduled)return;scheduled=true;
  queueMicrotask(()=>{scheduled=false;
   const candidates=[...document.querySelectorAll('button')];
   const refresh=candidates.find(b=>/ランキング更新/.test(b.textContent||''));
   if(!refresh)return;
   const panel=refresh.closest('section,article,.panel,.card,.ranking-panel')||refresh.parentElement;
   if(!panel)return;
   let target=panel.querySelector('#'+ID);
   if(!target){target=document.createElement('section');target.id=ID;target.style.cssText='margin:18px 0 12px;padding-top:14px;border-top:1px solid currentColor';refresh.parentNode.insertBefore(target,refresh);}
   if(!refresh.dataset.waWorldRefresh){
    refresh.dataset.waWorldRefresh='1';
    refresh.addEventListener('click',()=>{if(window.WAWorldOnline)window.WAWorldOnline.render(ID);},{capture:false});
   }
   if(!target.dataset.loaded){target.dataset.loaded='1';if(window.WAWorldOnline)window.WAWorldOnline.render(ID);else target.textContent='世界史ランキングの読み込みに失敗しました。world-online.js を確認してください。';}
  });
 }
 const observer=new MutationObserver(attach);
 observer.observe(document.documentElement,{subtree:true,childList:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);else attach();
})();
