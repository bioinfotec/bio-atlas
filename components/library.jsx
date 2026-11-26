"use client";
import Link from "next/link";
import { useState } from "react";
import { Bookmark, Search, BookOpen, Check } from "lucide-react";
import LoadingOverlay from "./loading-overlay";
import { useLearning } from "./shell";
export default function Library({ topics, savedOnly = false }) {
  const { saved, done, toggle, ready } = useLearning(),
    [q, setQ] = useState(""),
    [stage, setStage] = useState(""),
    [limit, setLimit] = useState(24);
  const isLoadingFavorites = savedOnly && !ready;
  const matches = topics.filter(
    (l) =>
      (!savedOnly || saved.includes(l.id)) &&
      (!stage || stage === l.stage) &&
      (l.name + " " + l.term + " " + l.module)
        .toLowerCase()
        .includes(q.trim().toLowerCase()),
  );
  return (
    <main className="wrap subpage">
      <h1>{savedOnly ? "我的收藏" : "知识库"}</h1>
      <p className="muted">
        {savedOnly
          ? "重读收藏的知识点，检验自己的理解。"
          : "按学科与中英文术语查找知识点。"}
      </p>
      <div className="filters">
        <label>
          <Search size={18} />
          <input
            aria-label="筛选知识点"
            placeholder="输入知识点或英文术语"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(24);
            }}
          />
        </label>
        <select
          aria-label="选择学习阶段"
          value={stage}
          onChange={(e) => {
            setStage(e.target.value);
            setLimit(24);
          }}
        >
          <option value="">全部阶段</option>
          {[...new Set(topics.map((l) => l.stage))].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {isLoadingFavorites ? (
        <LoadingOverlay message="正在读取收藏…" />
      ) : (
        <small>共 {matches.length} 个知识点</small>
      )}
      <div className="library-grid">
        {matches.slice(0, limit).map((l) => (
          <article key={l.id}>
            <Link href={"/learn/" + l.id + "/"}>
              <small>
                {l.stage} · {l.module}
              </small>
              <h3>{l.name}</h3>
              <p>{l.term}</p>
              {done.includes(l.id) && (
                <small>
                  <Check size={14} /> 已学
                </small>
              )}
            </Link>
            <button
              aria-label={(saved.includes(l.id) ? "取消收藏" : "收藏") + l.name}
              aria-pressed={saved.includes(l.id)}
              onClick={() => toggle("saved", l.id)}
            >
              <Bookmark
                fill={saved.includes(l.id) ? "currentColor" : "none"}
                size={19}
              />
            </button>
          </article>
        ))}
      </div>
      {!isLoadingFavorites && !matches.length && (
        <div className="empty">
          <BookOpen />
          <h3>
            {savedOnly && !saved.length
              ? "还没有收藏知识点"
              : "没有匹配的知识点"}
          </h3>
          <p>
            {savedOnly && !saved.length
              ? "阅读时点击书签，即可在这里复习。"
              : "试试其他关键词或学习阶段。"}
          </p>
          <Link className="text-btn" href="/library/">
            浏览知识库
          </Link>
        </div>
      )}
      {matches.length > limit && (
        <button className="secondary" onClick={() => setLimit(limit + 24)}>
          加载更多
        </button>
      )}
    </main>
  );
}
