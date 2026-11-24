import cell from "../content/cell.json";
import molecular from "../content/molecular.json";
import genetics from "../content/genetics.json";
import biochemistry from "../content/biochemistry.json";
import omics from "../content/omics.json";

const definitions = [
  ["cell", "细胞生物学", "Cell Biology", cell],
  ["molecular", "分子生物学", "Molecular Biology", molecular],
  ["genetics", "遗传学与基因调控", "Genetics & Gene Regulation", genetics],
  ["biochemistry", "生物化学与细胞功能", "Biochemistry", biochemistry],
  ["omics", "生物信息学与组学分析", "Bioinformatics & Omics", omics],
];
export const stages = definitions.map(([key, title, english, data], i) => ({
  key,
  title,
  english,
  number: i + 1,
  modules: data.map((m) => ({
    title: m.title,
    lessons: m.lessons.map(([name, term, body, question, answer, customId]) => {
      const id =
        customId ||
        key +
          "-" +
          term
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
      return {
        id,
        name,
        term,
        body,
        question,
        answer,
        stage: title,
        stageKey: key,
        module: m.title,
        source: m.source,
        url: m.url,
      };
    }),
  })),
}));
export const lessons = stages.flatMap((s) =>
  s.modules.flatMap((m) => m.lessons),
);
if (new Set(lessons.map((l) => l.id)).size !== lessons.length)
  throw new Error("课程英文标识重复，请提供唯一的自定义 ID");
export const summary = ({ id, name, term, stage, stageKey, module }) => ({
  id,
  name,
  term,
  stage,
  stageKey,
  module,
});
export const directory = stages.map((s) => ({
  ...s,
  modules: s.modules.map((m) => ({ ...m, lessons: m.lessons.map(summary) })),
}));
