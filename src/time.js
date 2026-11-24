// 时间格式化（Worker 无 Intl，全部手工格式化；纯函数，无状态依赖）。

import { LANG } from "./i18n.js";

// 相对时间：中英两套实现，兼容未来时间（值守预测）→ 中文「x 天后」/ 英文「in 2d」
export function relTime(iso) {
  const t = Date.parse(iso || "");
  if (!Number.isFinite(t)) return "—";
  let ms = Date.now() - t;
  const future = ms < 0;
  ms = Math.abs(ms);
  const min = Math.floor(ms / 60e3);
  if (LANG === "zh") {
    const suffix = future ? "后" : "前";
    if (min < 1) return "刚刚";
    if (min < 60) return min + " 分钟" + suffix;
    const hr = Math.floor(min / 60);
    if (hr < 24) return hr + " 小时" + suffix;
    const day = Math.floor(hr / 24);
    if (day < 30) return day + " 天" + suffix;
    const mon = Math.floor(day / 30);
    if (mon < 12) return mon + " 个月" + suffix;
    return Math.floor(mon / 12) + " 年" + suffix;
  }
  if (min < 1) return "just now";
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const mon = Math.floor(day / 30);
  let n, unit;
  if (min < 60) { n = min; unit = "m"; }
  else if (hr < 24) { n = hr; unit = "h"; }
  else if (day < 30) { n = day; unit = "d"; }
  else if (mon < 12) { n = mon; unit = "mo"; }
  else { n = Math.floor(mon / 12); unit = "y"; }
  return future ? "in " + n + unit : n + unit + " ago";
}

// 绝对时间：本地默认时区 / UTC（utc 由调用方传 state.tzMode === "utc"）
export function absTime(iso, utc) {
  const t = Date.parse(iso || "");
  if (!Number.isFinite(t)) return "—";
  const d = new Date(t);
  const p = n => String(n).padStart(2, "0");
  const date = utc
    ? d.getUTCFullYear() + "-" + p(d.getUTCMonth() + 1) + "-" + p(d.getUTCDate())
    : d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  const time = utc
    ? p(d.getUTCHours()) + ":" + p(d.getUTCMinutes())
    : p(d.getHours()) + ":" + p(d.getMinutes());
  return date + " " + time + (utc ? " UTC" : "");
}

// 日历月份标签：中文「N月」，英文缩写（Jan…）；对应标签宽度随语言微调。
// 注意：i18n 与本模块互相引用（fmtDays / LANG），此处必须做成函数延迟取值，避免循环初始化读到未定义的 LANG。
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const monthLabel = m => (LANG === "zh" ? String(m + 1) + "月" : MONTHS[m]);
export const monthLabelWidth = () => (LANG === "zh" ? 26 : 30);

export const pad2 = n => String(n).padStart(2, "0");
export const hhmm = t => { const d = new Date(t); return pad2(d.getHours()) + ":" + pad2(d.getMinutes()); };
export const daysSince = iso => {
  const t = Date.parse(iso || "");
  return Number.isFinite(t) ? (Date.now() - t) / 864e5 : null;
};
// 保留一位小数，整数不带小数点
export const fmtDays = v => String(v >= 10 ? Math.round(v) : Math.round(v * 10) / 10);
