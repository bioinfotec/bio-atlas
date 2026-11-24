import { lessons, summary } from "../../../lib/course";
export const dynamic = "force-static";
export function GET() {
  return Response.json(lessons.map(summary));
}
