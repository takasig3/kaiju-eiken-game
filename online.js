/* Word Arrow online lobby. Game scoring remains LOCAL until a server-verified scoring system is implemented. */
(async function () {
  'use strict';
  const config=window.WORD_ARROW_SUPABASE;
  const panel=document.createElement('div');panel.id='wa-online';
  panel.innerHTML=`<div class="wa-online-card"><h1>🏹 ワードアロー</h1><p id="wa-status">Supabaseに接続中…</p><div id="wa-content"></div></div>`;
  document.body.append(panel);
  const style=document.createElement('style');
  style.textContent=`#wa-online{position:fixed;inset:0;z-index:99999;background:#f3f6fb;overflow:auto;padding:30px 14px;font:16px system-ui,sans-serif;color:#152233}#wa-online[hidden]{display:none!important}.wa-online-card{max-width:510px;margin:15px auto;padding:25px;background:white;border:1px solid #dce3ed;border-radius:20px;box-shadow:0 12px 30px #15223312}.wa-online-card h1{font-size:28px}.wa-online-card input,.wa-online-card select{width:100%;box-sizing:border-box;border:1px solid #c4cdd9;border-radius:9px;padding:12px;margin:7px 0 14px;font:inherit}.wa-online-card button{background:#2456c8;color:white;border:0;border-radius:9px;padding:12px 15px;margin:5px 6px 5px 0;font:inherit;cursor:pointer}.wa-online-card button.secondary{background:#e9eef7;color:#152233}.wa-online-card .group{border:1px solid #dce3ed;padding:12px;border-radius:12px;margin:10px 0}.wa-online-card .hint{font-size:13px;color:#64748b}.wa-online-card .error{color:#ba2222}`;
  style.textContent+=`
.wa-online-card{max-width:680px;padding:clamp(16px,3vw,28px)}
.wa-online-card button{transition:transform .15s,filter .15s;font-weight:700}
.wa-online-card button:hover{filter:brightness(.96);transform:translateY(-1px)}
.wa-invite-panel{background:#f5f8fc;border:1px solid #dce5f0;border-radius:14px;padding:14px;margin:18px 0}
.wa-invite-panel .wa-invite-label{font-weight:800;margin:0 0 8px}
.wa-invite-row{display:flex;align-items:stretch;border:1px solid #bacadd;border-radius:11px;overflow:hidden;background:white}
.wa-online-card .wa-invite-row input{min-width:0;flex:1;border:0;margin:0;padding:12px;background:transparent;border-radius:0;font-size:14px}
.wa-online-card .wa-invite-row button{flex-shrink:0;margin:0;border-radius:0;background:#34465d;padding:11px 16px}
.wa-online-card button.wa-primary-play{display:block;width:100%;padding:16px;background:#d83927;font-size:18px;margin:18px 0 22px;border-radius:13px}
.wa-daily-wrap{border-top:1px solid #dce5f0;padding-top:14px}
.wa-daily-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:14px 0}
.wa-grade-card{padding:16px;border-radius:15px;border:1px solid;min-width:0}
.wa-grade-card h4{font-size:19px;margin:0 0 3px}
.wa-grade-card p{font-size:12px;margin:0 0 12px;color:#54647a}
.wa-grade-card.grade5{background:#eefaf3;border-color:#b9e2cb}
.wa-grade-card.grade4{background:#eff5ff;border-color:#bed2f6}
.wa-online-card .wa-grade-card button{display:block;width:100%;margin:7px 0 0;text-align:center;padding:11px 7px;font-size:14px}
.wa-online-card .wa-grade-card.grade5 button{background:#16835a}
.wa-online-card .wa-grade-card.grade4 button{background:#275bc0}
.wa-rank-group{border:1px solid #dce5f0;border-radius:12px;margin:10px 0;overflow:hidden}
.wa-rank-group summary{cursor:pointer;padding:12px 14px;font-weight:800;background:#f6f8fc}
.wa-rank-group.grade5 summary{border-left:5px solid #16835a}
.wa-rank-group.grade4 summary{border-left:5px solid #275bc0}
.wa-rank-body{padding:3px 14px 12px}
.wa-rank-body h4{margin:12px 0 5px}
.wa-rank-body ol{padding-left:24px}
@media(max-width:520px){.wa-daily-grid{grid-template-columns:1fr}.wa-online-card .wa-invite-row button{padding:10px}.wa-grade-card{padding:13px}}
`;

  style.textContent+=`
/* Accessible high-contrast primary action */
.wa-online-card button.wa-primary-play{background:#d83927!important;color:#fff!important;text-shadow:0 1px 1px #842018;font-weight:900}
.wa-online-card button.wa-primary-play:focus-visible{outline:3px solid #fff;outline-offset:3px}
.wa-daily-tiles{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:16px 0}
.wa-online-card .wa-daily-tiles button{min-width:52px;min-height:58px;margin:0;background:#fff;color:#192b45;border:3px solid #91b4ed;font-size:clamp(19px,5vw,28px);font-weight:900;touch-action:manipulation}
.wa-online-card .wa-daily-tiles button.active{background:#ffe7a0;border-color:#e6a52d;color:#17243b}
.wa-mini-prompt{text-align:center;color:#fff;font-size:clamp(18px,4vw,24px)}.wa-daily-tiles button{user-select:none;-webkit-user-select:none;touch-action:none;cursor:grab}.wa-daily-tiles button.dragging{opacity:.65;transform:scale(1.08)}.wa-mini-status{min-height:1.5em;text-align:center;font-weight:800;color:#ffdf87}
.wa-mini-note{font-size:13px;color:#bdd0e4;line-height:1.6}
@media(max-width:390px){.wa-online-card .wa-daily-tiles button{min-width:42px;min-height:50px;padding:8px}}
.wa-kanji-combine{display:flex;align-items:center;justify-content:center;gap:12px;margin:18px auto 8px}.wa-kanji-part{display:grid;place-items:center;min-width:76px;min-height:82px;padding:5px 12px;border-radius:15px;background:#fff;color:#17243b;border:3px solid #91b4ed;font-size:clamp(34px,9vw,54px);font-weight:900}.wa-kanji-part.unknown{border-style:dashed;color:#6782a5;background:#213654}.wa-kanji-plus{font-size:30px;font-weight:900;color:#ffd56b}.wa-kanji-result{margin:8px auto;text-align:center;color:#ffdf87;font-size:clamp(23px,6vw,32px);font-weight:900}@media(max-width:390px){.wa-kanji-part{min-width:60px;min-height:70px}}.wa-mini-timer{text-align:center;font-size:clamp(30px,8vw,48px);font-weight:900;color:#ffdb70;margin:12px 0 3px;font-variant-numeric:tabular-nums}.wa-mini-timer.urgent{color:#ff857b}.wa-mini-bonus{text-align:center;font-size:17px;font-weight:800;color:#c9e4ff}.wa-mini-status{font-size:clamp(19px,5vw,27px);color:#ffdf87}
`;
  style.textContent+=`
#wa-online{background:radial-gradient(ellipse at 50% -15%,#30527f 0%,#13233d 45%,#0b1425 100%);color:#edf4ff;padding:clamp(12px,3vw,28px) 12px}
.wa-online-card{background:linear-gradient(145deg,#182b48,#101d32);color:#eef5ff;border:1px solid #47648a;box-shadow:0 22px 60px #030917a0;max-width:720px;padding:clamp(16px,3vw,28px);border-radius:22px}
.wa-online-card h1{font-size:clamp(24px,5vw,32px);margin:0 0 5px;color:#fff;letter-spacing:.03em}
.wa-online-card h2,.wa-online-card h3{color:#fff}.wa-online-card hr{border:0;border-top:1px solid #425b7a;margin:20px 0}
.wa-online-card .hint{color:#b5c8e2;line-height:1.65}
.wa-online-card input,.wa-online-card select{background:#10213a;border:1px solid #5b7394;color:#fff;outline-offset:2px}
.wa-online-card input::placeholder{color:#a0b2cc}
.wa-online-card button{background:#3978d5;color:#fff;border-radius:12px;min-height:44px}
.wa-online-card button.secondary{background:#273d5c;color:#f1f5ff;border:1px solid #627a99}
.wa-online-card .group{background:#243a59;border:1px solid #557397;border-radius:16px;padding:16px}
.wa-online-card .wa-primary-play{background:#e2a93f;color:#152238}
.wa-invite-panel{background:#203450;border-color:#4a668a}.wa-invite-row{background:#10213a;border-color:#58779b}.wa-online-card .wa-invite-row input{color:#eaf4ff}.wa-online-card .wa-invite-row button{background:#d6a13b;color:#132138}
.wa-grade-card.grade5{background:#183b38;border-color:#3b8d70}.wa-grade-card.grade4{background:#213961;border-color:#517fcb}.wa-grade-card h4{color:#fff}.wa-grade-card p{color:#bdd0e4}
.wa-rank-group{border-color:#506a8b}.wa-rank-group summary{background:#203653;color:#fff}.wa-rank-body{background:#152740;color:#fff}
.wa-online-card .error{color:#ffb1a6}
.wa-guild-hero{position:relative;overflow:hidden;border:1px solid #5a759a;border-radius:18px;padding:20px;background:radial-gradient(circle at 85% 20%,#315e91 0%,#1e3554 40%,#15243d 100%);margin:12px 0 18px;min-height:125px}
.wa-guild-hero .eyebrow{color:#f5c66c;font-weight:800;font-size:11px;letter-spacing:.13em;margin:0 0 9px}
.wa-guild-hero h2{font-size:clamp(24px,5vw,34px);margin:0 0 8px}
.wa-guild-hero p{color:#c5d7f0;margin:0;max-width:75%;font-size:14px}
.wa-guild-hero img{position:absolute;right:-5px;bottom:-20px;width:clamp(100px,30%,190px);height:155px;object-fit:cover;object-position:17% 45%;border-radius:80px;mask-image:linear-gradient(90deg,transparent,#000 24%);pointer-events:none}
.wa-guild-panel{background:#223754;border:1px solid #496789;border-radius:17px;padding:18px;margin:14px 0}
.wa-guild-panel h3{margin:0 0 7px;font-size:19px}.wa-guild-panel p{margin:0 0 12px}
.wa-guild-panel label{display:block;font-weight:700}.wa-guild-panel input{margin:10px 0 8px}
.wa-online-card .wa-guild-panel button{margin:6px 0 0}
.wa-online-card .wa-register{background:#e5ad43;color:#14233a}
.wa-online-card .wa-enter{background:#367bd3}
.wa-online-card .wa-create{background:#4b6689}
.wa-online-card .wa-solo{display:block;width:100%;background:#152943;border:1px solid #6382a6;color:#fff;margin:16px 0 6px;padding:15px}
.wa-guild-members{display:grid;gap:10px;margin-top:10px}.wa-guild-members .group{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0}
.wa-guild-members .group b{font-size:18px}.wa-guild-members .group button{margin:0;white-space:nowrap}
.wa-online-card .wa-pending{background:#183e38;border-color:#4a9878}
.wa-online-card .wa-pending button{background:#16835a}
.wa-online-card #wa-status{font-size:13px;color:#b6d8c9;margin:4px 0 8px}
@media(max-width:480px){.wa-guild-hero{padding:16px}.wa-guild-hero p{max-width:72%}.wa-guild-panel{padding:14px}.wa-guild-members .group{align-items:flex-start}.wa-guild-members .group b{font-size:16px}}
`;
   style.textContent+=`
/* Finger-following letter tiles and clearly marked insertion position */
.wa-daily-tiles button[data-index]{touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab;position:relative;transition:transform .12s,opacity .12s}
.wa-daily-tiles button[data-index].dragging{opacity:.28;transform:none}
.wa-daily-tiles button.wa-drop-before::before,.wa-daily-tiles button.wa-drop-after::after{content:"";position:absolute;top:-5px;bottom:-5px;width:6px;border-radius:5px;background:#ffcf53;box-shadow:0 0 0 2px #13233d,0 0 14px #ffcf53;pointer-events:none;z-index:2}
.wa-daily-tiles button.wa-drop-before::before{left:-8px}.wa-daily-tiles button.wa-drop-after::after{right:-8px}
.wa-drag-ghost{position:fixed!important;z-index:2147483647!important;transform:translate(-50%,-65%) scale(1.13);pointer-events:none!important;display:flex;align-items:center;justify-content:center;border:3px solid #ffc44f;border-radius:12px;background:#fff0b5;color:#172844;font-size:clamp(19px,5vw,28px);font-weight:900;box-shadow:0 12px 24px #0007;touch-action:none}
`;
  document.head.append(style);
  const $=id=>document.getElementById(id), status=$('wa-status'),content=$('wa-content');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function error(e){status.textContent='エラー: '+(e?.message||String(e));status.className='error';}
  function check(result){if(result.error)throw result.error;return result.data;}
  if(!config||!config.publishableKey.startsWith('sb_publishable_')){error('supabase-config.js にPublishable keyを設定してください。');return;}
  if(!window.supabase){error('supabase-jsの読み込みに失敗しました。ネット接続を確認してください。');return;}
  const client=window.supabase.createClient(config.url,config.publishableKey);
  let user,selected=null;
  // Companion preferences are device/browser-local and survive anonymous auth ID rotation.
  // Migrate known values from the old user-scoped storage without discarding existing progress.
  const prefKey = suffix => 'wa-device-companion-v1:' + suffix;
  const legacyKey = suffix => 'wa-guild-v2:' + (user?.id || '') + ':' + suffix;
  const stablePrefs = new Set(['companion','companion-total-points','meal-count','meal-earned','meal-fed','meal-last-date','meal-streak','meal-best-streak']);
  function getPref(suffix){
    try {
      if(stablePrefs.has(suffix)){
        const value=localStorage.getItem(prefKey(suffix));
        if(value!==null)return value;
        const legacy=localStorage.getItem(legacyKey(suffix));
        if(legacy!==null){localStorage.setItem(prefKey(suffix),legacy);return legacy;}
        // Recover from a previous anonymous session if the browser retained its storage.
        const suffixMatch=':'+suffix;
        const oldKeys=[];
        for(let i=0;i<localStorage.length;i++){
          const k=localStorage.key(i);
          if(k?.startsWith('wa-guild-v2:')&&k.endsWith(suffixMatch))oldKeys.push(k);
        }
        if(oldKeys.length===1){const old=localStorage.getItem(oldKeys[0]);if(old!==null){localStorage.setItem(prefKey(suffix),old);return old;}}
      }
      return localStorage.getItem(legacyKey(suffix)) || '';
    } catch (_) {return '';}
  }
  function setPref(suffix,value){
    try {localStorage.setItem(stablePrefs.has(suffix)?prefKey(suffix):legacyKey(suffix),String(value));}catch (_) {}
  }
  // Lightweight companion: one feeding opportunity per completed daily run (JST day).
  const companionNames=['ライボルトン','アクアフィン','アースゴーレム','モンスター4','モンスター5','モンスター6','モンスター7','モンスター8','モンスター9','モンスター10','？？？ お助けキャラ','？？？ 星の守護獣'];
  const todayJST=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const getCompanion=()=>Math.max(0,Math.min(11,Number(getPref('companion')||0)));
  // Cumulative earned points, separate from the competitive leaderboard.
  // Existing feeding counts remain saved but no longer gate character unlocks.
  const companionUnlockPoints=[0,0,0,45000,75000,110000,150000,200000,260000,330000,400000,500000];
  const earnedPoints=()=>Math.max(0,Math.floor(Number(getPref('companion-total-points')||0)));
  function grantCompanionPoints(amount,receipt){
    const points=Math.max(0,Math.floor(Number(amount)||0));
    if(!points||!receipt)return 0;
    const key='companion-receipt:'+receipt;
    if(getPref(key))return 0;
    setPref(key,'1');
    const before=earnedPoints();setPref('companion-total-points',String(before+points));
    const unlocked=companionUnlockPoints.findIndex((need,i)=>i>=3&&before<need&&before+points>=need);
    if(unlocked>=0 && document.getElementById('wa-comp-speech')){
      document.getElementById('wa-comp-speech').textContent='🎉 新しい相棒が解放！';
    }
    return points;
  }
  const companionUnlocked=i=>earnedPoints()>=companionUnlockPoints[i];
  const nextCompanionUnlock=()=>companionUnlockPoints.find((points,i)=>i>=3&&!companionUnlocked(i));
  const companionImage=i=>i===11?'special-ally-10.webp':i===10?'special-ally.webp':'assets/monster-'+String(i+1).padStart(2,'0')+'.webp';
  const companionPicture=i=>i===10?'<span class="wa-ally-fallback" aria-label="お助けキャラ">🦊</span>':'';
  const hasMeal=()=>getPref('meal-earned')===todayJST();
  const hasFed=()=>getPref('meal-fed')===todayJST();
  // Bond is tracked independently for every companion. Existing feeding totals are preserved.
  const bondKey=(i)=>'bond-points-'+i;
  const bondPoints=(i)=>Math.max(0,Math.floor(Number(getPref(bondKey(i))||0)));
  const bondLevel=(i)=>Math.min(10,1+Math.floor(bondPoints(i)/50));
  const bondProgress=(i)=>bondPoints(i)%50;
  const feedingDays=()=>Math.max(0,Math.floor(Number(getPref('meal-count')||0)));
  const bondRewards={2:'新しい応援セリフ',3:'ハートの応援',5:'特別な応援',7:'キラキラの応援',10:'絆の達人の称号'};
  const yesterdayJST=()=>{const d=new Date();d.setUTCDate(d.getUTCDate()-1);return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);};
  const mealStreak=()=>{const last=getPref('meal-last-date');return (last===todayJST()||last===yesterdayJST())?Math.max(0,Number(getPref('meal-streak')||0)):0;};
  function awardBond(i){
    const before=bondLevel(i);setPref(bondKey(i),String(bondPoints(i)+10));
    const after=bondLevel(i);return after>before?`🎉 なかよしLv.${after}！ ${bondRewards[after]||'もっと仲良しになった！'}`:'';
  }

  const companionCss=document.createElement('style');
  companionCss.textContent=`
    #wa-companion{position:fixed;right:10px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:100005;width:142px;text-align:center;pointer-events:none;font:700 12px system-ui,sans-serif}
    #wa-companion button{border:0;background:transparent;padding:0;cursor:pointer;pointer-events:auto;position:relative;filter:drop-shadow(0 4px 5px #0005)}
    #wa-companion img{width:134px;height:134px;object-fit:contain;animation:wa-bob 2.4s ease-in-out infinite}
    #wa-companion .wa-comp-bubble{background:#fff;color:#19283c;border:2px solid #e6b85a;border-radius:14px;padding:5px 7px;margin:0 auto 2px;max-width:125px;box-shadow:0 2px 8px #0003}
    #wa-companion.wa-happy img{animation:wa-cheer .55s ease-in-out 3}
    #wa-companion.wa-happy .wa-comp-bubble{color:#d33b66}
    @keyframes wa-bob{50%{transform:translateY(-7px)}}@keyframes wa-cheer{50%{transform:translateY(-17px) rotate(8deg) scale(1.1)}}
    #wa-companion-modal{position:fixed;inset:0;z-index:100010;background:#071426c9;display:flex;align-items:center;justify-content:center;padding:20px;font:16px system-ui,sans-serif}
    #wa-companion-modal[hidden]{display:none!important}
    .wa-comp-dialog{background:#1c304d;color:white;border:1px solid #6385b1;border-radius:20px;padding:22px;width:min(420px,100%);text-align:center;box-shadow:0 18px 60px #0009}
    .wa-comp-dialog img{width:160px;height:160px;object-fit:contain}
    .wa-comp-dialog button{background:#e5ac40;color:#14243a;border:0;border-radius:12px;padding:12px 18px;font:800 16px system-ui,sans-serif;margin:6px;cursor:pointer}
    .wa-comp-dialog button.secondary{background:#344e70;color:white}
    .wa-bond-track{height:11px;background:#344a67;border-radius:999px;overflow:hidden;margin:8px 0}.wa-bond-track span{display:block;height:100%;background:linear-gradient(90deg,#ffb54c,#ff67a8);border-radius:999px}.wa-bond-note{font-size:13px;line-height:1.5;color:#f4dfb9}.wa-comp-dialog{max-height:calc(100dvh - 40px);overflow:auto} .wa-comp-picker{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin:14px 0}
    .wa-comp-picker button{background:#273f60;padding:5px;margin:0;border:2px solid transparent;border-radius:12px}
    .wa-comp-picker button.selected{border-color:#ffd16a}
    .wa-comp-picker button.locked{opacity:.52;filter:grayscale(1);cursor:not-allowed}
    .wa-comp-picker button.locked img{filter:brightness(.55)}
    .wa-comp-picker .wa-lock{display:block;color:#fff;font-size:11px;font-weight:800}
    .wa-comp-picker img{width:100%;height:auto;aspect-ratio:1;object-fit:contain}
    .wa-comp-picker .wa-mystery{display:grid;place-items:center;aspect-ratio:1;font-size:38px;font-weight:900;color:#ffd46d}.wa-comp-picker .wa-ally-fallback{font-size:32px}
    @media(max-width:600px){#wa-companion{width:110px;right:4px;bottom:calc(4px + env(safe-area-inset-bottom,0px))}#wa-companion img{width:105px;height:105px}#wa-companion .wa-comp-bubble{font-size:10px;padding:3px 5px}#wa-online:not([hidden])~#wa-companion{bottom:calc(4px + env(safe-area-inset-bottom,0px))}}
  `;
  document.head.append(companionCss);
  const companionBox=document.createElement('div');companionBox.id='wa-companion';
  companionBox.innerHTML='<div class="wa-comp-bubble" id="wa-comp-speech">がんばれ！</div><button id="wa-comp-tap" aria-label="相棒をひらく"><img id="wa-comp-img" alt="応援する相棒"></button>';
  document.body.append(companionBox);
  const companionModal=document.createElement('div');companionModal.id='wa-companion-modal';companionModal.hidden=true;document.body.append(companionModal);
  function refreshCompanion(){
    const n=getCompanion();$('wa-comp-img').src=companionImage(n);
    $('wa-comp-img').alt=companionNames[n];
    $('wa-comp-img').onerror=()=>{if(n>=10){$('wa-comp-img').style.display='none';$('wa-comp-tap').textContent='🦊';}};
    $('wa-comp-img').style.display='';
    const level=bondLevel(n);const messages=level>=5?['ずっと一緒だよ！ ✨','今日もいい調子！','You can do it! 🌟']:level>=2?['がんばれ！ 💛','一緒に挑戦！','Nice job!']:['がんばれ！','You can do it!'];$('wa-comp-speech').textContent=hasMeal()&&!hasFed()?'🍎 ごはん！':hasFed()?'ありがとう♥':messages[Math.floor(Date.now()/12000)%messages.length];
  }
  function closeCompanion(){companionModal.hidden=true;companionModal.innerHTML='';}
  function openCompanionPicker(){
    let n=getCompanion();
    if(!companionUnlocked(n)){n=0;setPref('companion','0');refreshCompanion();}
    const points=earnedPoints();
    const next=nextCompanionUnlock();
    companionModal.hidden=false;
    companionModal.innerHTML=`<div class="wa-comp-dialog" role="dialog" aria-modal="true" aria-label="相棒を選ぶ"><h2>🐾 相棒を選ぼう！</h2><p>最初の3体から選べるよ。ゲームでポイントを集めると仲間が増える！</p><p>⭐ 累計獲得ポイント：<b>${points.toLocaleString()} pt</b>${next!==undefined?` ／ 次の相棒まであと${(next-points).toLocaleString()} pt`:' ／ 全員解放！'}</p><div class="wa-comp-picker">${companionNames.map((name,i)=>`<button data-comp="${i}" class="${i===n?'selected':''} ${companionUnlocked(i)?'':'locked'}" aria-label="${name}${companionUnlocked(i)?'':` ${companionUnlockPoints[i]}ポイントで解放`}" title="${name}${companionUnlocked(i)?'':`：累計${companionUnlockPoints[i].toLocaleString()}ptで解放`}" ${companionUnlocked(i)?'':'disabled'}>${i>=10&&!companionUnlocked(i)?'<span class="wa-mystery">？</span>':`<img src="${companionImage(i)}" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="wa-ally-fallback" style="display:none">🦊</span>`}${companionUnlocked(i)?'':`<span class="wa-lock">🔒 ${companionUnlockPoints[i].toLocaleString()}pt</span>`}</button>`).join('')}</div><p id="wa-comp-name">${companionUnlocked(n)?companionNames[n]:'？？？'}　💛 なかよし Lv.${bondLevel(n)}</p><p class="wa-bond-note">相棒ごとにごはんで仲良くなれるよ。レベルは切り替えても残る！</p><button id="wa-comp-close" class="secondary">とじる</button></div>`;
    companionModal.querySelectorAll('[data-comp]').forEach(b=>b.onclick=()=>{
      const i=Number(b.dataset.comp);
      if(!companionUnlocked(i))return;
      setPref('companion',String(i));refreshCompanion();openCompanionPicker();
    });
    $('wa-comp-close').onclick=closeCompanion;
  }
  function openMeal(){
    const n=getCompanion(),ready=hasMeal()&&!hasFed(),level=bondLevel(n),streak=mealStreak();
    const progress=level>=10?100:bondProgress(n)*2;
    companionModal.hidden=false;
    companionModal.innerHTML=`<div class="wa-comp-dialog" role="dialog" aria-modal="true" aria-label="相棒のごはん"><h2>🍎 今日のごはん</h2><img src="${companionImage(n)}" alt="${companionNames[n]}"><p><b>${companionNames[n]}</b> 💛 なかよし Lv.${level}</p><div class="wa-bond-track" aria-label="なかよしレベルの進み具合"><span style="width:${progress}%"></span></div><p class="wa-bond-note">${level>=10?'なかよしレベルMAX！':`次のレベルまであと ${50-bondProgress(n)} 💛`}</p><p id="wa-meal-message">${hasFed()?'おいしかった！ また明日ね♥':ready?'10問チャレンジクリア！ ごはんをあげよう！':'10問チャレンジを終えると、1日1回ごはんをあげられるよ！'}</p><p>🍎 あげた回数：<b>${feedingDays()}</b>回　🔥 連続：<b>${streak}</b>日</p><p class="wa-bond-note">ごはん1回でなかよし +10。3・7・14・30日連続で特別なメッセージ！<br>Lv.2 新セリフ / Lv.3 ハート / Lv.5 特別応援 / Lv.7 キラキラ / Lv.10 称号</p>${ready?'<button id="wa-feed">🍎 ごはんをあげる</button>':''}<button id="wa-meal-close" class="secondary">とじる</button><button id="wa-pick-from-meal" class="secondary">相棒を変更</button></div>`;
    $('wa-meal-close').onclick=closeCompanion;
    $('wa-pick-from-meal').onclick=openCompanionPicker;
    if(ready)$('wa-feed').onclick=()=>{
      if(!hasMeal()||hasFed())return;
      const prev=getPref('meal-last-date');const nextStreak=prev===yesterdayJST()?mealStreak()+1:1;
      setPref('meal-fed',todayJST());setPref('meal-count',String(feedingDays()+1));
      setPref('meal-last-date',todayJST());setPref('meal-streak',String(nextStreak));
      setPref('meal-best-streak',String(Math.max(nextStreak,Number(getPref('meal-best-streak')||0))));
      const reward=awardBond(n);
      const milestone=[3,7,14,30].includes(nextStreak)?` 🎊 ${nextStreak}日連続！ いつもありがとう！`:'';
      companionBox.classList.remove('wa-happy');void companionBox.offsetWidth;companionBox.classList.add('wa-happy');
      $('wa-meal-message').textContent='もぐもぐ… おいしい！ 💛 +10 '+reward+milestone;
      $('wa-feed').remove();refreshCompanion();
      // Update the meter and counter without closing the modal.
      const meter=companionModal.querySelector('.wa-bond-track span');if(meter)meter.style.width=(bondLevel(n)>=10?100:bondProgress(n)*2)+'%';
      const note=companionModal.querySelector('.wa-bond-track + .wa-bond-note');if(note)note.textContent=bondLevel(n)>=10?'なかよしレベルMAX！':`なかよし Lv.${bondLevel(n)} ／ 次まであと ${50-bondProgress(n)} 💛`;
    };
  }
  $('wa-comp-tap').onclick=openMeal;
  refreshCompanion();
  let firstHome = true;
  // Site-wide personal best. Scores are client-reported (not independently verified).
  window.WAOnline = {
    submitNormalScore: async function(result){
      if(!user)return;
      grantCompanionPoints(result.score,'normal:'+Date.now()+':'+Math.random().toString(36).slice(2));
      const nickname=(getPref('nickname')||'プレイヤー').slice(0,20);
      const payload={p_subject:result.subject,p_score:Math.max(0,Math.round(Number(result.score)||0)),
        p_stages:Math.max(0,Math.round(Number(result.stages)||0)),p_nickname:nickname};
      check(await client.rpc('wa_global_submit_score',payload));
    }
  };
  let dailyRun=null, dailyAnswers=[], dailyIndex=0, dailyQuestions=[], dailySubject="";
  let dailyMiniPoints=0, dailyMiniResults=[], dailyMiniTimer=null;
  function stopMiniTimer(){if(dailyMiniTimer!==null){clearInterval(dailyMiniTimer);dailyMiniTimer=null;}}
  try{
    let session=check(await client.auth.getSession()).session;
    if(!session)session=check(await client.auth.signInAnonymously()).session;
    if(!session?.user)throw Error('匿名ログインに失敗しました');
    user=session.user;
    refreshCompanion();
    status.textContent='オンライン接続済み';
    await showHome();
  }catch(e){error(e);}
  async function showHome(){
    firstHome=false;selected=null;
    content.innerHTML=`<section class="wa-guild-hero"><p class="eyebrow">WORD ARROW · WORLD RANKING</p><h2>🏹 ワードアロー</h2><p>みんなと最高得点を競おう！ ギルド登録は不要です。</p></section>
      <section class="wa-guild-panel"><h3>🦊 プレイヤー名</h3><p class="hint">ランキングに表示する名前（20文字まで）</p><input id="wa-nick" maxlength="20" placeholder="ニックネーム"><button id="wa-profile" class="wa-register">名前を保存</button><p id="wa-profile-result" role="status" aria-live="polite" class="hint"></p></section>
      <button id="wa-play" class="wa-primary-play">🎮 ゲームを始める</button>
      <section class="wa-guild-panel"><h3>🐾 マイ相棒</h3><button id="wa-choose-companion">相棒を選ぶ・変更</button><button id="wa-open-meal" class="secondary">🍎 ごはん</button></section>
      <section class="wa-daily-wrap"><h3>🎯 今日の10問チャレンジ</h3><p class="hint">ギルド不要。各科目1日1回、全員同じ10問に挑戦！（1問100pt）</p><div class="wa-daily-grid"><div class="wa-grade-card grade5"><h4>🌱 5級</h4><button id="wa-daily-e5">英検5級</button><button id="wa-daily-k5">漢検5級</button></div><div class="wa-grade-card grade4"><h4>⚡ 4級</h4><button id="wa-daily-e">英検4級</button><button id="wa-daily-k">漢検4級</button></div></div><p id="wa-daily-feedback" role="alert" aria-live="polite" class="hint"></p><div id="wa-daily-global-rankings">今日のチャレンジランキングを読み込み中…</div></section>
      <section class="wa-daily-wrap"><h3>🏆 サイト全体の最高得点ランキング</h3><p class="hint">ギルド不要。各プレイヤーの自己ベストを掲載します。ブラウザ送信の参考記録で、プレイ内容のサーバー検証はありません。</p><div id="wa-global-rankings" aria-live="polite">ランキングを読み込んでいます…</div><button id="wa-rank-refresh" class="secondary">ランキング更新</button></section>`;
    $('wa-nick').value=getPref('nickname');
    $('wa-choose-companion').onclick=openCompanionPicker;
    $('wa-open-meal').onclick=openMeal;
    $('wa-play').onclick=()=>{panel.hidden=true};
    $('wa-profile').onclick=()=>{
      const nick=$('wa-nick').value.trim();
      if(!nick){$('wa-profile-result').textContent='名前を入力してください';return;}
      setPref('nickname',nick.slice(0,20));
      $('wa-profile-result').textContent='✓ 保存しました。次回の得点送信から反映されます。';
    };
    $('wa-daily-e5').onclick=()=>startDaily(null,'eiken5');
    $('wa-daily-k5').onclick=()=>startDaily(null,'kanken5');
    $('wa-daily-e').onclick=()=>startDaily(null,'eiken4');
    $('wa-daily-k').onclick=()=>startDaily(null,'kanken4');
    showDailyGlobalRankings();
    $('wa-rank-refresh').onclick=showGlobalRankings;
    await showGlobalRankings();
  }
  async function showDailyGlobalRankings(){
    const host=$('wa-daily-global-rankings');if(!host)return;
    try{
      const blocks=[];
      for(const [subject,label] of [['eiken5','英検5級'],['eiken4','英検4級'],['kanken5','漢検5級'],['kanken4','漢検4級']]){
        const rows=check(await client.rpc('wa_daily_global_ranking',{p_subject:subject}))||[];
        blocks.push(`<h4>${label}・今日の得点</h4>${rows.length?'<ol>'+rows.map(r=>`<li>${esc(r.nickname)} — <b>${Number(r.score)} pt</b></li>`).join('')+'</ol>':'<p class="hint">まだ挑戦者がいません</p>'}`);
      }
      if(host.isConnected)host.innerHTML=blocks.join('');
    }catch(e){if(host.isConnected)host.textContent='今日のランキングを取得できません：'+(e?.message||String(e));}
  }
  async function showGlobalRankings(){
    const host=$('wa-global-rankings');if(!host)return;
    host.textContent='読み込み中…';
    try{
      const blocks=[];
      for(const [subject,label] of [['eiken5','英検5級'],['eiken4','英検4級'],['kanken5','漢検5級'],['kanken4','漢検4級']]){
        const rows=check(await client.rpc('wa_global_ranking',{p_subject:subject}))||[];
        blocks.push(`<h4>${label}</h4>${rows.length?'<ol>'+rows.map(r=>`<li>🏅 ${esc(r.nickname)} — <b>${Number(r.score).toLocaleString()} pt</b>（STAGE ${Number(r.stages)}）</li>`).join('')+'</ol>':'<p class="hint">まだ記録がありません</p>'}`);
      }
      host.innerHTML=blocks.join('');
    }catch(e){host.innerHTML='<p class="error">ランキングを取得できません。Supabaseで同梱のSQLを実行してください。<br>'+esc(e?.message||String(e))+'</p>';}
  }
  async function showGroup(id){
    try{
      const groups=check(await client.rpc('wa_my_groups'))||[];
      const g=groups.find(x=>x.id===id);
      if(!g)throw Error('グループが見つかりません');
      const members=check(await client.rpc('wa_group_members',{p_group_id:id}))||[];
      selected=id;
      setPref('group',String(id));
      const invite=location.origin+location.pathname+'?group='+encodeURIComponent(g.invite_code);
      content.innerHTML=`<h2>${esc(g.name)}</h2><p>${members.length}人が参加</p><ul>${members.map(m=>`<li>${esc(m.avatar)} ${esc(m.nickname)}</li>`).join('')}</ul>
      <div class="wa-invite-panel"><p class="wa-invite-label">🔗 友達を招待</p><div class="wa-invite-row"><input id="wa-invite" aria-label="招待URL" readonly value="${esc(invite)}"><button id="wa-copy" aria-label="招待URLをコピー">コピー</button></div><p class="hint" style="margin:8px 0 0">リンクを送ると、このグループに参加できます。</p></div>
      <button id="wa-start" class="wa-primary-play">🎮 通常ゲームを開始</button><div class="wa-guild-panel"><h3>🐾 マイ相棒</h3><p class="hint">毎日オンライン対戦を10問終えると、ごはんをあげられるよ！</p><button id="wa-choose-companion">相棒を選ぶ・変更</button><button id="wa-open-meal" class="secondary">🍎 ごはんタイム</button></div>
      <section class="wa-daily-wrap"><h3>🏆 今日のオンライン対戦</h3><p class="hint">各級・各科目それぞれ1日1回。全員が同じ10問に挑戦（1問100点）。</p>
      <div class="wa-daily-grid"><div class="wa-grade-card grade5"><h4>🌱 5級チャレンジ</h4><p>基礎から挑戦したい人向け</p><button id="wa-daily-e5">英検5級に挑戦</button><button id="wa-daily-k5">漢検5級に挑戦</button></div>
      <div class="wa-grade-card grade4"><h4>⚡ 4級チャレンジ</h4><p>少し難しい問題に挑戦</p><button id="wa-daily-e">英検4級に挑戦</button><button id="wa-daily-k">漢検4級に挑戦</button></div></div></section>
      <p id="wa-daily-feedback" role="alert" aria-live="assertive" style="display:none;padding:12px;border:2px solid #ffbd74;border-radius:12px;background:#402a2a;color:#fff;margin:12px 0"></p><h3>📊 今日のランキング</h3><div id="wa-rankings"></div><button id="wa-back" class="secondary">✏️ ニックネーム・ギルドを変更</button><p class="hint">通常ゲームの最高得点もオンライン共有されます（自己申告スコア・未検証）。</p>`;
      $('wa-choose-companion').onclick=openCompanionPicker;
      $('wa-open-meal').onclick=openMeal;
      $('wa-copy').onclick=async()=>{try{await navigator.clipboard.writeText(invite);status.textContent='招待URLをコピーしました'}catch(e){$('wa-invite').select();status.textContent='URLを選択しました。コピーしてください'}};
      $('wa-start').onclick=()=>{panel.hidden=true};
      $('wa-daily-e').onclick=()=>startDaily(id,'eiken4');
      $('wa-daily-k').onclick=()=>startDaily(id,'kanken4');
      $('wa-daily-e5').onclick=()=>startDaily(id,'eiken5');
      $('wa-daily-k5').onclick=()=>startDaily(id,'kanken5');
      await showRankings(id);
      await showNormalRankings(id);
      $('wa-back').onclick=()=>{firstHome=false;showHome();};
    }catch(e){error(e)}
  }
  async function showRankings(groupId){
    const host=$('wa-rankings');if(!host)return;
    try{
      const out=[];
      for(const [grade,subjects] of [['5',[['eiken5','英検5級'],['kanken5','漢検5級']]],['4',[['eiken4','英検4級'],['kanken4','漢検4級']]]]){
        const chunks=[];
        for(const [subject,label] of subjects){
          const rows=check(await client.rpc('wa_daily_ranking',{p_group_id:groupId,p_subject:subject}))||[];
          chunks.push(`<h4>${label}</h4>${rows.length?'<ol>'+rows.map(r=>`<li>${esc(r.avatar)} ${esc(r.nickname)} — <b>${r.score}点</b>（${r.correct_count}/10）</li>`).join('')+'</ol>':'<p class="hint">まだ記録がありません</p>'}`);
        }
        out.push(`<details class="wa-rank-group grade${grade}" ${grade==='5'?'open':''}><summary>${grade}級のランキング</summary><div class="wa-rank-body">${chunks.join('')}</div></details>`);
      }
      host.innerHTML=out.join('');
    }catch(e){host.textContent='ランキング取得エラー: '+(e.message||e);}
  }
  async function showNormalRankings(groupId){
    const host=document.createElement('section');host.id='wa-normal-rankings';
    const daily=$('wa-rankings');if(!daily)return;
    daily.after(host);
    try{
      const out=['<hr><h3>🏅 通常ゲーム・グループ最高得点</h3><p class="hint">ブラウザから送信した参考記録です。サーバーでプレイ内容の検証はしていません。</p>'];
      for(const [subject,label] of [['eiken5','英検5級'],['eiken4','英検4級'],['kanken5','漢検5級'],['kanken4','漢検4級']]){
        const rows=check(await client.rpc('wa_normal_ranking',{p_group_id:groupId,p_subject:subject}))||[];
        out.push(`<h4>${label}</h4>${rows.length?'<ol>'+rows.map(r=>`<li>${esc(r.avatar)} ${esc(r.nickname)} — <b>${Number(r.score)} pt</b>（STAGE ${Number(r.stages)}）</li>`).join('')+'</ol>':'<p class="hint">まだ記録がありません</p>'}`);
      }
      host.innerHTML=out.join('');
    }catch(e){host.textContent='通常ゲームのランキング取得エラー: '+(e.message||e);}
  }
  async function startDaily(groupId,subject){
    const feedback=$('wa-daily-feedback');
    const buttonId={eiken4:'wa-daily-e',eiken5:'wa-daily-e5',kanken4:'wa-daily-k',kanken5:'wa-daily-k5'}[subject];
    const btn=buttonId?$(buttonId):null;
    if(btn?.disabled)return;
    if(feedback){feedback.style.display='block';feedback.textContent='対戦を読み込んでいます…';}
    if(btn){btn.disabled=true;btn.dataset.originalLabel=btn.textContent;btn.textContent='読み込み中…';}
    try{
      const data=check(await client.rpc('wa_start_daily_global',{p_subject:subject}));
      if(data.finished){if(feedback)feedback.textContent='今日はこの科目に回答済みです。明日また挑戦してください。';await showDailyGlobalRankings();return;}
      stopMiniTimer();dailyMiniPoints=0;dailyMiniResults=[];dailyRun=data.run_id;dailyQuestions=data.questions;dailyAnswers=[];dailyIndex=0;dailySubject=subject;
      selected=groupId;renderDailyQuestion();
    }catch(e){
      const message=e?.message||String(e);
      if(feedback){feedback.style.display='block';feedback.textContent='開始できませんでした（'+subject+'）：'+message;feedback.scrollIntoView({behavior:'smooth',block:'center'});}
      error(e);
    }finally{if(btn?.isConnected){btn.disabled=false;btn.textContent=btn.dataset.originalLabel||btn.textContent;}}
  }
  function renderDailyQuestion(){
    const q=dailyQuestions[dailyIndex];
    if(!q){finishDaily();return;}
    content.innerHTML=`<h2>🏹 今日のオンライン対戦</h2><p>第 ${dailyIndex+1} 問 / ${dailyQuestions.length} 問</p><h3>${esc(q.prompt)}</h3><div id="wa-choices"></div><p class="hint">選択後は回答を変更できません。最後にまとめて採点します。</p>`;
    const host=$('wa-choices');
    q.choices.forEach((choice,i)=>{
      const btn=document.createElement('button');btn.className='secondary';btn.style.cssText='display:block;width:100%;text-align:left';
      btn.textContent=String.fromCharCode(65+i)+'. '+choice;
      btn.onclick=()=>{
        dailyAnswers.push(i);dailyIndex++;
        if(dailyIndex<dailyQuestions.length && dailyIndex%3===0) renderDailyMiniPuzzle();
        else renderDailyQuestion();
      };host.append(btn);
    });
  }
  // Timed local mini-games. Official ranking requires server-side verification.
  // Five English microgames; rotate daily so all modes appear across sessions.
  function renderEnglishVarietyMini(){
    const round=Math.max(0,Math.min(2,Math.floor(dailyIndex/3)-1));
    const day=Math.floor((Date.now()+9*3600000)/86400000);
    const mode=(day+round)%5;
    const sets=dailySubject==='eiken4' ? [
      {en:'I visited my friend yesterday.',ja:'私は昨日友達を訪ねました。',word:'visited',meaning:'訪ねた',past:'visit → visited',choices:['訪ねた','泳いだ','買った','書いた']},
      {en:'She is reading a book.',ja:'彼女は本を読んでいます。',word:'reading',meaning:'読んでいる',past:'read → read',choices:['読んでいる','走っている','眠っている','歌っている']},
      {en:'We played soccer after school.',ja:'私たちは放課後サッカーをしました。',word:'played',meaning:'した',past:'play → played',choices:['した','食べた','見た','聞いた']}
    ] : [
      {en:'I like apples.',ja:'私はりんごが好きです。',word:'like',meaning:'好き',past:'like → liked',choices:['好き','嫌い','走る','飲む']},
      {en:'This is my school.',ja:'これは私の学校です。',word:'school',meaning:'学校',past:'',choices:['学校','公園','駅','病院']},
      {en:'He plays tennis.',ja:'彼はテニスをします。',word:'plays',meaning:'する',past:'play → played',choices:['する','寝る','読む','泳ぐ']}
    ];
    const q=sets[round];let finished=false,chosen=[],picked=[];
    const start=performance.now(),limit=30000;
    const bonusFor=t=>t<=5000?300:t<=10000?250:t<=15000?200:t<=20000?150:t<=30000?100:0;
    const shuffle=a=>a.map((x,i)=>({x,k:((i*37+day*13+round*17)%101)})).sort((a,b)=>a.k-b.k).map(o=>o.x);
    const words=q.en.replace(/[.!?]/g,'').split(/\s+/);
    const japanese=q.ja.replace(/[。！？]/g,'').match(/私は|私たちは|彼女は|彼は|これは|昨日|友達を|訪ねました|本を|読んでいます|放課後|サッカーを|しました|りんごが|好きです|私の|学校です|テニスを|します|./g)||[q.ja];
    const choices=mode===0?shuffle(words):mode===4?shuffle(japanese):[];
    const labels=['英文を組み立てよう','意味のペアを探そう','聞こえた英語を選ぼう','正しい意味を選ぼう','日本語訳を組み立てよう'];
    content.innerHTML='<h2>🧩 英検ミニゲーム</h2><h3>'+labels[mode]+'</h3><div class="wa-mini-timer" id="wa-mini-timer">残り 30.0 秒</div><div class="wa-mini-bonus" id="wa-mini-bonus">最速クリアで +300 Point!</div><p id="wa-variety-prompt" style="font-weight:800"></p><div id="wa-variety-answer" style="min-height:42px;margin:10px 0;padding:10px;border:2px dashed #8ca9cb;border-radius:12px;overflow-wrap:anywhere"></div><div id="wa-variety-choices" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"></div><p id="wa-mini-status" aria-live="polite"></p><button id="wa-mini-check">こたえを決定！</button><button class="secondary" id="wa-mini-skip">スキップ</button><p class="wa-mini-note">ミニゲームのボーナスは公式ランキングの得点に含まれません。</p>';
    const $v=id=>document.getElementById(id), host=$v('wa-variety-choices'), answer=$v('wa-variety-answer');
    const speak=()=>{if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(q.en);u.lang='en-US';u.rate=.85;window.speechSynthesis.speak(u);};
    const prompt=$v('wa-variety-prompt');
    if(mode===0)prompt.textContent=q.ja;
    if(mode===1)prompt.textContent='「'+q.word+'」と同じ意味を選ぼう';
    if(mode===2){prompt.textContent='音声を聞いて、聞こえた単語を選ぼう';const b=document.createElement('button');b.textContent='🔊 英語を聞く';b.className='secondary';b.onclick=speak;prompt.append(b);}
    if(mode===3)prompt.textContent='「'+q.word+'」の意味は？';
    if(mode===4)prompt.textContent=q.en;
    const opts=mode===0||mode===4?choices:shuffle(mode===2?[q.word,...(dailySubject==='eiken4'?['played','visited','reading','school']:['like','school','plays','apple']).filter(x=>x!==q.word).slice(0,3)]:q.choices);
    function draw(){host.replaceChildren();answer.textContent=picked.join(' ');opts.forEach((s,i)=>{const b=document.createElement('button');b.className='secondary';b.textContent=s;b.style.cssText='padding:12px;min-width:70px;min-height:48px;font-size:17px';b.disabled=finished||(mode===0||mode===4)&&chosen.includes(i);b.onclick=()=>{if(finished)return;if(mode===0||mode===4){chosen.push(i);picked.push(s);draw();}else{picked=[s];answer.textContent=s;}};host.append(b);});}
    if(mode===0||mode===4){const undo=document.createElement('button');undo.className='secondary';undo.textContent='↶ 1つ戻す';undo.onclick=()=>{if(finished)return;chosen.pop();picked.pop();draw();};answer.after(undo);}
    draw();
    let timer=setInterval(()=>{if(finished){clearInterval(timer);return;}const left=Math.max(0,limit-(performance.now()-start));$v('wa-mini-timer').textContent='残り '+(left/1000).toFixed(1)+' 秒';if(!left)finish(false,'timeout');},100);
    function finish(ok,reason){if(finished)return;finished=true;clearInterval(timer);const elapsed=performance.now()-start,points=ok?bonusFor(elapsed):0;dailyMiniPoints+=points;dailyMiniResults.push({after_question:dailyIndex,elapsed_ms:Math.round(elapsed),points,reason,mode:labels[mode]});$v('wa-mini-check').disabled=true;$v('wa-mini-skip').disabled=true;host.querySelectorAll('button').forEach(b=>b.disabled=true);$v('wa-mini-status').textContent=ok?'✨ 正解！ +'+points+' Point!':'正解：'+(mode===4?q.ja:mode===0?q.en:mode===1||mode===3?q.meaning:q.word);$v('wa-mini-bonus').textContent=q.past?'現在形・過去形：'+q.past:'';const next=document.createElement('button');next.textContent='次の問題へ';next.onclick=renderDailyQuestion;content.append(next);}
    $v('wa-mini-check').onclick=()=>{const actual=picked.join(mode===4?'':' ').replace(/[。.!?\s]/g,'').toLowerCase();const expected=(mode===0?q.en:mode===4?q.ja:mode===1||mode===3?q.meaning:q.word).replace(/[。.!?\s]/g,'').toLowerCase();if(actual===expected)finish(true,'correct');else $v('wa-mini-status').textContent='もう一度考えてみよう！';};
    $v('wa-mini-skip').onclick=()=>finish(false,'skip');
  }
  function renderDailyMiniPuzzle(){
    if(dailySubject.startsWith('eiken')){renderEnglishVarietyMini();return;}
    const english=dailySubject.startsWith('eiken');
    const round=Math.max(0,Math.min(2,Math.floor(dailyIndex/3)-1));
    const englishSets=dailySubject==='eiken4'?
      [{word:'friend',hint:'友だち'},{word:'weather',hint:'天気'},{word:'library',hint:'図書館'}]:
      [{word:'apple',hint:'りんご'},{word:'school',hint:'学校'},{word:'pencil',hint:'えんぴつ'}];
    const kanjiSets=dailySubject==='kanken4'?
      [{left:'言',choices:['寺','青','売'],answer:'売',result:'読'},
       {left:'氵',choices:['青','毎','可'],answer:'青',result:'清'},
       {left:'木',choices:['目','交','各'],answer:'交',result:'校'}]:
      [{left:'氵',choices:['毎','青','可'],answer:'毎',result:'海'},
       {left:'日',choices:['月','青','寺'],answer:'青',result:'晴'},
       {left:'木',choices:['交','目','白'],answer:'交',result:'校'}];
    // Fix puzzle data explicitly rather than constructing invalid characters.
    if(!english && dailySubject==='kanken4' && round===0){kanjiSets[0]={left:'言',choices:['売','青','寺'],answer:'売',result:'読'};}
    const entry=english?englishSets[round]:kanjiSets[round];
    const target=english?entry.word:'';
    let tiles=english?Array.from(target):[];
    if(english){tiles=tiles.slice(1).concat(tiles[0]).reverse();if(tiles.join('')===target)[tiles[0],tiles[1]]=[tiles[1],tiles[0]];}
    let picked=-1,finished=false,dragFrom=-1,chosen='';
    const startAt=performance.now(),limitMs=30000;
    const bonusFor=(elapsed)=>elapsed<=5000?300:elapsed<=10000?250:elapsed<=15000?200:elapsed<=20000?150:elapsed<=30000?100:0;
    content.innerHTML=`<h2>🧩 ${english?'スペル並べ替え':'漢字合体'}チャレンジ！</h2><p>第 ${dailyIndex} 問クリア！ ${english?'1文字ずつ指で動かして正しい順番にしよう。':'正しい漢字のパーツを選ぼう。'}</p><div class="wa-mini-timer" id="wa-mini-timer" role="timer">残り 30.0 秒</div><div class="wa-mini-bonus" id="wa-mini-bonus">最速クリアで +300 Point!</div><h3 class="wa-mini-prompt" id="wa-mini-prompt"></h3><div id="wa-kanji-combine" class="wa-kanji-combine" hidden><span class="wa-kanji-part" id="wa-kanji-left"></span><span class="wa-kanji-plus">＋</span><span class="wa-kanji-part unknown" id="wa-kanji-right">？</span></div><div class="wa-daily-tiles" id="wa-mini-tiles"></div><p class="wa-mini-status" id="wa-mini-status" aria-live="polite"></p><button id="wa-mini-check">できた！</button><button class="secondary" id="wa-mini-skip">スキップして次へ</button><p class="wa-mini-note">ボーナスは画面上の合計に加算。公式ランキングへの反映にはサーバー側の採点変更が必要です。</p>`;
    const tileHost=$('wa-mini-tiles'),timerHost=$('wa-mini-timer');
    $('wa-mini-prompt').textContent=english?`「${entry.hint}」を英語で完成！`:'どのパーツを合わせると、漢字が完成するかな？';
    if(!english){$('wa-kanji-combine').hidden=false;$('wa-kanji-left').textContent=entry.left;}
    function finishPuzzle(points,elapsed,reason){
      if(finished)return;
      finished=true;stopMiniTimer();dailyMiniPoints+=points;
      dailyMiniResults.push({after_question:dailyIndex,elapsed_ms:Math.round(elapsed),points,reason});
      $('wa-mini-check').disabled=true;$('wa-mini-skip').disabled=true;
      tileHost.querySelectorAll('button').forEach(b=>b.disabled=true);
      timerHost.textContent=reason==='correct'?'クリア！':reason==='timeout'?'時間切れ！':'スキップ';
      $('wa-mini-status').textContent=points?`✨ +${points} Point!  ミニパズル合計 ${dailyMiniPoints} pt`:'ボーナス 0 pt';
      $('wa-mini-bonus').textContent=reason==='correct'?`解答時間 ${(elapsed/1000).toFixed(1)}秒`:`正解：${english?target:entry.left+' ＋ '+entry.answer+' ＝ '+entry.result}`;
      if(!english){$('wa-kanji-right').textContent=entry.answer;$('wa-kanji-right').classList.remove('unknown');$('wa-mini-prompt').textContent=`完成した漢字：${entry.result}`;}
      const next=document.createElement('button');next.textContent='次の問題へ';next.onclick=renderDailyQuestion;content.append(next);
    }
    function tick(){if(finished)return;const left=Math.max(0,limitMs-(performance.now()-startAt));timerHost.textContent=`残り ${(left/1000).toFixed(1)} 秒`;timerHost.classList.toggle('urgent',left<=10000);if(left<=0)finishPuzzle(0,limitMs,'timeout');}
    dailyMiniTimer=setInterval(tick,100);tick();
    function move(from,to){if(finished||from<0||to<0||from===to)return;const v=tiles.splice(from,1)[0];tiles.splice(to,0,v);picked=-1;$('wa-mini-status').textContent='';draw();}
    function draw(){
      tileHost.replaceChildren();
      if(!english){entry.choices.forEach(part=>{const b=document.createElement('button');b.type='button';b.textContent=part;b.classList.toggle('active',chosen===part);b.onclick=()=>{if(finished)return;chosen=part;$('wa-kanji-right').textContent=part;$('wa-kanji-right').classList.remove('unknown');draw();};tileHost.append(b);});return;}
      tiles.forEach((letter,i)=>{
        const b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.index=String(i);b.setAttribute('aria-label',`${i+1}番目 ${letter}。ドラッグして移動`);b.classList.toggle('active',i===picked);b.draggable=false;
        // Unified pointer-based drag and drop for touch, pen and mouse.
        // A floating copy follows the pointer; the insertion marker indicates the destination.
        b.draggable=false;
        let gesture=null, suppressClick=false;
        const clearDrag=()=>{
          if(!gesture)return;
          gesture.ghost?.remove();
          tileHost.querySelectorAll('.wa-drop-before,.wa-drop-after').forEach(el=>el.classList.remove('wa-drop-before','wa-drop-after'));
          b.classList.remove('dragging');gesture=null;
        };
        const destination=(x,y)=>{
          const buttons=[...tileHost.querySelectorAll('button[data-index]')];
          if(!buttons.length)return -1;
          const bounds=tileHost.getBoundingClientRect();
          // Allow dropping slightly above/below the row, but not far outside the puzzle.
          if(y<bounds.top-45||y>bounds.bottom+45||x<bounds.left-45||x>bounds.right+45)return -1;
          const centers=buttons.map(el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});
          let nearest=0,dist=Infinity;
          centers.forEach((c,k)=>{const d=Math.hypot(x-c.x,y-c.y);if(d<dist){dist=d;nearest=k;}});
          return nearest;
        };
        b.addEventListener('pointerdown',e=>{
          if(finished||e.button!==0)return;
          gesture={id:e.pointerId,x:e.clientX,y:e.clientY,active:false,ghost:null,to:-1};
          b.setPointerCapture(e.pointerId);
        });
        b.addEventListener('pointermove',e=>{
          if(!gesture||e.pointerId!==gesture.id)return;
          if(!gesture.active&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)<7)return;
          if(!gesture.active){
            gesture.active=true;b.classList.add('dragging');
            const r=b.getBoundingClientRect();
            const ghost=b.cloneNode(true);ghost.removeAttribute('id');ghost.className='wa-drag-ghost';
            ghost.style.width=r.width+'px';ghost.style.height=r.height+'px';
            document.body.appendChild(ghost);gesture.ghost=ghost;
          }
          e.preventDefault();
          gesture.ghost.style.left=e.clientX+'px';gesture.ghost.style.top=e.clientY+'px';
          gesture.to=destination(e.clientX,e.clientY);
          tileHost.querySelectorAll('.wa-drop-before,.wa-drop-after').forEach(el=>el.classList.remove('wa-drop-before','wa-drop-after'));
          const dest=tileHost.querySelector(`button[data-index="${gesture.to}"]`);
          if(dest&&gesture.to!==i)dest.classList.add(gesture.to>i?'wa-drop-after':'wa-drop-before');
        });
        b.addEventListener('pointerup',e=>{
          if(!gesture||e.pointerId!==gesture.id)return;
          const dragged=gesture.active,to=dragged?destination(e.clientX,e.clientY):-1;
          clearDrag();
          if(dragged){suppressClick=true;if(to>=0)move(i,to);}
        });
        b.addEventListener('pointercancel',clearDrag);
        b.addEventListener('lostpointercapture',clearDrag);
        b.onclick=()=>{
          if(suppressClick){suppressClick=false;return;}
          if(finished)return;
          if(picked<0){picked=i;draw();}else move(picked,i);
        };
        tileHost.append(b);
      });
    }
    draw();
    $('wa-mini-check').onclick=()=>{if(finished)return;const elapsed=performance.now()-startAt;if(elapsed>=limitMs){finishPuzzle(0,limitMs,'timeout');return;}if(english?tiles.join('')===target:chosen===entry.answer)finishPuzzle(bonusFor(elapsed),elapsed,'correct');else $('wa-mini-status').textContent=english?'もう少し！ 文字を動かしてみよう':'ちがうパーツを選んでみよう';};
    $('wa-mini-skip').onclick=()=>finishPuzzle(0,performance.now()-startAt,'skip');
  }
  async function finishDaily(){
    stopMiniTimer();
    content.innerHTML='<h2>採点中…</h2>';
    try{
      const result=check(await client.rpc('wa_finish_daily',{p_run_id:dailyRun,p_answers:dailyAnswers}));
      // One award per server run ID; replaying the results cannot double-count.
      grantCompanionPoints(Number(result.score)+dailyMiniPoints,'daily:'+dailyRun);
      // Award one feeding opportunity only after server-confirmed completion.
      if(!hasMeal()&&!hasFed()){setPref('meal-earned',todayJST());}refreshCompanion();
      content.innerHTML=`<h2>結果発表！</h2><p>通常クイズ：<b>${result.score} pt</b></p><p>ミニパズル：<b>+${dailyMiniPoints} pt</b></p><p style="font-size:32px;font-weight:bold">合計 ${Number(result.score)+dailyMiniPoints} Point!</p><p>${result.correct} / ${result.total} 問正解</p><p class="hint">※現在ランキングに保存されるのは通常クイズの ${result.score} pt のみです。ミニパズル点の公式ランキング反映にはSupabaseの採点関数更新が必要です。</p><button id="wa-feed-now">🍎 相棒にごはんをあげる</button><button id="wa-return">ホームに戻る</button>`;
      $('wa-feed-now').onclick=openMeal;
      $('wa-return').onclick=showHome;
    }catch(e){error(e);content.innerHTML='<button id="wa-retry">再送信</button>';
      $('wa-retry').onclick=finishDaily;}
  }

})();
