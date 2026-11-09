# Codex Resets Bar

一个单文件的 [Metrix.Bar](https://metrix.bar) 看板，追踪 OpenAI Codex 额度重置公告，并在新公告出现时提醒你。

[English](README.md)

## 它做什么

OpenAI 会不定期重置 Codex 的用量额度，有时是常规重置，有时是额外的「备用额度」。这个看板订阅 [codex-resets.com](https://codex-resets.com) 的公开 API，把重置历史渲染成菜单栏下拉面板，并在新公告出现的第一时间提醒你。

它是一个 `.bar` 文件：一份文本产物，内含元信息、内联的 Vue 3 运行时和看板逻辑。不需要编译，也没有任何依赖要装。

## 安装

两条一键路径，都不经过注册表：

**下载后打开** —— 点击 [`codex-resets.bar`](https://cdn.jsdelivr.net/gh/0tt0/codex-resets-bar@v0.1.0/codex-resets.bar)，然后打开下载好的文件。Metrix.Bar 已注册 `.bar` 文件类型，打开即进入导入确认。

**直连导入链接** —— 把下面这行粘贴到浏览器地址栏：

```text
metrixbar://install?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2F0tt0%2Fcodex-resets-bar%40v0.1.0%2Fcodex-resets.bar&sha256=4a52068dc8b281ae7d60df3d32c0e071807f6a975fb5e6112464d86ce82ab3de
```

GitHub 渲染 Markdown 时会剥离自定义协议，所以这里以可复制的文本给出，而不是可点击的链接；在不做协议过滤的渲染器里，这串地址本身就是普通链接。

两种方式都由 Metrix.Bar 校验 HTTPS 来源、展示看板申请的权限，确认后才安装。本地安装保留原始看板 ID，把下载地址记为来源，不会挂到任何注册表，因此也不会被注册表静默更新。

装好后表现一致：看板声明了 `placements="menubar"` 与 `open-mode="flyout"`，会出现在菜单栏，点击展开为 380×600 的面板。文件遵循 `.bar` 协议版本 0。

## 面板构成

| 区块 | 内容 |
|---|---|
| 主卡 | 距上次重置的时间，以大号相对时间显示，并附绝对时间。分段控件可在本地时间与 UTC 之间切换。类型徽章区分「常规重置」与「备用额度」。 |
| 值守卡 | 仅当存在待定重置（`scheduled_reset`）或值守预测（`active_watch`）时渲染。 |
| 统计瓦片 | 近 30 天重置次数、平均重置间隔、距上次重置天数。 |
| 日历热力图 | 近 4 个月，按月分组。橙色为常规重置，蜜桃色为备用额度。 |
| 公告流 | 最近 3 条公告，点击卡片直达原帖，页脚可跳转完整归档。 |
| 页脚 | 数据来源与署名。 |

面板头部另有刷新按钮和分享按钮。分享会把面板截图并复制到剪贴板。

## 行为说明

- **刷新**：运行期间每 2 分钟拉取一次。
- **提醒**：首次加载只记录最新公告 id，因此安装看板本身不会产生一条过期提醒；此后 id 变化才触发系统通知与 toast。
- **失败处理**：请求失败时保留上一次成功加载的数据，并显示带重试按钮的错误横幅——不会因为一次网络抖动就把面板清空。
- **网络**：看板直接请求 `https://codex-resets.com/api/v1`，本机需能访问该域名。

## 配置

所有配置都在文件开头的 `<bar>` 属性里：标题、版本、分类、刷新间隔、摆放位置等。提醒默认开启；若宿主传入 `inputs.notifyEnabled = false` 则关闭。该输入项目前没有暴露成面板里的设置开关。

## 数据来源

使用两个公开接口：

- `GET https://codex-resets.com/api/v1/status` — 最新一次重置、可能存在的待定重置与值守预测，以及聚合统计。
- `GET https://codex-resets.com/api/v1/resets?limit=100` — 近期重置历史。

字段读取做了防御处理：某个字段缺失或格式异常时，只会降级对应的卡片，不会让整个面板崩掉。

本项目与 **OpenAI、codex-resets.com 均无隶属关系**，仅读取后者的公开 API 并回链到其页面。

## 开发

```
codex-resets.bar     看板本体（元信息 + 内联 Vue 3 运行时 + 业务逻辑）
README.md            英文说明
README.zh-CN.md      本文件
LICENSE              Apache License 2.0
```

修改流程：

1. 用编辑器打开 `codex-resets.bar`。元信息在开头的 `<bar>` 标签里；业务逻辑在文件末尾内联运行时之后手写的那段 `<script>` 中。
2. 改完把 `<bar>` 里的 `version` 递增，再导入 Metrix.Bar。
3. 实际渲染验证：面板是交付物，代码 diff 好看不算完成。需要过一遍浅色/深色、本地/UTC 切换、窗口高度和分享流程。

截图分享有一个不显然的约束：必须等面板 commit 之后 `$metrix.panel` 才可用，且截图前要把滚动容器换成普通列布局，才能把溢出内容渲染进画面。这两点在对应代码处都有注释。

### 发版

安装链接钉在 tag 上，内容不会被悄悄替换。发版时：

1. 递增 `<bar>` 里的 `version` 并提交。
2. 给提交打 tag `v<version>` 并推送。jsDelivr 上的地址即 `https://cdn.jsdelivr.net/gh/0tt0/codex-resets-bar@v<version>/codex-resets.bar`。
3. 重新计算 `shasum -a 256 codex-resets.bar`，把两份 README 里的 `url` 与 `sha256` 同步更新。

用 `@main` 也能装，但它跟随分支，每次提交校验和都会变，每次安装都要重新确认。

## 许可

本仓库中的看板代码采用 [Apache License 2.0](LICENSE) 协议开源。

内联的 Vue 3.5.13 运行时按 MIT 协议分发，仍适用 MIT 协议。

「OpenAI」「Codex」及 Codex 图标归 OpenAI 所有，此处仅用于标识本看板所监控的服务，不代表任何认可或隶属关系。
