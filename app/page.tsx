import { Shell } from "@/components/shell/Shell";
import { fetchContributions } from "@/lib/github";

export default async function Home() {
  const contributions = await fetchContributions();
  return <Shell contributions={contributions} />;
}
