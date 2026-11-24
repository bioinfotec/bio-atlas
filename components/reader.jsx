"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bookmark,
  BookOpen,
  Check,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { useLearning } from "./shell";
export default function Reader({ lesson: l, peers, prev, next }) {
  const { saved, done, toggle, visit } = useLearning(),
    [answer, setAnswer] = useState(false);
  useEffect(() => {
    visit(l.id);
  }, [l.id]);
  return (
    <main className="wrap subpage">
      <div className="crumb">
        <Link href="/">学习地图</Link> / {l.stage} / {l.module}
      </div>
      <div className="reader-grid">
        <article className="reading">
          <div className="flex items-center justify-between gap-2">
            <span className="stage-tag">{l.stage}</span>
            <button
              className="text-btn"
              aria-pressed={saved.includes(l.id)}
              onClick={() => toggle("saved", l.id)}
            >
              <Bookmark
                size={17}
                fill={saved.includes(l.id) ? "currentColor" : "none"}
              />
              {saved.includes(l.id) ? "已收藏" : "收藏"}
            </button>
          </div>
          <h1>{l.name}</h1>
          <p className="term">{l.term}</p>
          <h2>
            <BookOpen />
            概念讲解
          </h2>
          <p className="bodycopy">{l.body}</p>
          <section className="quiz">
            <h3>
              <Lightbulb size={19} />
              理解自测
            </h3>
            <p>{l.question}</p>
            <button
              aria-expanded={answer}
              className="text-btn"
              onClick={() => setAnswer(!answer)}
            >
              {answer ? "收起参考答案" : "查看参考答案"}
            </button>
            {answer && <p className="answer">{l.answer}</p>}
          </section>
          <a className="source" href={l.url} target="_blank" rel="noreferrer">
            模块延伸阅读 · {l.source}
            <ExternalLink size={14} />
          </a>
          <button
            className="primary"
            aria-pressed={done.includes(l.id)}
            onClick={() => toggle("done", l.id)}
          >
            <Check size={18} />
            {done.includes(l.id) ? "已学会 · 撤销标记" : "标记为已学会"}
          </button>
          <div className="neighbors">
            {[
              [prev, "上一知识点"],
              [next, "下一知识点"],
            ].map(
              ([t, label]) =>
                t && (
                  <Link key={label} href={"/learn/" + t.id + "/"}>
                    <small>{label}</small>
                    {t.name}
                  </Link>
                ),
            )}
          </div>
        </article>
        <aside className="side-card peers">
          <h3>本模块知识点</h3>
          {peers.map((t) => (
            <Link
              aria-current={t.id === l.id ? "page" : undefined}
              key={t.id}
              href={"/learn/" + t.id + "/"}
            >
              {done.includes(t.id) ? (
                <Check size={15} />
              ) : (
                <BookOpen size={15} />
              )}{" "}
              {t.name}
            </Link>
          ))}
        </aside>
      </div>
    </main>
  );
}
