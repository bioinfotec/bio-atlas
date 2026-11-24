import "./globals.css";
import { Header, LearningProvider } from "../components/shell";
export const metadata = {
  title: { default: "BioAtlas · 生物学学习图谱", template: "%s · BioAtlas" },
  description: "从细胞生物学到组学分析的中文分阶段学习手册。",
};
export default function Layout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <LearningProvider>
          <Header />
          {children}
        </LearningProvider>
        <footer className="wrap">
          BioAtlas <span>生物学研习室</span>
        </footer>
      </body>
    </html>
  );
}
