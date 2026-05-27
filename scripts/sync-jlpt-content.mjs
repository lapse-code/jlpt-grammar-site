import fs from "node:fs";
import path from "node:path";

const localSourceRootFile = path.resolve("scripts", "local-source-root.txt");
const sourceRoot =
  process.env.JLPT_SOURCE_ROOT?.trim() ||
  (fs.existsSync(localSourceRootFile) ? fs.readFileSync(localSourceRootFile, "utf8").trim() : "");
const contentRoot = path.resolve("content");
const reportPath = path.resolve("scripts", "jlpt-content-report.json");

if (!sourceRoot) {
  console.error("Missing source path. Set JLPT_SOURCE_ROOT or create scripts/local-source-root.txt.");
  process.exit(1);
}

const rootTitles = [
  "N2・N3 文法点整合索引",
  "N2文法7项接口分类",
  "日语文法接续入口判断",
  "日语动词活用总表",
  "文法整理",
];

const excludedTitles = new Set([
  "JLPT-N2-7月冲刺计划",
]);

function fileForTitle(title) {
  return path.join(sourceRoot, title + ".md");
}

function cleanLinkTarget(raw) {
  let target = raw.trim();
  if (!target || target.startsWith("http://") || target.startsWith("https://")) return "";
  target = target.split("|")[0].trim();
  target = target.split("#")[0].trim();
  if (target.endsWith(".md")) target = target.slice(0, -3);
  return target;
}

function extractWikiLinks(markdown) {
  const targets = [];
  const pattern = /\[\[([^\]\n]+)\]\]/g;
  let match;
  while ((match = pattern.exec(markdown)) !== null) {
    const target = cleanLinkTarget(match[1]);
    if (target) targets.push(target);
  }
  return targets;
}

function collectPublicNotes() {
  const included = new Map();
  const missing = new Set();
  const excluded = new Set();
  const queue = [...rootTitles];

  while (queue.length > 0) {
    const title = queue.shift();
    if (!title || included.has(title)) continue;
    if (excludedTitles.has(title)) {
      excluded.add(title);
      continue;
    }

    const sourceFile = fileForTitle(title);
    if (!fs.existsSync(sourceFile)) {
      missing.add(title);
      continue;
    }

    included.set(title, sourceFile);
    const markdown = fs.readFileSync(sourceFile, "utf8");
    for (const linkedTitle of extractWikiLinks(markdown)) {
      if (!included.has(linkedTitle) && !excludedTitles.has(linkedTitle)) {
        queue.push(linkedTitle);
      } else if (excludedTitles.has(linkedTitle)) {
        excluded.add(linkedTitle);
      }
    }
  }

  return { included, missing: [...missing].sort(), excluded: [...excluded].sort() };
}

function resetContentDirectory() {
  fs.rmSync(contentRoot, { recursive: true, force: true });
  fs.mkdirSync(contentRoot, { recursive: true });
}

function writeHomepage() {
  const homepage = [
    "---",
    "title: JLPT N2/N3 文法笔记库",
    "---",
    "",
    "# JLPT N2/N3 文法笔记库",
    "",
    "这是一个按照接续接口整理的 JLPT N2/N3 文法笔记库。",
    "",
    "## 推荐入口",
    "",
    "- [[N2・N3 文法点整合索引]]",
    "- [[N2文法7项接口分类]]",
    "- [[日语文法接续入口判断]]",
    "- [[日语动词活用总表]]",
    "",
    "## 使用建议",
    "",
    "如果你想按考试语法点顺序学习，先看 [[N2・N3 文法点整合索引]]。",
    "",
    "如果你想按接续方式理解语法结构，先看 [[N2文法7项接口分类]]。",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(contentRoot, "index.md"), homepage, "utf8");
}

function copyNotes(included) {
  for (const [title, sourceFile] of [...included.entries()].sort((a, b) => a[0].localeCompare(b[0], "ja"))) {
    fs.copyFileSync(sourceFile, path.join(contentRoot, title + ".md"));
  }
}

function scanCopiedContent() {
  const suspicious = [];
  const contentPatterns = [
    { name: "local-path", pattern: /\/Users\/chen|GoogleDrive-[^\s/]+|我的云端硬盘|obsidian-zettelkasten/ },
    { name: "email", pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i },
    { name: "credential-assignment", pattern: /(?:password|token|secret|api[_-]?key)\s*[:=]/i },
  ];
  const filenamePattern = /草稿|临时|private|draft|tmp|temp/i;

  for (const file of fs.readdirSync(contentRoot).filter((name) => name.endsWith(".md"))) {
    if (filenamePattern.test(file)) {
      suspicious.push({ file, line: 0, type: "filename-review", text: file });
    }

    const fullPath = path.join(contentRoot, file);
    const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const { name, pattern } of contentPatterns) {
        if (pattern.test(line)) {
          suspicious.push({ file, line: index + 1, type: name, text: line.slice(0, 180) });
        }
      }
    });
  }

  return suspicious;
}

const result = collectPublicNotes();
resetContentDirectory();
writeHomepage();
copyNotes(result.included);
const suspicious = scanCopiedContent();

const report = {
  generatedAt: new Date().toISOString(),
  sourceRoot: "[local path omitted]",
  contentRoot: path.relative(process.cwd(), contentRoot) || ".",
  rootTitles,
  includedCount: result.included.size,
  includedTitles: [...result.included.keys()].sort((a, b) => a.localeCompare(b, "ja")),
  missing: result.missing,
  excluded: result.excluded,
  suspicious,
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify({
  includedCount: report.includedCount,
  missingCount: report.missing.length,
  suspiciousCount: report.suspicious.length,
  reportPath: path.relative(process.cwd(), reportPath),
}, null, 2));
