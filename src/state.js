// 状态与四个状态机（单一数据源，宿主拉取式渲染：改完 state 后手动 $metrix.invalidate）。
// state 是普通对象：宿主按需调 render() 拉取组件树，无需响应式订阅。

import { getJSON, readStatus, readReset } from "./api.js";
import { t } from "./i18n.js";
import { API, SHOT_HEIGHT } from "./constants.js";

export const state = {
  status: null,        // /status 解析结果
  resets: [],          // /resets 列表（时间倒序）
  error: "",           // 最近一次请求错误（失败时保留旧数据）
  lastLoadedAt: 0,     // 最近一次成功加载时间戳
  seenId: "",          // 提醒机：已见过的最新公告 id
  tzMode: "local",     // 时区显示："local" | "utc"
};

// ---------------------------------------------------------------------------
// 状态机 1：时区偏好（tzMode）
// 切换即持久化到 localStorage（key: tzMode），Worker 重载后保留；
// localStorage 不可用时静默降级为会话内生效。
// ---------------------------------------------------------------------------
const TZ_KEY = "tzMode";
try {
  if (globalThis.localStorage && globalThis.localStorage.getItem(TZ_KEY) === "utc") {
    state.tzMode = "utc";
  }
} catch { /* 读取失败按默认 local */ }

export function setTzMode(value) {
  state.tzMode = value;
  try { globalThis.localStorage && globalThis.localStorage.setItem(TZ_KEY, value); } catch { /* 忽略 */ }
}

// ---------------------------------------------------------------------------
// 状态机 2：刷新机（inflight promise 为单一来源）
//   inflight 非空 = 正在加载（loading 派生自它，不另存字段）；
//   重复 refresh 直接复用同一 promise（去重）；失败写 state.error 并保留旧数据。
// ---------------------------------------------------------------------------
let inflight = null;
export const loading = () => !!inflight;

async function load(env) {
  const [st, rs] = await Promise.all([
    getJSON(API + "/status"),
    getJSON(API + "/resets?limit=100"),
  ]);
  const next = readStatus(st);
  const list = Array.isArray(rs && rs.data) ? rs.data.map(readReset).filter(Boolean) : [];
  state.status = next;
  state.resets = list;
  state.error = "";
  state.lastLoadedAt = Date.now();

  // 状态机 3：提醒机（seenId）
  // 首次加载只记录最新公告 id（= 武装，不通知）；之后 id 变化才触发提醒。
  const latest = next.latest;
  if (latest && latest.id) {
    if (state.seenId && state.seenId !== latest.id) {
      const on = !(env && env.inputs && env.inputs.notifyEnabled === false);
      if (on) {
        const summary = latest.text.length > 120 ? latest.text.slice(0, 117) + "…" : latest.text;
        $metrix.notify(t("通知标题"), summary || t("通知兜底"));
        $metrix.toast(t("通知标题"));
      }
    }
    state.seenId = latest.id;
  }
}

export function refresh(env) {
  if (inflight) return inflight;
  $metrix.invalidate();
  inflight = load(env)
    .catch(e => { state.error = String(e && e.message || e); })   // 失败保留旧数据
    .finally(() => { inflight = null; $metrix.invalidate(); });
  return inflight;
}
export const launchRefresh = () => { void refresh(); };

// ---------------------------------------------------------------------------
// 状态机 4：面板相位（phase）
//   无数据 + 有错误 → "problem"（整面板换错误视图）
//   无数据          → "loading"（整面板换加载视图）
//   有数据          → "ready"（错误降级为顶部横幅，保留旧数据）
// ---------------------------------------------------------------------------
export function phase() {
  if (state.status || state.resets.length) return "ready";
  return state.error ? "problem" : "loading";
}

// ---------------------------------------------------------------------------
// 分享机（sharing 单一来源：去重锁 + 分享态渲染标记）
// 对面板截图并复制到剪贴板。实测约束：
// 1. 需在 <script apis="..."> 声明 screenshot，否则 $metrix.panel 是空对象。
// 2. 必须等面板 commit 后再调用；同步直调会报 context canceled。
// 3. 常规面板固定 600 高 + Scroll 会裁掉内容；截图前切"分享态"把 Scroll 换成 Column，
//    内容溢出渲染即可截全。根容器高度保持 600 不变，窗口不抖动。
// ---------------------------------------------------------------------------
let sharing = false;
export const isSharing = () => sharing;

export function shareShot() {
  if (sharing) return;
  if (typeof ($metrix.panel && $metrix.panel.screenshot) !== "function") {
    $metrix.notify("Codex Resets", t("截图不支持"));
    return;
  }
  sharing = true;
  $metrix.invalidate();                     // 渲染分享态（完整内容）
  setTimeout(() => {
    (async () => {
      try {
        const blob = await $metrix.panel.screenshot({ scale: 2, height: SHOT_HEIGHT });
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        $metrix.notify("Codex Resets", t("截图成功"));
      } catch (e) {
        $metrix.notify("Codex Resets", t("截图失败", String((e && e.message) || e)));
      } finally {
        sharing = false;
        $metrix.invalidate();               // 恢复常规 600px 面板
      }
    })();
  }, 1500);
}
