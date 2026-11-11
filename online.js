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
  document.head.append(style);
  const $=id=>document.getElementById(id), status=$('wa-status'),content=$('wa-content');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function error(e){status.textContent='エラー: '+(e?.message||String(e));status.className='error';}
  function check(result){if(result.error)throw result.error;return result.data;}
  if(!config||!config.publishableKey.startsWith('sb_publishable_')){error('supabase-config.js にPublishable keyを設定してください。');return;}
  if(!window.supabase){error('supabase-jsの読み込みに失敗しました。ネット接続を確認してください。');return;}
  const client=window.supabase.createClient(config.url,config.publishableKey);
  let user,selected=null;
  // Normal-game results are client-reported and therefore marked unverified.
  window.WAOnline = {
    submitNormalScore: async function(result){
      if(!selected || !user) return;
      const payload={p_group_id:selected,p_subject:result.subject,p_score:result.score,
        p_stages:result.stages,p_correct:result.correct,p_total:result.total};
      check(await client.rpc('wa_submit_normal_score',payload));
    }
  };
  let dailyRun=null, dailyAnswers=[], dailyIndex=0, dailyQuestions=[];
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
      content.innerHTML=`<label>ニックネーム（20文字まで）<input id="wa-nick" maxlength="20" placeholder="例：たろう"></label><button id="wa-profile">名前を登録・変更</button><p class="hint">このブラウザに匿名アカウントを保存します。ブラウザデータ削除や端末変更では引き継げません。</p><hr><h3>グループ</h3><div id="wa-groups">${groups.length?groups.map(g=>`<div class="group"><b>${esc(g.name)}</b>（${g.member_count}人）<br><button data-open="${g.id}">開く</button></div>`).join(''):'まだグループがありません'}</div><label>新しいグループ名<input id="wa-group-name" maxlength="40" placeholder="例：4年1組"></label><button id="wa-create">グループを作成</button>${pending?'<hr><p>招待リンクが届いています。</p><button id="wa-join">このグループに参加</button>':''}<hr><button id="wa-play" class="secondary">グループなしでゲームを遊ぶ</button><p class="hint">グループを開いて開始した通常ゲームの得点は、終了時にオンライン共有されます。</p>`;
      $('wa-profile').onclick=async()=>{try{check(await client.rpc('wa_set_profile',{p_nickname:$('wa-nick').value,p_avatar:'🐱'}));status.textContent='名前を登録しました';}catch(e){error(e)}};
      $('wa-create').onclick=async()=>{try{const name=$('wa-group-name').value;const id=check(await client.rpc('wa_create_group',{p_name:name}));await showGroup(id);}catch(e){error(e)}};
      content.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>showGroup(b.dataset.open));
      if(pending)$('wa-join').onclick=async()=>{try{const id=check(await client.rpc('join_group',{p_invite_code:pending}));history.replaceState({},'',location.pathname);await showGroup(id);}catch(e){error(e)}};
      $('wa-play').onclick=()=>{panel.hidden=true};
    }catch(e){error(e)}
  }
  async function showGroup(id){
    try{
      const groups=check(await client.rpc('wa_my_groups'))||[];
      const g=groups.find(x=>x.id===id);
      if(!g)throw Error('グループが見つかりません');
      const members=check(await client.rpc('wa_group_members',{p_group_id:id}))||[];
      selected=id;
      const invite=location.origin+location.pathname+'?group='+encodeURIComponent(g.invite_code);
      content.innerHTML=`<h2>${esc(g.name)}</h2><p>${members.length}人が参加</p><ul>${members.map(m=>`<li>${esc(m.avatar)} ${esc(m.nickname)}</li>`).join('')}</ul>
      <div class="wa-invite-panel"><p class="wa-invite-label">🔗 友達を招待</p><div class="wa-invite-row"><input id="wa-invite" aria-label="招待URL" readonly value="${esc(invite)}"><button id="wa-copy" aria-label="招待URLをコピー">コピー</button></div><p class="hint" style="margin:8px 0 0">リンクを送ると、このグループに参加できます。</p></div>
      <button id="wa-start" class="wa-primary-play">🎮 通常ゲームを開始</button>
      <section class="wa-daily-wrap"><h3>🏆 今日のオンライン対戦</h3><p class="hint">各級・各科目それぞれ1日1回。全員が同じ10問に挑戦（1問100点）。</p>
      <div class="wa-daily-grid"><div class="wa-grade-card grade5"><h4>🌱 5級チャレンジ</h4><p>基礎から挑戦したい人向け</p><button id="wa-daily-e5">英検5級に挑戦</button><button id="wa-daily-k5">漢検5級に挑戦</button></div>
      <div class="wa-grade-card grade4"><h4>⚡ 4級チャレンジ</h4><p>少し難しい問題に挑戦</p><button id="wa-daily-e">英検4級に挑戦</button><button id="wa-daily-k">漢検4級に挑戦</button></div></div></section>
      <h3>📊 今日のランキング</h3><div id="wa-rankings"></div><button id="wa-back" class="secondary">← グループ一覧へ</button><p class="hint">通常ゲームの最高得点もオンライン共有されます（自己申告スコア・未検証）。</p>`;
      $('wa-copy').onclick=async()=>{try{await navigator.clipboard.writeText(invite);status.textContent='招待URLをコピーしました'}catch(e){$('wa-invite').select();status.textContent='URLを選択しました。コピーしてください'}};
      $('wa-start').onclick=()=>{panel.hidden=true};
      $('wa-daily-e').onclick=()=>startDaily(id,'eiken4');
      $('wa-daily-k').onclick=()=>startDaily(id,'kanken4');
      $('wa-daily-e5').onclick=()=>startDaily(id,'eiken5');
      $('wa-daily-k5').onclick=()=>startDaily(id,'kanken5');
      await showRankings(id);
      await showNormalRankings(id);
      $('wa-back').onclick=showHome;
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
      dailyRun=data.run_id;dailyQuestions=data.questions;dailyAnswers=[];dailyIndex=0;
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
      btn.onclick=()=>{dailyAnswers.push(i);dailyIndex++;renderDailyQuestion();};host.append(btn);
    });
  }
  async function finishDaily(){
    content.innerHTML='<h2>採点中…</h2>';
    try{
      const result=check(await client.rpc('wa_finish_daily',{p_run_id:dailyRun,p_answers:dailyAnswers}));
      content.innerHTML=`<h2>結果発表！</h2><p style="font-size:32px;font-weight:bold">${result.score}点</p><p>${result.correct} / ${result.total} 問正解</p><button id="wa-return">グループに戻る</button>`;
      $('wa-return').onclick=()=>showGroup(selected);
    }catch(e){error(e);content.innerHTML='<button id="wa-retry">再送信</button>';
      $('wa-retry').onclick=finishDaily;}
  }

})();
