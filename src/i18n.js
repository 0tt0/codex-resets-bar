// 语言与文案字典。
// 语言跟随宿主（Metrix.Bar）显示语言：Worker 创建时捕获的 navigator.language 快照（BCP 47）。
// zh* → 中文，其余 → 英文；无 languagechange 事件，切换系统/宿主语言后需重载看板才生效。

export const LANG = String(navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en";

// 站点链接按语言区分：中文走 /zh-CN，英文走主站
export const SITE = LANG === "zh" ? "https://codex-resets.com/zh-CN" : "https://codex-resets.com";

// 键名用简体中文语义命名；带参数的条目是函数。t(key, ...args) 取词。
// fmtDays 来自 time.js（仅函数体内取值，与 time.js 引用 LANG 构成安全循环依赖）。
import { fmtDays } from "./time.js";

const I18N = {
  zh: {
    "副标题": "帮你盯着 Codex 重置",
    "刷新按钮": "刷新",
    "分享按钮": "截图",
    "未加载": "尚未获取",
    "更新时间": ts => ts + " 更新",
    "请求失败后缀": " · 上次失败",
    "本地时区": "本地",
    "UTC时区": "UTC",
    "最新重置标题": "上次重置",
    "暂无数据": "暂无数据",
    "等待数据": "等待数据",
    "徽章备用": "备用额度",
    "徽章常规": "常规重置",
    "待定重置": "待定",
    "值守中": "值守",
    "值守标题": "值守",
    "值守说明": "预测，非官方",
    "统计次数": "重置次数",
    "统计次数值": n => String(n),
    "统计间隔": "平均间隔",
    "统计间隔值": v => fmtDays(v) + " 天",
    "统计近期": "近 30 天",
    "统计近期值": n => String(n),
    "日历标题": "重置日历",
    "图例常规": "橙 = 常规",
    "图例备用": "蜜桃 = 备用",
    "日历格提示": (key, type) => key + (type ? " · " + (type === "banked" ? "备用" : "常规") + "重置" : " 无重置"),
    "公告标题": "公告",
    "公告计数": (shown, total) => shown + " / " + total,
    "查看全部": "查看全部 →",
    "公告点击提示": " · 点击在 X 上查看",
    "重试": "重试",
    "页脚": "数据来自 codex-resets.com · 与 OpenAI 无关联",
    "加载失败": "加载失败",
    "加载中": "正在获取数据…",
    "网络错误": status => "请求失败：HTTP " + status,
    "格式错误": "响应无效。",
    "通知标题": "Codex 额度已重置",
    "通知兜底": "点击查看公告",
    "截图不支持": "请升级 Metrix.Bar",
    "截图成功": "已复制截图",
    "截图失败": msg => "截图失败：" + msg,
    "托盘最近重置": "最近重置 ",
    "菜单打开官网": "打开 codex-resets.com",
  },
  en: {
    "副标题": "Watching Codex resets",
    "刷新按钮": "Refresh",
    "分享按钮": "Screenshot",
    "未加载": "Not loaded",
    "更新时间": ts => "Updated " + ts,
    "请求失败后缀": " · last failed",
    "本地时区": "Local",
    "UTC时区": "UTC",
    "最新重置标题": "Last reset",
    "暂无数据": "No data yet",
    "等待数据": "Waiting for data",
    "徽章备用": "Banked",
    "徽章常规": "Regular",
    "待定重置": "Scheduled",
    "值守中": "Watching",
    "值守标题": "Watchlist",
    "值守说明": "Prediction, not official",
    "统计次数": "Resets",
    "统计次数值": n => String(n),
    "统计间隔": "Avg. interval",
    "统计间隔值": v => fmtDays(v) + " d",
    "统计近期": "Last 30 days",
    "统计近期值": n => String(n),
    "日历标题": "Reset calendar",
    "图例常规": "Orange = regular",
    "图例备用": "Peach = banked",
    "日历格提示": (key, type) => key + (type ? " · " + (type === "banked" ? "banked" : "regular") + " reset" : " · no reset"),
    "公告标题": "Announcements",
    "公告计数": (shown, total) => shown + " / " + total,
    "查看全部": "View all →",
    "公告点击提示": " · click to open on X",
    "重试": "Retry",
    "页脚": "Data from codex-resets.com · not affiliated with OpenAI",
    "加载失败": "Failed to load",
    "加载中": "Fetching data…",
    "网络错误": status => "Request failed: HTTP " + status,
    "格式错误": "Invalid response.",
    "通知标题": "Codex quota reset",
    "通知兜底": "Click to open the announcement",
    "截图不支持": "Update Metrix.Bar to screenshot",
    "截图成功": "Screenshot copied",
    "截图失败": msg => "Screenshot failed: " + msg,
    "托盘最近重置": "last reset ",
    "菜单打开官网": "Open codex-resets.com",
  },
};

export const t = (key, ...args) => {
  const v = (I18N[LANG] || {})[key];
  return v === undefined ? key : (typeof v === "function" ? v(...args) : v);
};
