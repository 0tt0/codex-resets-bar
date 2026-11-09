# Codex Resets Bar

Codex 额度什么时候重置，你不用再盯着官网刷新。

一个常驻菜单栏的 [Metrix.Bar](https://metrix.bar) 看板，盯着 OpenAI Codex 的重置公告，一有动静就告诉你。[English](README.md)

## 安装

点开对应构建，再打开下载好的文件即可 —— Metrix.Bar 直接导入 `.bar`。

- **中文** — [`codex-resets.bar`](https://cdn.jsdmirror.com/gh/0tt0/codex-resets-bar@v0.1.4/codex-resets.bar)
- **English** — [`codex-resets-en.bar`](https://cdn.jsdelivr.net/gh/0tt0/codex-resets-bar@v0.1.4/codex-resets-en.bar)

也可以把下面这行粘到浏览器地址栏，直接从 CDN 导入：

```text
metrixbar://install?url=https%3A%2F%2Fcdn.jsdmirror.com%2Fgh%2F0tt0%2Fcodex-resets-bar%40v0.1.4%2Fcodex-resets.bar&sha256=88d682087b4eb91be78798b564e6abd4e94fb69bbaa1a20d7b1358f5942766dd
```

GitHub 渲染 Markdown 时会剥离自定义协议，所以这里以可复制文本给出。中文构建的 Vue 走 JSDMirror 镜像，英文构建走 jsDelivr；想装英文版就把域名换成 `cdn.jsdelivr.net`、文件名换成 `codex-resets-en.bar`。

## 它能帮你做什么

- **一眼知道上次重置过去多久**，可切本地时间或 UTC。
- **分清常规重置与备用额度**，标签不同。
- **近四个月日历**，看到节奏而不只是最新一次。
- **顺手掌握进度**：近 30 天次数、平均间隔、距上次天数。
- **新公告才发通知**，刚装完不会蹦出过期的。
- **点一下把面板截图复制到剪贴板**。

![Codex Resets 面板：最近一次重置、统计、四个月日历与公告流](screenshot.webp)

## 补充说明

每 2 分钟刷新一次；请求失败会保留上一次的数据并给出重试，不会变成空面板。请求直连 `codex-resets.com`，本机需要能访问该域名。提醒默认开启，可在看板设置里关闭。

## 来源与许可

数据来自 [codex-resets.com](https://codex-resets.com) 的公开 API，与本项目无隶属关系，也不代表 OpenAI。

[Apache-2.0](LICENSE)。Vue 运行时在启动时从 CDN 加载，仍适用其 MIT 协议。「OpenAI」「Codex」为 OpenAI 商标，仅用于标识所监控的服务。
