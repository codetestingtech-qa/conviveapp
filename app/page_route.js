export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await fetch("https://conviveapp.com.br", { cache: "no-store" });
  const html = await res.text();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}