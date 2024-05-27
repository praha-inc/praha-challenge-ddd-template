import crypto from "node:crypto";
import { factory } from "ulid";

// ulidが内部でrequireを使用している為、ESM形式で出力したJSをNodeで実行時にエラーが発生する
// import形式でcryptoを読み込み、ulidの内部実装と同じ処理を行うことで解決する
// @see: https://github.com/ulid/javascript/blob/v2.3.0/lib/index.ts#L133-L134
export const ulid = factory(() => {
  return crypto.randomBytes(1).readUInt8() / 0xff;
});
