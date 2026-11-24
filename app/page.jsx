import { stages, directory, lessons } from "../lib/course";
import { Map as MapIcon, Layers, BookOpen, Microscope } from "lucide-react";
import { Dashboard } from "../components/dashboard";
export default function Home() {
  const picks = stages.map((s) => s.modules[0].lessons[0]);
  return (
    <main className="wrap">
      <section className="hero">
        <div className="hero-copy">
          <div className="overline">
            <Microscope size={16} /> BIOLOGY LEARNING ATLAS
          </div>
          <h1>生物学学习图谱</h1>
          <p>从细胞结构到组学分析，循序探索生命科学。</p>
          <div className="hero-stats">
            {[
              [MapIcon, stages.length, "个阶段"],
              [
                Layers,
                stages.reduce((n, s) => n + s.modules.length, 0),
                "个模块",
              ],
              [BookOpen, lessons.length, "个知识点"],
            ].map(([Icon, n, t]) => (
              <span key={t}>
                <Icon size={16} />
                <b>{n}</b>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
      <Dashboard stages={directory} picks={picks} />
    </main>
  );
}
