import Library from "../../components/library";
import { lessons, summary } from "../../lib/course";
export const metadata = { title: "我的收藏" };
export default function Page() {
  return <Library topics={lessons.map(summary)} savedOnly />;
}
