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
#wa-online .wa-result{font-size:13px;color:#a7e8c8;min-height:18px}
`;document.head.append(style);document.body.append(panel);
const gameUrl=location.origin+location.pathname;
panel.innerHTML=`<div class="wa-card"><h1>🏹 ワードアロー</h1><p id="wa-status" class="wa-status">オンライン接続を確認中…</p>
<div class="wa-banner"><small>WORD ARROW · WORLD RANKING</small><h2 style="margin:12px 0 4px">🏹 ワードアロー</h2><p>みんなと最高得点を競おう！ グループ登録は不要です。</p></div>
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
$('wa-share').onclick=()=>{const host=$('wa-share-box');host.hidden=!host.hidden;$('wa-share').setAttribute('aria-expanded',String(!host.hidden));if(!host.hidden){$('wa-invite-url').value=gameUrl;$('wa-qr').src='https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=12&data='+encodeURIComponent(gameUrl)}};
$('wa-copy').onclick=async()=>{try{await navigator.clipboard.writeText(gameUrl);$('wa-copy').textContent='✓ コピーしました'}catch(e){$('wa-invite-url').select();$('wa-copy').textContent='URLを選択しました'}};
$('wa-native').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'ワードアロー',url:gameUrl})}catch(e){}}else{$('wa-invite-url').select();}};
})();
