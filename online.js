/* Word Arrow online lobby. Game scoring remains LOCAL until a server-verified scoring system is implemented. */
(async function () {
  'use strict';
  const config=window.WORD_ARROW_SUPABASE;
  const panel=document.createElement('div');panel.id='wa-online';
  panel.innerHTML=`<div class="wa-online-card"><h1>🏹 ワードアロー</h1><p id="wa-status">Supabaseに接続中…</p><div id="wa-content"></div></div>`;
  document.body.append(panel);
  const style=document.createElement('style');
  style.textContent=`#wa-online{position:fixed;inset:0;z-index:99999;background:#f3f6fb;overflow:auto;padding:30px 14px;font:16px system-ui,sans-serif;color:#152233}#wa-online[hidden]{display:none!important}.wa-online-card{max-width:510px;margin:15px auto;padding:25px;background:white;border:1px solid #dce3ed;border-radius:20px;box-shadow:0 12px 30px #15223312}.wa-online-card h1{font-size:28px}.wa-online-card input,.wa-online-card select{width:100%;box-sizing:border-box;border:1px solid #c4cdd9;border-radius:9px;padding:12px;margin:7px 0 14px;font:inherit}.wa-online-card button{background:#2456c8;color:white;border:0;border-radius:9px;padding:12px 15px;margin:5px 6px 5px 0;font:inherit;cursor:pointer}.wa-online-card button.secondary{background:#e9eef7;color:#152233}.wa-online-card .group{border:1px solid #dce3ed;padding:12px;border-radius:12px;margin:10px 0}.wa-online-card .hint{font-size:13px;color:#64748b}.wa-online-card .error{color:#ba2222}`;
  document.head.append(style);
  const $=id=>document.getElementById(id), status=$('wa-status'),content=$('wa-content');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function error(e){status.textContent='エラー: '+(e?.message||String(e));status.className='error';}
  function check(result){if(result.error)throw result.error;return result.data;}
  if(!config||!config.publishableKey.startsWith('sb_publishable_')){error('supabase-config.js にPublishable keyを設定してください。');return;}
  if(!window.supabase){error('supabase-jsの読み込みに失敗しました。ネット接続を確認してください。');return;}
  const client=window.supabase.createClient(config.url,config.publishableKey);
  let user,selected=null;
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
      content.innerHTML=`<label>ニックネーム（20文字まで）<input id="wa-nick" maxlength="20" placeholder="例：たろう"></label><button id="wa-profile">名前を登録・変更</button><p class="hint">このブラウザに匿名アカウントを保存します。ブラウザデータ削除や端末変更では引き継げません。</p><hr><h3>グループ</h3><div id="wa-groups">${groups.length?groups.map(g=>`<div class="group"><b>${esc(g.name)}</b>（${g.member_count}人）<br><button data-open="${g.id}">開く</button></div>`).join(''):'まだグループがありません'}</div><label>新しいグループ名<input id="wa-group-name" maxlength="40" placeholder="例：4年1組"></label><button id="wa-create">グループを作成</button>${pending?'<hr><p>招待リンクが届いています。</p><button id="wa-join">このグループに参加</button>':''}<hr><button id="wa-play" class="secondary">グループなしでゲームを遊ぶ</button><p class="hint">この版のスコア・ランキングは端末内保存です。オンライン得点共有は次の実装で対応します。</p>`;
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
      content.innerHTML=`<h2>${esc(g.name)}</h2><p>${members.length}人が参加</p><ul>${members.map(m=>`<li>${esc(m.avatar)} ${esc(m.nickname)}</li>`).join('')}</ul><p>友達にこの招待URLを送ってください。</p><input id="wa-invite" readonly value="${esc(invite)}"><button id="wa-copy">招待URLをコピー</button><br><button id="wa-start">ゲームを開始</button><button id="wa-back" class="secondary">戻る</button><p class="hint">オンラインランキングはまだ未実装です。ゲーム内のランキングは端末内の記録です。</p>`;
      $('wa-copy').onclick=async()=>{try{await navigator.clipboard.writeText(invite);status.textContent='招待URLをコピーしました'}catch(e){$('wa-invite').select();status.textContent='URLを選択しました。コピーしてください'}};
      $('wa-start').onclick=()=>{panel.hidden=true};
      $('wa-back').onclick=showHome;
    }catch(e){error(e)}
  }
})();
