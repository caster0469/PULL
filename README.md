# PULL

PULL は、動画や音声をシンプルな操作で保存するためのクロスプラットフォーム対応デスクトップアプリです。Electron、React、TypeScript、Vite を使用し、実際のメディア情報取得とダウンロードには [yt-dlp](https://github.com/yt-dlp/yt-dlp)、変換・結合には [FFmpeg](https://ffmpeg.org/) を利用します。

## 主な機能

- URL を貼り付けると、タイトル、投稿者、サムネイル、再生時間を取得
- 動画を MP4、音声を MP3 または M4A で保存
- 取得できる画質・音質から希望する品質を選択
- ダウンロードの進捗、速度、残り時間をリアルタイム表示
- 複数ダウンロードのキュー管理とキャンセル
- 完了・失敗・キャンセルを含む履歴の保存
- 保存先、既定の品質、同時ダウンロード数を設定
- システム設定に連動するライト／ダークテーマ
- macOS、Windows、Linux 向けのパッケージ作成

## 必要なもの

開発環境では、次のソフトウェアをインストールして `PATH` から実行できるようにしてください。

- [Node.js](https://nodejs.org/)（LTS 版を推奨）
- npm
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/)（`ffmpeg` と `ffprobe`）

各コマンドが利用できることを確認します。

```bash
node --version
npm --version
yt-dlp --version
ffmpeg -version
ffprobe -version
```

## セットアップ

```bash
git clone <repository-url>
cd PULL
npm install
npm run dev
```

`npm run dev` は Vite、Electron 用 TypeScript コンパイラー、Electron アプリをまとめて起動します。初回起動時の保存先は、OS の標準ダウンロードフォルダーです。

## 使い方

1. PULL を起動します。
2. ホーム画面に動画の URL を貼り付け、情報の解析が完了するまで待ちます。
3. `VIDEO` または `AUDIO` を選びます。
4. 保存形式と品質を選択します。
5. **ダウンロード開始**を押します。
6. ダウンロード一覧で進捗を確認します。完了後は履歴からファイルを開くか、保存場所を表示できます。

保存先や既定値は、サイドバーの設定画面から変更できます。同時ダウンロード数は 1〜5 件に設定できます。

> [!IMPORTANT]
> ダウンロードするコンテンツについて、利用規約、著作権、その他の適用法令を確認し、保存する権利のあるコンテンツにのみ使用してください。対応サイトや利用可能な形式は、対象サービスと yt-dlp の対応状況によって異なります。

## npm スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーと Electron アプリを起動 |
| `npm run typecheck` | Renderer と Electron の TypeScript 型チェックを実行 |
| `npm run lint` | TypeScript 型チェックを実行 |
| `npm run build` | 型チェック後、Renderer と Electron をビルド |
| `npm run package` | 現在の環境向けインストーラーを作成 |
| `npm run package:mac` | macOS 向け DMG を作成 |
| `npm run package:win` | Windows 向け NSIS インストーラーを作成 |
| `npm run package:linux` | Linux 向け deb パッケージを作成 |

## 配布パッケージの作成

パッケージ版はシステムの `PATH` ではなく、アプリに同梱したバイナリを使用します。以下のいずれかのディレクトリを `resources/binaries/` の下に作成し、対象環境用の `yt-dlp`、`ffmpeg`、`ffprobe` を配置してください。

```text
resources/binaries/
├── darwin-arm64/
├── darwin-x64/
├── linux-arm64/
├── linux-x64/
├── win32-arm64/
└── win32-x64/
```

Windows 用バイナリには `.exe` 拡張子が必要です。たとえば Linux x64 向けの構成は次のとおりです。

```text
resources/binaries/linux-x64/
├── yt-dlp
├── ffmpeg
└── ffprobe
```

配置後、対象 OS 用の `npm run package:*` コマンドを実行します。クロスプラットフォームのパッケージ作成では、対象 OS のツールチェーンや署名設定が別途必要になる場合があります。

## プロジェクト構成

```text
.
├── electron/
│   ├── main/          # Electron のメインプロセスと IPC
│   ├── preload/       # Renderer に公開する安全な API
│   └── services/      # ダウンロード、設定、履歴、バイナリ管理
├── resources/
│   └── binaries/      # 配布時に同梱する外部バイナリ
├── shared/            # メイン／Renderer 共通の型定義
└── src/               # React 製のユーザーインターフェース
```

設定と履歴は Electron の `userData` ディレクトリに JSON として保存されます。ダウンロードしたファイルは、設定画面で選択したディレクトリに出力されます。

## トラブルシューティング

### `yt-dlp が見つかりません` と表示される

開発時は `yt-dlp` が `PATH` に含まれているか確認してください。パッケージ版では、実行環境に合うバイナリが `resources/binaries/<platform>-<arch>/` に同梱されているか確認します。

### 動画情報を取得できない、またはダウンロードに失敗する

- URL がブラウザーで開けるか確認する
- yt-dlp を最新版へ更新する
- 非公開、地域制限、ログイン必須などの制限がないか確認する
- 設定した保存先が存在し、書き込み可能か確認する

### 変換や結合に失敗する

`ffmpeg` と `ffprobe` の両方が利用可能か確認してください。アプリの設定画面にある「システム情報」から、認識されている各ツールのバージョンを確認できます。
