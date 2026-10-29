#!/usr/bin/env node
// 디자인 토큰 하드코딩 검사기.
//
//   (인자 없음)   Claude Code PreToolUse hook. Write/Edit/MultiEdit 결과 파일의 위반 수가
//                 지금 파일보다 늘어나면 exit 2로 쓰기를 막고, 대체 토큰을 stderr로 알려준다.
//                 기존 위반은 그대로 두고 "새로 늘리는 것"만 막는다.
//   --scan        src 전체 위반을 파일별로 집계한다.
//   --check       규칙별 건수가 baseline보다 하나라도 크면 exit 1 (PR 전 확인용).
//   --baseline    현재 건수를 baseline으로 저장한다. 줄이는 방향으로만 갱신할 것.
//                 (규칙을 새로 추가할 때만 예외적으로 늘어난다.)

import fs from "node:fs";
import path from "node:path";

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const TOKENS_DIR = path.join(ROOT, "src/tokens");
const BASELINE = path.join(ROOT, ".claude/hooks/hardcode-baseline.json");

// 토큰 클래스 검사에 쓰는 prefix별 정보.
//   ns: 이 prefix 뒤에 올 수 있는 토큰 네임스페이스 (--<ns>-<값>)
//   ok: 토큰이 아니어도 되는 Tailwind 키워드 (색·크기가 아닌 것)
const CLASS_PREFIXES = {
  bg: { ns: ["color"], ok: /^(transparent|current|inherit|none|fixed|local|scroll|cover|contain|auto|center|top|bottom|left|right|repeat|no-repeat|repeat-x|repeat-y|clip-\w+|origin-\w+|blend-[\w-]+|linear-[\w-]+|radial|conic)$/ },
  text: { ns: ["color", "text"], ok: /^(transparent|current|inherit|left|right|center|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)$/ },
  border: { ns: ["color"], ok: /^(\d+|transparent|current|solid|dashed|dotted|double|hidden|none|collapse|separate|spacing-[\w-]+)$/ },
  fill: { ns: ["color"], ok: /^(none|current|transparent)$/ },
  stroke: { ns: ["color"], ok: /^(\d+|none|current|transparent)$/ },
  ring: { ns: ["color"], ok: /^(\d+|inset|transparent|current|offset-\d+)$/ },
  outline: { ns: ["color"], ok: /^(\d+|none|hidden|solid|dashed|dotted|double|offset-\d+)$/ },
  divide: { ns: ["color"], ok: /^(x|y|\d+|x-\d+|y-\d+|x-reverse|y-reverse|solid|dashed|dotted|double|none)$/ },
  rounded: { ns: ["radius"], ok: /^(none|full)$/ },
  shadow: { ns: ["shadow"], ok: /^(none|inner)$/ },
  leading: { ns: ["leading"], ok: /^(none)$/ },
};
const SIDE = /^(t|b|l|r|x|y|s|e|tl|tr|bl|br|ss|se|es|ee)-/;

// Tailwind 기본값 → 같은 값의 토큰 후보 (힌트용. 토큰이 실제로 정의돼 있을 때만 보여준다)
const DEFAULT_TO_TOKEN = {
  white: "color-gray-white", black: "color-gray-black",
  "text-xs": "text-body-s", "text-sm": "text-body-m", "text-base": "text-body-l", "text-xl": "text-title-m", "text-2xl": "text-title-xl",
  "radius-sm": "radius-4", "radius-lg": "radius-8", "radius-xl": "radius-12", "radius-2xl": "radius-16",
};

