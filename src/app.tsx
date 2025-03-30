import { FC, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import CotecData from "./components/Gacha";
import ExtLinkIcon from "./components/box-arrow-up-right";
import FootLicense from "./components/foot-license";
import type { Cotec } from "./modules/cotec";
import GachaResult from "./components/GachaResult";
import { LuLoaderCircle } from "react-icons/lu";

const fetchCotec = async (): Promise<Cotec> => {
    const url = `https://uq-tess-xi-temp.vercel.app/api/cotec`;

    const resp = await fetch(url);

    if (!resp.ok) throw Error(`failed to fetch cotec json\nerror status: ${resp.status}`);

    return resp.json();
};

const App: FC = () => {
    const ctcpromise = fetchCotec();

    return (
        <>
            <header className="mx-(--n-gutter) flow-root">
                <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-center my-15">{import.meta.env.VITE_APP_NAME}</h1>
            </header>
            <main className="flex flex-col justify-start min-h-[90vh] gap-y-3">

                <section>
                    <h2 className="text-2xl font-semibold text-center font-serif mb-5">〜説明〜</h2>
                    <p>
                        <a href="https://github.com/kaeru2193/Conlang-List-Works/" target="_blank" rel="noreferrer">
                            かえるさん (kaeru2193) のリポジトリ <ExtLinkIcon />
                        </a>
                        にて管理されている <code>conlinguistics-wiki-list.ctc</code> からデータを取得し、ランダムで1つ言語を選んで情報を表示します。
                    </p>
                    <p>
                        <code>conlinguistics-wiki-list.ctc</code> とは、人工言語学Wikiの
                        <a href="https://wiki.conlinguistics.jp/%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%9C%8F%E3%81%AE%E4%BA%BA%E5%B7%A5%E8%A8%80%E8%AA%9E%E4%B8%80%E8%A6%A7"
                            target="_blank" rel="noreferrer">
                            日本語圏の人工言語一覧 <ExtLinkIcon />
                        </a>

                        からリストを取得し、それをCotec形式に変換したものです。<br />(
                        <a href="https://migdal.jp/cl_kiita/cotec-conlang-table-expression-powered-by-csv-clakis-rfc-2h86"
                            target="_blank" rel="noreferrer">
                            Cotec形式の詳細 <ExtLinkIcon />
                        </a>
                        )
                    </p>
                </section>
                <ErrorBoundary fallback={<Err />}>
                    <Suspense fallback={<Loading />}>
                        <CotecData ctcpromise={ctcpromise} />
                        <GachaResult ctcpromise={ctcpromise} />
                    </Suspense>
                </ErrorBoundary>
                
                
            </main>
            <ErrorBoundary fallback={<></>}>
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
            <LuLoaderCircle className="animate-spin inline-block me-3" />
            Wird geladen...
        </p>
    );
};

const Err: FC = () => {
    return <p className="text-center text-2xl text-[red]">Oops! something went wrong...</p>;
};

export default App;