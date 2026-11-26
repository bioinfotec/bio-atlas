"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Dna, Search, X, BookOpen, Bookmark } from "lucide-react";
const Context = createContext(null);
export const useLearning = () => useContext(Context);
const empty = { done: [], saved: [], last: null };
const key = "bioatlas-learning-v1";
function read() {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return {
      done: Array.isArray(v?.done) ? v.done : [],
      saved: Array.isArray(v?.saved) ? v.saved : [],
      last: v?.last || null,
    };
  } catch {
    return empty;
  }
}
export function LearningProvider({ children }) {
  const [state, set] = useState(null),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const sync = () => set(read());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function update(fn) {
    const v = fn(read());
    set(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      setNotice("浏览器未允许保存学习记录。");
    }
  }
  const toggle = (field, id) =>
    update((v) => ({
      ...v,
      [field]: v[field].includes(id)
        ? v[field].filter((x) => x !== id)
        : [...v[field], id],
    }));
  return (
    <Context.Provider
      value={{
        ...(state ?? empty),
        ready: state !== null,
        toggle,
        visit: (id) => update((v) => ({ ...v, last: id })),
      }}
    >
      {children}
      {notice && <p role="status">{notice}</p>}
    </Context.Provider>
  );
}
export function Header() {
  const path = usePathname(),
    dialog = useRef(),
    [topics, setTopics] = useState(null),
    [query, setQuery] = useState(""),
    [error, setError] = useState(false);
  async function open() {
    setQuery("");
    dialog.current.showModal();
    if (topics) return;
    setError(false);
    try {
      const r = await fetch("/api/topics.json");
      if (!r.ok) throw Error();
      setTopics(await r.json());
    } catch {
      setError(true);
    }
  }
  useEffect(() => {
    function keydown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!dialog.current.open) open();
      }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [topics]);
  const results = (topics || []).filter((l) =>
    (l.name + " " + l.term + " " + l.module + " " + l.stage)
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <header>
        <div className="wrap bar">
          <Link href="/" className="brand">
            <i>
              <Dna size={28} />
            </i>
            BioAtlas
          </Link>
          <nav>
            {[
              ["/", "学习地图"],
              ["/library/", "知识库"],
              ["/saved/", "我的收藏"],
            ].map(([href, title]) => (
              <Link
                className={path === href || path + "/" === href ? "active" : ""}
                key={href}
                href={href}
              >
                {title}
              </Link>
            ))}
          </nav>
          <button
            className="search-launch"
            onClick={open}
            aria-label="搜索知识点"
          >
            <Search size={17} />
            <span>搜索知识点...</span>
            <kbd>Ctrl K</kbd>
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="search-head">
          <Search />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="输入中英文关键词"
            placeholder="搜索中文知识点或英文术语"
          />
          <button aria-label="关闭搜索" onClick={() => dialog.current.close()}>
            <X />
          </button>
        </div>
        <div className="results">
          <small>{query ? "搜索结果" : "浏览知识点"}</small>
          {error ? (
            <button onClick={open}>索引加载失败，重新加载</button>
          ) : !topics ? (
            <p>加载中…</p>
          ) : results.length === 0 ? (
            <p>没有找到匹配的知识点，可以试试英文术语。</p>
          ) : (
            results.slice(0, 40).map((l) => (
              <Link
                className="result"
                key={l.id}
                onClick={() => dialog.current.close()}
                href={"/learn/" + l.id + "/"}
              >
                <BookOpen size={17} />
                <span>
                  {l.name}
                  <small>
                    {l.term} · {l.stage}
                  </small>
                </span>
              </Link>
            ))
          )}
        </div>
      </dialog>
    </>
  );
}