const RULES = [
  { id: "hex", label: "hex 컬러", re: /(?<=["'`\s:([])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g },
  { id: "px", label: "임의 px 값", re: /-\[-?(\d+(?:\.\d+)?)px\]/g },
  { id: "style", label: "inline style 리터럴", re: /style=\{\{/g },
  {
    // bg-white, text-sm, rounded-xl, shadow-md처럼 src/tokens에 없는 Tailwind 기본 색·타이포·radius·shadow
    id: "class",
    label: "토큰이 아닌 Tailwind 클래스",
    re: /(?<=[\s"'`{(])(?:[a-z0-9-]+:)*!?-?(bg|text|border|fill|stroke|ring|outline|divide|rounded|shadow|leading)-([a-z0-9-]+(?:\/\d+)?)(?=[\s"'`})])/g,
    test: (m, defined) => {
      const prefix = m[1];
      let val = m[2].replace(/\/\d+$/, "");
      if ((prefix === "border" || prefix === "rounded") && SIDE.test(val)) val = val.replace(SIDE, "");
      if (prefix === "border" && /^(t|b|l|r|x|y|s|e)$/.test(val)) return false;
      const { ns, ok } = CLASS_PREFIXES[prefix];
      if (ok.test(val)) return false;
      const cls = m[0].replace(/^(?:[a-z0-9-]+:)*!?-?/, "").replace(/\/\d+$/, "");
      if (defined.has(`class:${cls}`)) return false;
      return !ns.some((n) => defined.has(`${n}-${val}`));
    },
  },
  {
    // SVG 색 속성. none/currentColor/url(#)/정의된 var(--토큰)만 허용. hex 값은 hex 규칙이 센다.
    id: "svg",
    label: "SVG 색 리터럴",
    re: /\b(?:fill|stroke|stopColor|floodColor)="([^"#][^"]*)"/g,
    test: (m, defined) => {
      const v = m[1];
      if (/^(none|currentColor|transparent|inherit)$/.test(v) || v.startsWith("url(#")) return false;
      const ref = v.match(/^var\(--([\w-]+)\)$/);
      return !(ref && defined.has(ref[1]));
    },
  },
];

// src/tokens/*.css에 정의된 변수 이름(--color-gray-white → "color-gray-white")과 유틸리티 클래스("class:bg-gradient")
let definedCache;
function loadDefined() {
  if (definedCache) return definedCache;
  definedCache = new Set();
  if (!fs.existsSync(TOKENS_DIR)) return definedCache;
  for (const f of fs.readdirSync(TOKENS_DIR).filter((f) => f.endsWith(".css"))) {
    const css = fs.readFileSync(path.join(TOKENS_DIR, f), "utf8");
    for (const [, name] of css.matchAll(/--([\w-]+)\s*:/g)) definedCache.add(name);
    for (const [, name] of css.matchAll(/^\s*\.([\w-]+)\s*[{,]/gm)) definedCache.add(`class:${name}`);
    for (const [, name] of css.matchAll(/@utility\s+([\w-]+)/g)) definedCache.add(`class:${name}`);
  }
  return definedCache;
}

function isTarget(file) {
  const rel = path.relative(ROOT, path.resolve(ROOT, file)).split(path.sep).join("/");
  return (
    rel.startsWith("src/") &&
    !rel.startsWith("src/tokens/") &&
    /\.(tsx|ts)$/.test(rel) &&
    !/\.stories\.tsx$/.test(rel)
  );
}

function findViolations(text) {
  const found = [];
  const defined = loadDefined();
  for (const rule of RULES) {
    for (const m of text.matchAll(rule.re)) {
      if (rule.test && !rule.test(m, defined)) continue;
      found.push({ rule, match: m[0], px: m[1] });
    }
  }
  return found;
}

// src/tokens/*.css에서 "값 → 토큰 이름" 표를 만든다.
function loadTokens() {
  const byValue = new Map();
  if (!fs.existsSync(TOKENS_DIR)) return byValue;
  for (const f of fs.readdirSync(TOKENS_DIR).filter((f) => f.endsWith(".css"))) {
    const css = fs.readFileSync(path.join(TOKENS_DIR, f), "utf8");
    for (const [, name, value] of css.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
      const key = value.trim().toLowerCase();
      if (!byValue.has(key)) byValue.set(key, []);
      byValue.get(key).push(name);
    }
  }
  return byValue;
}

// 토큰 이름 → Tailwind 클래스 힌트
function tokenToClass(name) {
  const m = name.match(/^--(color|spacing|radius|text)-(.+)$/);
  if (!m) return `var(${name})`;
  const [, kind, rest] = m;
  if (kind === "color") return `bg-${rest} / text-${rest} / border-${rest}`;
  if (kind === "spacing") return `p-${rest} / gap-${rest}`;
  if (kind === "radius") return `rounded-${rest}`;
  return `text-${rest}`;
}

function suggest(v, tokens) {
  if (v.rule.id === "hex") {
    const names = tokens.get(v.match.toLowerCase()) || [];
    return names.length
      ? names.map(tokenToClass).join(" | ")
      : "일치하는 토큰 없음 → token-guardian에게 토큰 추가 요청";
  }
  if (v.rule.id === "px") {
    const names = (tokens.get(`${v.px}px`) || []).filter((n) => !n.endsWith("--line-height"));
    const hints = names.map(tokenToClass);
    if (Number(v.px) % 4 === 0) hints.push(`Tailwind 기본 스케일 ${Number(v.px) / 4} (예: p-${Number(v.px) / 4})`);
    return hints.length ? hints.join(" | ") : "일치하는 토큰 없음 → 가까운 토큰을 쓰거나 token-guardian에게 요청";
  }
  if (v.rule.id === "class") {
    // [variant:][prefix]-[side-][value][/opacity] 로 나눠서 value만 토큰 이름으로 바꾼다
    const [, head, prefix, side = "", val, opacity = ""] = v.match.match(
      /^(.*?)(bg|text|border|fill|stroke|ring|outline|divide|rounded|shadow|leading)-((?:t|b|l|r|x|y|s|e|tl|tr|bl|br)-)?(.+?)(\/\d+)?$/,
    );
    const key = prefix === "rounded" ? `radius-${val}` : DEFAULT_TO_TOKEN[val] ? val : `${prefix}-${val}`;
    const token = DEFAULT_TO_TOKEN[key];
    if (token && loadDefined().has(token)) {
      return `${head}${prefix}-${side}${token.replace(/^(color|radius|text)-/, "")}${opacity} (같은 값의 토큰)`;
    }
    return "src/tokens에 없는 값 → 토큰 클래스로 바꾸거나 token-guardian에게 토큰 추가 요청";
  }
  if (v.rule.id === "svg") return 'fill/stroke="var(--color-…)" 토큰 또는 "currentColor"';
  return "Tailwind 클래스로 표현. 동적 값만 예외 (예: style={{ width: `${pct}%` }})";
}

// Edit/Write/MultiEdit 적용 후의 파일 내용을 계산한다.
function applyTool(tool, input, before) {
  if (tool === "Write") return input.content ?? "";
  const edits = tool === "MultiEdit" ? input.edits || [] : [input];
  let text = before;
  for (const e of edits) {
    if (e.old_string == null) continue;
    text = e.replace_all
      ? text.split(e.old_string).join(e.new_string ?? "")
      : text.replace(e.old_string, () => e.new_string ?? "");
  }
  return text;
}

function runHook() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    return 0;
  }
  const input = payload.tool_input || {};
  const file = input.file_path;
  if (!file || !isTarget(file)) return 0;

  const before = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const after = applyTool(payload.tool_name, input, before);
  const prev = findViolations(before);
  const next = findViolations(after);
  if (next.length <= prev.length) return 0;

  // 새로 생긴 위반만 골라 보여준다 (매치 문자열 기준 다중집합 차이).
  const remaining = new Map();
  for (const v of prev) remaining.set(v.match, (remaining.get(v.match) || 0) + 1);
  const added = next.filter((v) => {
    const n = remaining.get(v.match) || 0;
    if (n > 0) {
      remaining.set(v.match, n - 1);
      return false;
    }
    return true;
  });

  const tokens = loadTokens();
  const lines = added.map((v) => `  - ${v.rule.label} \`${v.match}\` → ${suggest(v, tokens)}`);
  process.stderr.write(
    [
      `[check-hardcode] ${path.relative(ROOT, file)}: 하드코딩이 ${prev.length} → ${next.length}건으로 늘어나 쓰기를 막았습니다.`,
      ...lines,
      "토큰으로 바꿔서 다시 시도하세요. 맞는 토큰이 없으면 token-guardian에게 넘기세요. hook을 우회하지 마세요.",
    ].join("\n") + "\n",
  );
  return 2;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (isTarget(p)) out.push(p);
  }
  return out;
}

function scan() {
  const rows = [];
  for (const f of walk(path.join(ROOT, "src"))) {
    const vs = findViolations(fs.readFileSync(f, "utf8"));
    if (!vs.length) continue;
    const by = Object.fromEntries(RULES.map((r) => [r.id, vs.filter((v) => v.rule.id === r.id).length]));
    rows.push({ file: path.relative(ROOT, f), total: vs.length, ...by });
  }
  rows.sort((a, b) => b.total - a.total);
  const total = rows.reduce((s, r) => s + r.total, 0);
  const byRule = Object.fromEntries(RULES.map((r) => [r.id, rows.reduce((s, x) => s + x[r.id], 0)]));
  return { total, byRule, rows };
}

const arg = process.argv[2];
if (!arg) {
  process.exit(runHook());
} else if (arg === "--scan") {
  const { total, byRule, rows } = scan();
  const detail = (o) => RULES.map((r) => `${r.id} ${o[r.id]}`).join(", ");
  for (const r of rows) console.log(`${String(r.total).padStart(4)}  ${r.file}  (${detail(r)})`);
  console.log(`\n총 ${total}건 (${detail(byRule)})`);
} else if (arg === "--check") {
  const { total, byRule } = scan();
  const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, "utf8")) : {};
  console.log(`하드코딩 ${total}건 / baseline ${base.total ?? 0}건`);
  // 규칙별로 비교한다. 한 규칙을 줄인 만큼 다른 규칙이 늘어나는 것도 막는다.
  const over = RULES.filter((r) => byRule[r.id] > (base[r.id] ?? 0));
  if (over.length) {
    for (const r of over) console.error(`  ${r.label}(${r.id}): ${byRule[r.id]}건 / baseline ${base[r.id] ?? 0}건`);
    console.error("baseline보다 늘었습니다. --scan으로 위치를 확인하세요.");
    process.exit(1);
  }
} else if (arg === "--baseline") {
  const { total, byRule } = scan();
  fs.writeFileSync(BASELINE, JSON.stringify({ total, ...byRule }, null, 2) + "\n");
  console.log(`baseline 저장: ${total}건`);
} else {
  console.error(`알 수 없는 인자: ${arg}`);
  process.exit(1);
}
