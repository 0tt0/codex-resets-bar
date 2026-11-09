# Codex Resets Bar

A single-file [Metrix.Bar](https://metrix.bar) dashboard that tracks OpenAI Codex quota reset announcements and notifies you when a new reset drops.

[中文说明](README.zh-CN.md)

## What it does

OpenAI occasionally resets Codex usage limits, either as a regular reset or as a banked (promotional) allowance. This dashboard watches the public [codex-resets.com](https://codex-resets.com) API, renders the reset history as a menu bar flyout, and pings you the moment a new announcement appears.

It is a `.bar` file: one text artifact containing metadata, an inline Vue 3 runtime and the dashboard logic. There is nothing to compile and no dependencies to install.

## Install

**[Install with Metrix.Bar →](metrixbar://install?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2F0tt0%2Fcodex-resets-bar%40v0.1.0%2Fcodex-resets.bar&sha256=4a52068dc8b281ae7d60df3d32c0e071807f6a975fb5e6112464d86ce82ab3de)**

One click, no registry needed. The link is a `.bar` direct import:

```text
metrixbar://install?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2F0tt0%2Fcodex-resets-bar%40v0.1.0%2Fcodex-resets.bar&sha256=4a52068dc8b281ae7d60df3d32c0e071807f6a975fb5e6112464d86ce82ab3de
```

Metrix.Bar validates the HTTPS source, shows the dashboard's permissions, and installs it after you confirm. A local install keeps the original dashboard ID, records the download as its provenance, and never joins a registry — so it also never silently receives registry updates.

Alternatively, download `codex-resets.bar` and import it by hand through Metrix.Bar's dashboard import.

Either way the dashboard declares `placements="menubar"` and `open-mode="flyout"`, so it shows up in the menu bar and opens as a 380×600 panel. The file targets `.bar` protocol version 0.

## Panel overview

| Section | Content |
|---|---|
| Hero card | Time since the latest reset, as a large relative label plus an absolute timestamp. A segmented control switches the absolute time between local time and UTC. A type badge distinguishes a regular reset from a banked allowance. |
| Watch card | Only rendered when a scheduled reset or an active watch exists. |
| Stats tiles | Resets in the last 30 days, average interval between resets, and days since the last reset. |
| Calendar heatmap | The last four months, grouped by month. Orange cells are regular resets, peach cells are banked allowances. |
| Announcement feed | The three most recent announcements. Clicking a card opens the original post; the footer links to the full archive. |
| Footer | Data source and attribution. |

The panel header also exposes a reload button and a share button. Sharing screenshots the panel and copies the image to the clipboard.

## Behaviour

- **Refresh**: every 2 minutes while the dashboard is running.
- **Notifications**: the first load only records the latest announcement id, so installing the dashboard never produces a stale notification. On later loads, a changed id triggers a system notification plus a toast.
- **Failures**: a failed request keeps the previously loaded data on screen and shows an error banner with a retry action. An empty panel is never shown because of a transient network error.
- **Network**: the dashboard calls `https://codex-resets.com/api/v1` directly, so that host must be reachable from your machine.

## Configuration

All configuration lives in the `<bar>` attributes at the top of the file: title, version, category, refresh interval, placement and so on. Notifications are on by default. If the host passes `inputs.notifyEnabled = false`, notifications are suppressed; this input is not currently exposed as a settings toggle in the panel.

## Data source

Two public endpoints are consumed:

- `GET https://codex-resets.com/api/v1/status` — latest reset, optional scheduled reset and active watch, plus aggregate stats.
- `GET https://codex-resets.com/api/v1/resets?limit=100` — the recent reset history.

Field access is defensive: a missing or malformed field degrades a single card instead of breaking the panel.

This project is **not affiliated with OpenAI or codex-resets.com**. It only reads that site's public API and links back to its pages.

## Development

```
codex-resets.bar     the dashboard (metadata + inline Vue 3 runtime + logic)
README.md            this file
README.zh-CN.md      Chinese version
LICENSE              Apache License 2.0
```

Editing workflow:

1. Open `codex-resets.bar` in an editor. The metadata is in the opening `<bar>` tag; the dashboard logic is the hand-written `<script>` section near the end of the file, after the bundled runtime.
2. Make the change, bump `version` in the `<bar>` tag, and import the file into Metrix.Bar.
3. Verify visually: the panel is a delivered artifact, so a passing diff is not enough. Resize, dark mode, the local/UTC toggle and the share flow all need to be exercised.

The screenshot-sharing path has one non-obvious constraint: the panel must be committed before `$metrix.panel` is usable, and the scroll container has to be swapped for a plain column so overflowing content renders into the capture. Both are documented inline where the code lives.

### Releasing

The install link pins a tag so its bytes never move. When releasing:

1. Bump `version` in the `<bar>` tag and commit.
2. Tag the commit `v<version>` and push the tag. jsDelivr serves it as `https://cdn.jsdelivr.net/gh/0tt0/codex-resets-bar@v<version>/codex-resets.bar`.
3. Recompute `shasum -a 256 codex-resets.bar` and update the `url` and `sha256` values in both READMEs.

A `@main` link also works, but it follows the branch, so the checksum changes on every commit and every install needs fresh confirmation.

## License

The dashboard code in this repository is licensed under the [Apache License 2.0](LICENSE).

The bundled Vue 3.5.13 runtime is distributed under the MIT License and remains under that license.

"OpenAI", "Codex" and the Codex logo belong to OpenAI. They are used here only to identify the service this dashboard monitors; no endorsement or affiliation is implied.
