import { Suspense } from "react";
import ConfettiEffect from "./confetti-effect";

export const dynamic = "force-dynamic";

const TABNEWS_API = "https://www.tabnews.com.br/api/v1";
const REQUEST_TIMEOUT_MS = 3000;

async function getTotalContents(): Promise<number | null> {
  try {
    const response = await fetch(
      `${TABNEWS_API}/contents?page=1&per_page=1&strategy=new`,
      { cache: "no-store", signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
    );

    const headerTotal = response.ok
      ? response.headers.get("x-pagination-total-rows")
      : null;
    // Discard the body: only the header is needed.
    response.body?.cancel().catch(() => {});

    if (headerTotal) {
      const parsed = Number.parseInt(headerTotal, 10);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    const analyticsRes = await fetch(
      `${TABNEWS_API}/analytics/root-content-published`,
      { cache: "no-store", signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
    );
    if (analyticsRes.ok) {
      const data: Array<{ date: string; amount: string | number }> =
        await analyticsRes.json();
      return data.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    }
  } catch {
    return null;
  }

  return null;
}

async function TotalContents() {
  const totalContents = await getTotalContents();

  return totalContents !== null
    ? totalContents.toLocaleString("pt-BR")
    : "Indisponível no momento";
}

export default function Home() {
  return (
    <>
      <ConfettiEffect />
      <div className="blob a" />
      <div className="blob b" />
      <main>
        <span className="badge">🚧 Em construção</span>
        <h1>Em construção</h1>
        <p className="description">
          Estamos nesse exato momento reconstruindo o TabNews, um lugar na
          internet para quem trabalha com tecnologia e precisa comsumir
          conteúdos com valor concreto
        </p>

        <div className="stats-card">
          <span className="stats-label">
            Total de conteúdos publicados no TabNews
          </span>
          <strong className="stats-value" aria-live="polite">
            <Suspense fallback={<span className="stats-loading">Carregando…</span>}>
              <TotalContents />
            </Suspense>
          </strong>
        </div>

        <a
          href="https://www.tabnews.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="official-link"
        >
          Acessar o site oficial do TabNews ↗
        </a>
      </main>
    </>
  );
}
