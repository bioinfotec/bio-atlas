"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Route,
  ChevronDown,
  Layers,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Bookmark,
  Lightbulb,
  Shuffle,
  LibraryBig,
  Check,
  ChevronsUpDown,
  NotebookPen,
} from "lucide-react";
import { useLearning } from "./shell";
export const lessonHref = (l) => "/learn/" + l.id + "/";
export function Dashboard({ stages, picks }) {
  const { done, saved, last } = useLearning(),
    [open, setOpen] = useState([]),
    [pick, setPick] = useState(0);
  const all = stages.flatMap((s) => s.modules.flatMap((m) => m.lessons)),
    completed = all.filter((l) => done.includes(l.id)).length;
  const recent = all.find((l) => l.id === last),
    next =
      (recent && !done.includes(recent.id)
        ? recent
        : all.find((l) => !done.includes(l.id))) || all[0];
  const percent = Math.round((100 * completed) / all.length),
    sample = picks[pick];
  return (
    <div className="dashboard">
      <section>
        <div className="section-title">
          <h2>
            <Route />
            学习路径
          </h2>
          <button
            className="text-btn"
            onClick={() =>
              setOpen(
                open.length === stages.length ? [] : stages.map((s) => s.key),
              )
            }
          >
            <ChevronsUpDown size={15} />
            {open.length === stages.length ? "收起全部" : "展开全部"}
          </button>
        </div>
        <div className="stage-list">
          {stages.map((s, i) => {
            const expanded = open.includes(s.key);
            return (
              <article className={"stage stage-" + i} key={s.key}>
                <button
                  className="stage-head"
                  aria-expanded={expanded}
                  onClick={() =>
                    setOpen(
                      expanded
                        ? open.filter((x) => x !== s.key)
                        : [...open, s.key],
                    )
                  }
                >
                  <span aria-hidden="true" className={"plate plate-" + i} />
                  <span className="stage-info">
                    <span className="stage-tag">
                      阶段 {String(i + 1).padStart(2, "0")}
                    </span>
                    <strong>{s.title}</strong>
                    <span className="metadata">
                      <Layers />
                      {s.modules.length} 个模块 <em>·</em>
                      <BookOpen />
                      {s.modules.reduce((n, m) => n + m.lessons.length, 0)}{" "}
                      个知识点
                    </span>
                  </span>
                  <ChevronDown
                    size={19}
                    className={"chevron " + (expanded ? "rotated" : "")}
                  />
                </button>
                {expanded && (
                  <div className="modules">
                    {s.modules.map((m) => (
                      <details key={m.title}>
                        <summary>
                          {m.title}
                          <small>{m.lessons.length} 节</small>
                        </summary>
                        <div>
                          {m.lessons.map((l) => (
                            <Link key={l.id} href={lessonHref(l)}>
                              {done.includes(l.id) ? (
                                <Check size={15} />
                              ) : (
                                <BookOpen size={15} />
                              )}{" "}
                              {l.name}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <aside>
        <div className="section-title">
          <h2>
            <ChartNoAxesColumnIncreasing />
            学习概览
          </h2>
        </div>
        <section className="side-card">
          <div className="card-head">
            <span className="square-icon">
              <NotebookPen size={18} />
            </span>
            <h3>我的学习进度</h3>
          </div>
          <div className="progress-label">
            <span>总体完成度</span>
            <b>
              {percent}
              <small>%</small>
            </b>
          </div>
          <progress
            max={all.length}
            value={completed}
            aria-label="总体完成度"
          />
          <div className="counters">
            <span>
              <b>{completed}</b>已学知识点
            </span>
            <Link href="/saved/">
              <b>{all.filter((l) => saved.includes(l.id)).length}</b>我的收藏
            </Link>
          </div>
          <Link className="primary" href={lessonHref(next)}>
            <BookOpen size={17} />
            {completed === all.length
              ? "重新温习"
              : recent
                ? "继续学习"
                : "开始学习"}
          </Link>
        </section>
        <section className="flash-card">
          <div className="card-head">
            <Lightbulb size={20} />
            <h3>知识抽认卡</h3>
            <button
              className="shuffle"
              onClick={() => setPick((pick + 1) % picks.length)}
              aria-label="换一张抽认卡"
            >
              <Shuffle size={17} />
            </button>
          </div>
          <small>{sample.stage}</small>
          <h4>{sample.question}</h4>
          <Link href={lessonHref(sample)} className="flash-link">
            <BookOpen size={15} />
            阅读知识点
          </Link>
        </section>
      </aside>
    </div>
  );
}
