export const runtime = "nodejs";

export default async function Home() {
  const res = await fetch("https://conviveapp.com.br", {
    cache: "no-store"
  });
 // 
  const html = await res.text();

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}