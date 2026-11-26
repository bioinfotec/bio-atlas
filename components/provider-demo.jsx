"use client";

import { createContext, useContext, useState } from "react";
import { Bookmark } from "lucide-react";

const LearningContext = createContext(null);

function DemoLearningProvider({ children }) {
  const [saved, setSaved] = useState(false);

  function toggleSaved() {
    setSaved((previous) => !previous);
  }

  return (
    <LearningContext.Provider value={{ saved, toggleSaved }}>
      {children}
    </LearningContext.Provider>
  );
}

function FavoriteButton() {
  const { saved, toggleSaved } = useContext(LearningContext);

  return (
    <section className="rounded-xl border border-[var(--line)] bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold">收藏按钮</h2>
      <code className="text-sm text-[var(--muted)]">FavoriteButton</code>
      <p className="mt-4">细胞与生命的基本单位</p>
      <button
        type="button"
        className="primary"
        aria-label="收藏第一课"
        aria-pressed={saved}
        onClick={toggleSaved}
      >
        <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        {saved ? "已收藏" : "收藏"}
      </button>
    </section>
  );
}

function FavoriteCount() {
  const { saved } = useContext(LearningContext);

  return (
    <section className="rounded-xl border border-[var(--line)] bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold">收藏计数</h2>
      <code className="text-sm text-[var(--muted)]">FavoriteCount</code>
      <p className="mt-4 flex items-baseline gap-2" aria-live="polite">
        <span className="text-4xl font-semibold tabular-nums text-[var(--green)]">
          {saved ? 1 : 0}
        </span>
        个知识点
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        当前读取的值 <code>saved = {String(saved)}</code>
      </p>
    </section>
  );
}

export default function ProviderDemo() {
  return (
    <main className="wrap subpage">
      <div className="mx-auto max-w-3xl">
        <h1>React Context 收藏演示</h1>
        <p className="mt-2 text-[var(--muted)]">
          点击收藏按钮，观察两个组件如何随同一个状态一起更新。
        </p>
        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[#edf3e6] p-4 sm:p-6">
          <p className="mb-4 font-mono text-sm font-semibold text-[var(--green)]">
            DemoLearningProvider
          </p>
          <DemoLearningProvider>
            <div className="grid gap-4 sm:grid-cols-2">
              <FavoriteButton />
              <FavoriteCount />
            </div>
          </DemoLearningProvider>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          按钮调用 <code>toggleSaved()</code> 更新 Provider 中的 <code>saved</code>。
          两个组件用 <code>useContext()</code> 读取该值。刷新页面后从 0 开始。
        </p>
      </div>
    </main>
  );
}
