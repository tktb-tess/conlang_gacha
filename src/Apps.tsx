import { FC, ReactNode, Suspense, useEffect, useMemo, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import CotecData from "./components/Gacha";
import ExtLinkIcon from "./components/box-arrow-up-right";
import FootLicense from "./components/foot-license";
import type { Cotec } from "./modules/cotec";
import GachaResult from "./components/GachaResult";
import { LuLoaderCircle } from "react-icons/lu";

type CTCCache = {
  cache: Cotec;
  expires: number;
};

const fetchCotec = async (): Promise<Cotec> => {
  const url = `https://www.tktb-tess.dev/api/cotec`;
  const resp = await fetch(url, { method: "GET" });

  if (!resp.ok) {
    throw Error(`failed to fetch cotec json - error status: ${resp.status}`);
  }

  return resp.json();
};

const loadCotec = async (): Promise<Cotec> => {
  const ctcCache = localStorage.getItem("ctc-cache");
  let cotec: Cotec | undefined;

  if (!ctcCache) {
    console.log("cache: no data");
    cotec = await fetchCotec();
  } else {
    const { cache, expires } = JSON.parse(ctcCache) as CTCCache;
    const month = 1000 * 3600 * 24 * 30;
    const cond = Date.now() < expires + month;

    console.log(`cache: ${cond ? "valid" : "expired"}`);
    cotec = cond ? cache : await fetchCotec();
  }

  return cotec;
};

const App: FC = () => {
  const init = useMemo(() => loadCotec(), []);
  const [ctcpromise, setCtcpromise] = useState(init);

  useEffect(() => {
    const handleUnload = async () => {
      const ctc = await ctcpromise;

      const lastUpdate = new Date(ctc.metadata.date_last_updated);

      const month = lastUpdate.getMonth();
      const day = 1000 * 3600 * 24;
      const duration = (() => {
        /*
         * 1 -> 28日 or 29日
         * 3, 5, 8, 10 -> 30日
         * 0, 2, 4, 6, 7, 9, 11 -> 31日
         */

        if (month === 1) {
          const year = lastUpdate.getFullYear();

          if (year % 400 === 0) return day * 29;
          else if (year % 100 === 0) return day * 28;
          else if (year % 4 === 0) return day * 29;
          else return day * 28;
        } else if (month === 3 || month === 5 || month === 8 || month === 10) {
          return day * 30;
        } else {
          return day * 31;
        }
      })();

      const ctcCache = {
        cache: ctc,
        expires: lastUpdate.getTime() + duration,
      } as const satisfies CTCCache;

      localStorage.removeItem("ctc_cache");
      localStorage.setItem("ctc-cache", JSON.stringify(ctcCache));
    };

    window.addEventListener("beforeunload", handleUnload, false);

    return () => {
      window.removeEventListener("beforeunload", handleUnload, false);
    };
  }, [ctcpromise]);

  return (
    <>
      <header className="mx-(--n-gutter) flow-root">
        <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-center my-15">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </header>
      <main className="flex flex-col justify-start min-h-[90vh] gap-y-3">
        <section>
          <h2 className="text-2xl font-semibold text-center font-serif mb-5">
            〜説明〜
          </h2>
          <p>
            <a
              href="https://github.com/kaeru2193/Conlang-List-Works/"
              target="_blank"
              rel="noreferrer"
            >
              かえるさん (kaeru2193) のリポジトリ <ExtLinkIcon />
            </a>
            にて管理されている <code>conlinguistics-wiki-list.ctc</code>{" "}
            からデータを取得し、ランダムで1つ言語を選んで情報を表示します。
          </p>
          <p>
            <code>conlinguistics-wiki-list.ctc</code> とは、人工言語学Wikiの
            <a
              href="https://wiki.conlinguistics.jp/%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%9C%8F%E3%81%AE%E4%BA%BA%E5%B7%A5%E8%A8%80%E8%AA%9E%E4%B8%80%E8%A6%A7"
              target="_blank"
              rel="noreferrer"
            >
              日本語圏の人工言語一覧 <ExtLinkIcon />
            </a>
            からリストを取得し、それをCotec形式に変換したものです。
            <br />(
            <a
              href="https://migdal.jp/cl_kiita/cotec-conlang-table-expression-powered-by-csv-clakis-rfc-2h86"
              target="_blank"
              rel="noreferrer"
            >
              Cotec形式の詳細 <ExtLinkIcon />
            </a>
            )
          </p>
          <button
            className="border border-white py-1 px-3 rounded-md block mx-auto my-4 w-max hover:text-neutral-400 hover:border-neutral-400 transition-colors"
            onClick={() => setCtcpromise(() => fetchCotec())}
          >
            ctc強制再読み込み
          </button>
        </section>
        <ErrorBoundary FallbackComponent={Err}>
          <Suspense fallback={<Loading />}>
            <CotecData ctcpromise={ctcpromise} />
            <GachaResult ctcpromise={ctcpromise} />
          </Suspense>
        </ErrorBoundary>
      </main>
      <ErrorBoundary fallback={null}>
        <Suspense>
          <FootLicense ctcpromise={ctcpromise} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

const Loading: FC = () => {
  return (
    <p className="text-center text-2xl">
      <LuLoaderCircle className="inline-block me-3 animate-spin" />
      Wird geladen...
    </p>
  );
};

const Err: FC<FallbackProps> = ({ error }: FallbackProps) => {
  const err = error as unknown;
  let text: ReactNode = <>Oops! something went wrong...</>;

  if (err instanceof Error) {
    text = (
      <>
        Error
        <br />
        {err.message}
      </>
    );
  }

  return <p className="text-center text-2xl text-[red]">{text}</p>;
};

export default App;
