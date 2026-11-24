// 构建：esbuild 打包 src/main.js（format=esm，零运行时依赖），注入 .bar 模板写出 codex-resets.bar。
//   node build.mjs         构建
//   node build.mjs --check 校验仓库内 codex-resets.bar：XML 良构、CDATA 语法、无外部依赖、构建新鲜度
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CODEX_ICON } from "./src/icon.js";

const OUT = "codex-resets.bar";
const VERSION = "0.3.0";

async function bundle() {
  const result = await build({
    entryPoints: ["src/main.js"],
    bundle: true,
    format: "esm",
    target: "es2022",
    write: false,
    logLevel: "silent",
  });
  const js = result.outputFiles[0].text.trimEnd();
  if (js.includes("]]>")) throw new Error("esbuild 产物包含 CDATA 结束符 ]]>，无法嵌入 .bar");
  if (/\brequire\s*\(/.test(js)) throw new Error("esbuild 产物包含 require()，应为纯 ESM");
  if (/^\s*import[\s{"']/m.test(js)) throw new Error("esbuild 产物包含外部 import，应已全部打包内联");
  return js;
}

// .bar 模板：根元素全部属性 + permissions + inputs + docs + script CDATA。
// 与 v0.2.0 保持一致：无 XML 声明，直接以 <bar> 开头。script 为构建产物，源码在 src/，请勿手改此文件。
const template = js => `<bar protocol-version="0"
     id="codex-resets"
     title="Codex Resets"
     version="${VERSION}"
     category="ai"
     refresh="2m"
     placements="menubar"
     open-mode="flyout"
     description="追踪 Codex 额度重置公告，新公告即提醒 / Track Codex quota resets and get notified."
     homepage="https://codex-resets.com"
     icon="${CODEX_ICON}">

  <permissions>
    <network origin="https://codex-resets.com" />
  </permissions>

  <inputs>
    <input name="notifyEnabled"
           type="bool"
           default="true"
           label="新重置提醒"
           help="检测到新的额度重置公告时发送系统通知。">
      <locale lang="en" label="New reset alerts" help="Send a system notification when a new reset announcement appears." />
    </input>
  </inputs>

  <docs><![CDATA[数据来自 codex-resets.com 公开 API，每 2 分钟检查一次，出现新公告时发系统通知（可在设置关闭）。面板展示最近 3 条公告与近 4 个月重置日历，完整归档见官网。界面语言跟随 Metrix.Bar 显示语言。

English: data from the public codex-resets.com API, checked every 2 minutes, with optional notifications on new announcements. The panel shows the latest 3 announcements and a 4-month calendar; see codex-resets.com for the full archive. The language follows your Metrix.Bar display language.]]></docs>

  <script apis="screenshot clipboard shell"><![CDATA[
${js}
  ]]></script>
</bar>
`;

// 从 .bar 提取 CDATA 脚本（校验用）
function extractScript(src) {
  const m = src.match(/<script[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/script>/);
  if (!m) throw new Error("script CDATA not found");
  return m[1];
}

function validate(path) {
  const src = readFileSync(path, "utf8");
  // XML 良构的最低限度结构断言（无 XML 解析器依赖；与 v0.2.0 一致，无 XML 声明）
  if (!/^\s*<bar\b/.test(src)) throw new Error("bar 根元素开头异常");
  if (!src.trimEnd().endsWith("</bar>")) throw new Error("bar 根元素未闭合");
  const opens = (src.match(/<bar\b/g) || []).length, closes = (src.match(/<\/bar>/g) || []).length;
  if (opens !== 1 || closes !== 1) throw new Error("bar 根元素数量异常");
  const cdataOpens = (src.match(/<!\[CDATA\[/g) || []).length;
  const cdataCloses = (src.match(/\]\]>/g) || []).length;
  if (cdataOpens !== cdataCloses) throw new Error("CDATA 定界符数量不配对");
  // node --check（提取 CDATA 为 .mjs）
  const js = extractScript(src);
  const dir = mkdtempSync(join(tmpdir(), "bar-check-"));
  const file = join(dir, "script.mjs");
  writeFileSync(file, js);
  execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  return js;
}

if (process.argv.includes("--check")) {
  const current = readFileSync(OUT, "utf8");
  validate(OUT);                                   // 良构 + 语法
  const fresh = await bundle();
  const expected = template(fresh);
  if (current !== expected) {
    throw new Error("codex-resets.bar 与 src/ 构建结果不一致，请重跑 node build.mjs");
  }
  console.log(`check 通过：XML 良构、CDATA 语法有效、无外部依赖、与 src/ 构建一致（${VERSION}）`);
} else {
  const js = await bundle();
  writeFileSync(OUT, template(js));
  validate(OUT);
  console.log(`构建完成：${OUT}（脚本 ${js.split("\n").length} 行，零运行时依赖）`);
}
