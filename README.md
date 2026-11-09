# ワードアロー — Supabase接続・第1段階

このパッケージは**元のワードアローゲーム**に、匿名ログイン・ニックネーム・グループ作成・招待リンク参加・メンバー表示のオンラインロビーを追加します。

**重要:** スコアは元のゲームの `localStorage` のままです。オンラインランキング、サーバー検証、共通デイリーチャレンジは未実装です。公開ランキングとして使わないでください。

## 1. Supabase SQL

Supabase → SQL Editor → New query → `supabase/02_online_groups.sql` の内容を貼り付け → Run。
既存の5テーブルと `add_group_owner` トリガー、`join_group(uuid)` 関数が作成済みであることが前提です。

## 2. 公開キーの設定

`supabase-config.js` の `PASTE_YOUR_sb_publishable_KEY_HERE` を Supabase → Settings → API Keys の Publishable key に置き換えます。
`sb_secret_...` / `service_role` / DBパスワードは絶対に入れないでください。

## 3. GitHubにアップロード

GitHub の `word-arrow` リポジトリのルートに `index.html`, `online.js`, `supabase-config.js`, `.nojekyll` をアップロード/上書きし、Commit changes。
GitHub Pages のURLを開いてテストします。SQLファイルとREADMEも保存しておくと管理に便利です。

## 4. 動作確認

- 1つ目のブラウザでニックネーム登録 → グループ作成 → 招待URLコピー
- シークレットウィンドウまたは別端末で招待URLを開く → ニックネーム登録 → グループ参加
- グループ画面で参加者が2人と表示されることを確認
- 「ゲームを開始」で元のゲームが動くことを確認

匿名アカウントはブラウザデータ削除・別端末移行で復旧できません。公開前にSupabase AuthenticationのCAPTCHA/レート制限とRLSの再確認を推奨します。

## 注意

- 招待URLは秘密のUUIDを含み、URLを知る人は参加可能です。外部への共有に注意。
- グループ名やニックネームに個人情報を入力しない運用を推奨。
- 本版はグループの切り替え表示のみで、ゲームスコアとグループはまだ連動していません。
