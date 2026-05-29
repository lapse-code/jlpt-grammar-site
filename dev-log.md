# dev-log.md

这个文件是项目开发日志，用来记录已经完成的实际工作，方便后续维护者和 AI Agent 接手。

## 维护规则

- 每次完成任务后添加一条新记录。
- 只记录实际发生过的事情。
- 如果没有运行测试或构建，必须写明“未运行”并说明原因。
- 如果没有检查部署，也要明确写出来。
- 不要写入本地绝对路径、邮箱、账号、token、密码、密钥或其他隐私信息。
- 日志应简洁，方便下一个维护者快速理解项目状态。

## 2026-05-29 - 同步接口分类笔记并更新维护文档

任务：

同步用户刚修改过的 JLPT 笔记内容，发布到 GitHub Pages，并更新三份长期维护文档。

修改文件：

- `content/` 下 50 个已跟踪 Markdown 文件。
- `AGENTS.md`
- `module-map.md`
- `dev-log.md`

主要变更：

- 从 Obsidian 源笔记重新同步公开内容。
- 本次同步纳入 495 篇笔记，缺失 0 项，可疑隐私 0 项。
- 主要内容变化集中在接口分类相关笔记和若干语法点笔记。
- 补充维护规则：如果本地源路径配置缺失，应询问用户，不要猜测路径或把本机路径写进仓库。
- 继续保持三份维护文档为中文，方便用户直接阅读。

实现说明：

- 同步脚本只把源路径写入本地忽略文件和本地报告，不写入公开内容。
- `content/index.md` 本次没有出现内容差异。
- 用户已确认三份维护文档内容可以接受，本次将作为仓库维护文档提交；如果以后决定只把 `dev-log.md` 保留在本地，再加入 `.gitignore`。

运行过的命令：

- `git status --short --branch`
- `npm run sync-jlpt-content`
- `npx quartz build`
- `git diff --stat`
- `git diff --name-only`
- `git diff --shortstat -- content`
- `git add content`
- `git commit -m "Update JLPT grammar notes"`
- `git push origin v5`
- `gh run list --limit 3`
- `gh run watch 26614964725 --exit-status`

验证：

- `npm run sync-jlpt-content` 成功，输出 `includedCount: 495`、`missingCount: 0`、`suspiciousCount: 0`。
- `npx quartz build` 成功，处理 496 个 Markdown 文件，输出 1050 个文件到 `public/`。
- 本地构建仍出现 Quartz 插件的 direct eval 打包警告，但未阻断构建。
- 内容提交为 `3d7fc44 Update JLPT grammar notes`。
- GitHub Actions run `26614964725` 成功：build 2m43s，deploy 8s。
- GitHub Actions 仍提示部分官方 action 使用 Node.js 20，当前不影响部署成功。

未完成事项：

- 无。

已知风险：

- Node.js 20 action 弃用提示仍存在；如果未来 GitHub Actions 因此失败，需要更新 workflow 中的 action 版本或按 GitHub 建议设置 Node 24 相关环境变量。

后续建议：

- 本次文档更新提交后，再验证一次公开网站首页和搜索索引。

## 2026-05-29 - 新增长期维护文档

任务：

为仓库新增长期维护文档，方便之后持续使用 AI 辅助维护。

修改文件：

- `AGENTS.md`
- `module-map.md`
- `dev-log.md`

主要变更：

- 新增 AI Agent 项目规则，覆盖内容来源、同步流程、本地私有文件、常用命令、部署、修改规则和任务汇报要求。
- 新增模块地图，说明 Quartz 项目结构、生成内容、同步脚本、部署流程、缓存目录和常见修改入口。
- 新增开发日志，并根据当前仓库状态补充可恢复的历史背景。

实现说明：

- 文档刻意不记录本地 Obsidian 源笔记库的真实路径。
- 文档明确 Obsidian 源笔记库是内容源头，`content/` 是生成出来的网站内容。

运行过的命令：

- `git status --short --branch`
- `rg --files`
- `git log --oneline -5`
- `ls -la`
- 使用 `sed` 读取 `package.json`、`README.md`、`scripts/sync-jlpt-content.mjs`、`quartz.config.yaml`、`.github/workflows/deploy.yml`、`.gitignore`
- `git diff --check`
- `git status --short`
- 对 `AGENTS.md`、`module-map.md`、`dev-log.md` 做隐私关键词扫描

验证：

- `git diff --check` 未发现已跟踪文件的空白问题。
- 新文档写入后已重新读取检查。
- 隐私扫描没有发现本地绝对路径、Google Drive 路径或邮箱。
- 未运行 `npx quartz build`，因为这次只新增仓库根目录维护文档，不影响生成网站内容。

未完成事项：

- 没有进行笔记内容同步。
- 没有提交到 GitHub。
- 没有部署网站。

已知风险：

- 仓库仍包含 Quartz 上游自带的 `docs/` 文档目录；`module-map.md` 已说明它不是 JLPT 学习内容。

后续建议：

- 如果决定不把 `dev-log.md` 上传 GitHub，可以把它加入 `.gitignore`，并把详细维护记录放在本地或 Obsidian 项目备忘录里。
- 如果维护流程变化，需要同步更新 `AGENTS.md` 和 `module-map.md`。

## 根据当前仓库状态恢复的历史背景

下面内容来自当前仓库可见提交和项目状态，不等同于完整原始任务记录。

### 2026-05-27 - 初始干净版本 JLPT 文法网站

提交：

- `2a818aa Initial clean JLPT grammar site`

已知结果：

- 创建了基于 Quartz 的公开 JLPT 文法网站仓库。
- 配置了基于 `v5` 分支的 GitHub Pages 部署流程。
- 建立了本地同步脚本模式，避免把私有源路径写入公开仓库。

验证：

- 本日志没有重新验证该历史提交。

### 2026-05-27 - 添加网站免责声明

提交：

- `deb7db0 Add site disclaimer`

已知结果：

- 添加了公开免责声明，说明这是个人学习笔记，并且部分内容使用 AI 辅助结构化整理。
- 说明正式学习和备考应以权威教材、词典和官方资料为准。

验证：

- 本日志没有重新验证该历史提交。

### 2026-05-28 - 同步 JLPT 文法笔记

提交：

- `16dd4a4 Update JLPT grammar notes`

已知结果：

- 从 Obsidian 源笔记同步过一次较大的内容更新到 `content/`。
- 当时 GitHub Actions 部署成功。

验证：

- 本日志没有重新验证该历史提交。

### 2026-05-28 - 再次同步 JLPT 文法笔记

提交：

- `66bd059 Update JLPT grammar notes`

已知结果：

- 再次从 Obsidian 源笔记同步了较大范围的内容更新。
- 当时公开网站和搜索索引已经验证。

验证：

- 本日志没有重新验证该历史提交。
