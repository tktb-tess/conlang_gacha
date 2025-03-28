import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import Gacha from "./components/Gacha";
import { metadata } from "./modules/fetching";
import "./style.css";
import ExtLinkIcon from "./components/box-arrow-up-right";

const root = document.querySelector<HTMLDivElement>('div#root');
if (!root) throw Error('cannot get `root`');

ReactDOM.createRoot(root).render(
    <StrictMode>
        <header className="mx-(--n-gutter) flow-root">
            <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-center my-15">{import.meta.env.VITE_APP_NAME}</h1>
        </header>
        <main className="flex flex-col justify-start min-h-[90vh] gap-y-3 mb-2">
            
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
            <Gacha metadata={metadata} />
        </main>
        <footer className="flex flex-col items-center gap-y-5 justify-center mb-3">
            <p className="self-end">Cotecライセンス表示: {metadata.license.content}</p>
        </footer>
    </StrictMode>
);

