// API 读取层：fetch + 形状归一（防御字段缺失）。

import { t } from "./i18n.js";

export const num = v => (Number.isFinite(v) ? v : null);

export function readReset(raw) {
  if (!raw || typeof raw !== "object") return null;
  const out = {
    id: String(raw.id || ""),
    type: raw.reset_type === "banked" ? "banked" : "regular",
    at: String(raw.announced_at || ""),
    text: String(raw.text || ""),
    url: String(raw.source && raw.source.url || ""),
  };
  if (!out.id && !out.at && !out.text) return null;
  return out;
}

export function readStatus(body) {
  const d = body && body.data && typeof body.data === "object" ? body.data : {};
  const stats = d.stats && typeof d.stats === "object" ? d.stats : {};
  return {
    latest: readReset(d.latest_reset),
    scheduled: readReset(d.scheduled_reset),   // 可能为 null
    watch: readReset(d.active_watch),         // 可能为 null
    total: num(Number(stats.total)),
    lastResetAt: String(stats.last_reset_at || ""),
    daysSinceLast: num(Number(stats.days_since_last)),
    avgIntervalDays: num(Number(stats.avg_interval_days)),
    generatedAt: String(body && body.meta && body.meta.generated_at || ""),
  };
}

// 两段式报错：HTTP 状态 / 响应无效（JSON 解析失败与形状异常统一报后者）
export async function getJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(t("网络错误", res.status));
  let body = null;
  try { body = await res.json(); } catch { /* 解析失败视同无效响应 */ }
  if (!body || typeof body !== "object") throw new Error(t("格式错误"));
  return body;
}
