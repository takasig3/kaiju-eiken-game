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
  // Browser-local preferences are scoped to the Supabase anonymous user.
  const prefKey = suffix => 'wa-guild-v2:' + user.id + ':' + suffix;
  const getPref = suffix => { try { return localStorage.getItem(prefKey(suffix)) || ''; } catch (_) { return ''; } };
  const setPref = (suffix,value) => { try { localStorage.setItem(prefKey(suffix),value); } catch (_) {} };
  let firstHome = true;
  // Normal-game results are client-reported and therefore marked unverified.
  window.WAOnline = {
    submitNormalScore: async function(result){
      if(!selected || !user) return;
      const payload={p_group_id:selected,p_subject:result.subject,p_score:result.score,
        p_stages:result.stages,p_correct:result.correct,p_total:result.total};
      check(await client.rpc('wa_submit_normal_score',payload));
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
    status.textContent='オンライン接続済み';
    await showHome();
  }catch(e){error(e);}
  async function showHome(){
    try{
      const groups=check(await client.rpc('wa_my_groups'))||[];
      const pending=new URLSearchParams(location.search).get('group');
      // Do not bypass an incoming invitation. Auto-enter only a confirmed membership.
      if (firstHome && !pending) {
        firstHome=false;
        const savedGroup=getPref('group');
        if (savedGroup && groups.some(g=>String(g.id)===savedGroup)) {
          await showGroup(savedGroup);
          return;
        }
      }
      firstHome=false;
      content.innerHTML=`
      <section class="wa-guild-hero"><p class="eyebrow">WORD ARROW · ADVENTURER GUILD</p><h2>🏹 冒険者ギルド</h2><p>仲間と学んで、モンスターに挑もう！</p><img src="special-ally-portrait.webp" alt="冒険を応援する白いキツネ" onerror="this.style.display='none'"></section>
      <section class="wa-guild-panel"><h3>🦊 冒険者登録</h3><p class="hint">ランキングに表示する名前を決めよう</p><label for="wa-nick">ニックネーム（20文字まで）</label><input id="wa-nick" maxlength="20" placeholder="例：たろう"><button type="button" id="wa-profile" class="wa-register">冒険者として登録・変更</button><p id="wa-profile-result" role="status" aria-live="polite" class="hint"></p><p class="hint" style="margin-top:12px">このブラウザの匿名アカウントに名前と所属ギルドを保存します。次回は自動で開きます。ブラウザデータ削除や端末変更では引き継げません。</p></section>
      <section class="wa-guild-panel"><h3>🛡️ 所属ギルド</h3><p class="hint">仲間のいるギルドを選んで冒険を始めよう</p><div class="wa-guild-members" id="wa-groups">${groups.length?groups.map(g=>`<div class="group"><div><b>${esc(g.name)}</b><div class="hint">${Number(g.member_count)}人が参加中</div></div><button class="wa-enter" data-open="${esc(g.id)}">ギルドに入る</button></div>`).join(''):'<p class="hint">まだギルドがありません。下から作成できます。</p>'}</div></section>
      ${pending?'<section class="wa-guild-panel wa-pending"><h3>✉️ 招待状が届いています</h3><p class="hint">招待されたギルドに参加できます。</p><button id="wa-join">このギルドに参加</button></section>':''}
      <section class="wa-guild-panel"><h3>✚ 新しいギルドを作る</h3><label for="wa-group-name">ギルド名</label><input id="wa-group-name" maxlength="40" placeholder="例：5年1組"><button id="wa-create" class="wa-create">ギルドを作成</button></section>
      <button id="wa-play" class="wa-solo">ひとりで冒険する <span style="display:block;font-size:12px;font-weight:400;color:#bdd0e4;margin-top:4px">グループなしで通常ゲームをプレイ</span></button><p class="hint">ギルドを開いて開始した通常ゲームの得点は、終了時にオンライン共有されます。</p>`;
      $('wa-nick').value=getPref('nickname');
      $('wa-profile').onclick=async()=>{
        const btn=$('wa-profile'), result=$('wa-profile-result');
        const nickname=$('wa-nick').value.trim();
        if(!nickname){result.textContent='冒険者名を入力してください。';result.style.color='#ffb1a6';$('wa-nick').focus();return;}
        btn.disabled=true;btn.textContent='登録しています…';result.textContent='';
        try{
          check(await client.rpc('wa_set_profile',{p_nickname:nickname,p_avatar:'🐱'}));
          setPref('nickname',nickname);
          result.textContent='✓ 冒険者名を登録しました！';result.style.color='#a8f3c7';
          status.textContent='オンライン接続済み';status.className='';
        }catch(e){
          result.textContent='登録できませんでした：'+(e?.message||String(e));result.style.color='#ffb1a6';
          error(e);
        }finally{btn.disabled=false;btn.textContent='冒険者として登録・変更';}
      };
      $('wa-create').onclick=async()=>{try{const name=$('wa-group-name').value;const id=check(await client.rpc('wa_create_group',{p_name:name}));await showGroup(id);}catch(e){error(e)}};
      content.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>showGroup(b.dataset.open));
      if(pending)$('wa-join').onclick=async()=>{try{const id=check(await client.rpc('join_group',{p_invite_code:pending}));history.replaceState({},'',location.pathname);await showGroup(id);}catch(e){error(e)}};
      $('wa-play').onclick=()=>{selected=null;panel.hidden=true};
    }catch(e){error(e)}
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
      <button id="wa-start" class="wa-primary-play">🎮 通常ゲームを開始</button>
      <section class="wa-daily-wrap"><h3>🏆 今日のオンライン対戦</h3><p class="hint">各級・各科目それぞれ1日1回。全員が同じ10問に挑戦（1問100点）。</p>
      <div class="wa-daily-grid"><div class="wa-grade-card grade5"><h4>🌱 5級チャレンジ</h4><p>基礎から挑戦したい人向け</p><button id="wa-daily-e5">英検5級に挑戦</button><button id="wa-daily-k5">漢検5級に挑戦</button></div>
      <div class="wa-grade-card grade4"><h4>⚡ 4級チャレンジ</h4><p>少し難しい問題に挑戦</p><button id="wa-daily-e">英検4級に挑戦</button><button id="wa-daily-k">漢検4級に挑戦</button></div></div></section>
      <h3>📊 今日のランキング</h3><div id="wa-rankings"></div><button id="wa-back" class="secondary">✏️ ニックネーム・ギルドを変更</button><p class="hint">通常ゲームの最高得点もオンライン共有されます（自己申告スコア・未検証）。</p>`;
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
    try{
      const data=check(await client.rpc('wa_start_daily',{p_group_id:groupId,p_subject:subject}));
      if(data.finished){status.textContent='今日は回答済みです。明日また挑戦してください。';await showRankings(groupId);return;}
      stopMiniTimer();dailyMiniPoints=0;dailyMiniResults=[];dailyRun=data.run_id;dailyQuestions=data.questions;dailyAnswers=[];dailyIndex=0;dailySubject=subject;
      selected=groupId;renderDailyQuestion();
    }catch(e){error(e)}
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
  function renderDailyMiniPuzzle(){
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
      content.innerHTML=`<h2>結果発表！</h2><p>通常クイズ：<b>${result.score} pt</b></p><p>ミニパズル：<b>+${dailyMiniPoints} pt</b></p><p style="font-size:32px;font-weight:bold">合計 ${Number(result.score)+dailyMiniPoints} Point!</p><p>${result.correct} / ${result.total} 問正解</p><p class="hint">※現在ランキングに保存されるのは通常クイズの ${result.score} pt のみです。ミニパズル点の公式ランキング反映にはSupabaseの採点関数更新が必要です。</p><button id="wa-return">グループに戻る</button>`;
      $('wa-return').onclick=()=>showGroup(selected);
    }catch(e){error(e);content.innerHTML='<button id="wa-retry">再送信</button>';
      $('wa-retry').onclick=finishDaily;}
  }

})();
