import { lessons, summary } from "../../../lib/course";
import Reader from "../../../components/reader";
import { notFound } from "next/navigation";
export const dynamicParams = false;
export function generateStaticParams() {
  return lessons.map(({ id }) => ({ id }));
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: lessons.find((l) => l.id === id)?.name };
}
export default async function Page({ params }) {
  const { id } = await params;
  const index = lessons.findIndex((l) => l.id === id);
  if (index < 0) notFound();
  const l = lessons[index];
  return (
    <Reader
      key={id}
      lesson={l}
      peers={lessons
        .filter((x) => x.stageKey === l.stageKey && x.module === l.module)
        .map(summary)}
      prev={index ? summary(lessons[index - 1]) : null}
      next={index + 1 < lessons.length ? summary(lessons[index + 1]) : null}
    />
  );
}
