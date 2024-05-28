# プラハチャレンジDDD課題テンプレート

環境構築が大変という方のために、ある程度オニオンアーキテクチャに準拠する形でサンプルアプリケーション（TODOリスト）を用意しました。ここから拡張していく形で課題に取り組んでください。

## 環境構築

- `pnpm install`で依存関係をインストールしてください。
- `.env.example`をコピーして、`.env`を作成してください。
- `pnpm run migration:apply`でDBのマイグレーションを実行してください。
  - `docker compose up`でDBのコンテナーを起動しておく必要があります。

## 開発

- `pnpm run dev`でAPIサーバーを起動できます。
- `pnpm run lint`でBiomeによる静的解析とフォーマットを実行できます。
- `pnpm run build`でビルド、`pnpm run start`でビルドしたものを起動できます。
- `pnpm run test`でテストを実行できます。
- `./src/libs/drizzle/schema.ts`でデータベースのテーブル定義を変更できます。
  - 変更したテーブル定義をDBに反映するには、`pnpm run migration:generate`でマイグレーションファイルを生成し、`pnpm run migration:apply`でマイグレーションを実行してください。
- DBのマイグレーションファイル（`./src/libs/drizzle/migrations/*`）を削除したい場合は、`pnpm run migration:drop`で削除してください。
  - `drizzle-kit`がマイグレーションの整合性を取れなくなるため、手作業で削除しないでください。

## 注意

このリポジトリはあくまで環境構築の手間を省くためのリポジトリです。Value Objectがない・Nominal Typingができていない（Taskと同じプロパティを持つクラスだと型が等価になってしまう）などなど、厳密な実装は全然できておりません。あるべき姿を模索しつつ実装を進めてください！
