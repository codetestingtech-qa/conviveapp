export const runtime = "nodejs";

const UPSTREAM = "https://conviveapp.com.br";

function injectPwa(html) {
  const injection = `
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#000000" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="ConVive App" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />

<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }
</script>
`;
  return html.includes("</head>")
    ? html.replace("</head>", `${injection}\n</head>`)
    : html;
}

export async function GET(req, { params }) {
  const path = (params?.path || []).join("/");
  const url = new URL(req.url);

  const upstreamUrl = `${UPSTREAM}/${path}${url.search || ""}`;
  const upstreamRes = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      // Mantém user-agent e aceita conteúdo
      "user-agent": req.headers.get("user-agent") || "",
      "accept": req.headers.get("accept") || "*/*",
      "accept-language": req.headers.get("accept-language") || ""
    },
    redirect: "manual"
  });

  // Copia headers
  const contentType = upstreamRes.headers.get("content-type") || "";
  const headers = new Headers(upstreamRes.headers);

  // Evita CORS/chaves que podem atrapalhar em proxy
  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");

  if (contentType.includes("text/html")) {
    const html = await upstreamRes.text();
    const out = injectPwa(html);
    headers.set("content-type", "text/html; charset=utf-8");
    return new Response(out, { status: upstreamRes.status, headers });
  }

  // Para JS/CSS/imagens/etc, devolve sem mexer
  const body = await upstreamRes.arrayBuffer();
  return new Response(body, { status: upstreamRes.status, headers });
}