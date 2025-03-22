import { contents } from "../modules/fetching";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { getRandomInt } from "../modules/util";
import './GachaResult.css';
import ExtLinkIcon from "./box-arrow-up-right";

const GachaResult: FC = () => {
    const init = Number(localStorage.getItem('last_shown_lang_ID'));

    const cond = init >= 0 && init < contents.length;

    const [index, setIndex] = useState(cond ? init : 0);
    
    const result_ref = useRef<HTMLDivElement>(null);

    const lang = contents[index];

    const handleShow = () => {
        const next_id = getRandomInt(0, contents.length);
        
        setIndex(() => next_id);

        const next_lang = contents[next_id];
        console.log({id: next_id, name: next_lang.name.normal[0], lang: next_lang});

        if (result_ref.current) {
            delete result_ref.current.dataset.visible;

            setTimeout(() => {
                if (result_ref.current) {
                    result_ref.current.dataset.visible = 'true';
                }
            }, 10);
        }
    };

    const handleUnload = useCallback(() => {
        localStorage.clear();
        localStorage.setItem('last_shown_lang_ID', index.toString());
    }, [index]);

    useEffect(() => {
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [handleUnload]);

    return (
        <div className="flex flex-col items-center gap-y-4">
            <button
                role="button"
                type="button"
                className="
                    px-3 py-2
                    font-serif font-bold
                    text-lg text-center text-mnlila
                    transition-colors bg-white hover:bg-neutral-300 bg-gradient-to-b from-transparent to-[#00000050]
                    drop-shadow-md rounded-lg
                    cursor-pointer
                "
                onClick={handleShow}>
                ガチャを回す！
            </button>

            <div ref={result_ref} className="flex flex-col gap-y-3 relative" id="result-root" data-visible="true">
                <h3 id="kekka" className="text-2xl font-medium font-serif text-center">〜結果〜</h3>

                {/* 名前, 作者, 説明, 創作時期, サイト, 辞書, 文法, twitter, 世界, カテゴリ, clav3 */}

                <table id="result-table">
                    <tbody>
                        <tr>
                            <td>名前</td>
                            <td>{lang.name.normal.concat(lang.name.kanji ?? []).join(', ')}</td>
                        </tr>
                        <tr>
                            <td>作者</td>
                            <td>{lang.creator.join(', ')}</td>
                        </tr>
                        {lang.desc && (
                            <tr>
                                <td>説明</td>
                                <td>
                                    {
                                        lang.desc.map((par, i) => {
                                            return <p key={`${index}-${i}`}>{par}</p>;
                                        })
                                    }
                                </td>
                            </tr>
                        )}
                        {lang.period && (
                            <tr>
                                <td>創作時期</td>
                                <td>{lang.period}</td>
                            </tr>
                        )}
                        {lang.site && (
                            <tr>
                                <td>サイト</td>
                                <td>
                                    <ul>
                                        {
                                            lang.site.map((sit, i) => {

                                                if (sit.name) {
                                                    if (sit.name.includes('サイト') || sit.name.includes('辞書') || sit.name.includes('文法')) {
                                                        return null;

                                                    } else {
                                                        return <li key={`${index}-${i}`}>{sit.name}: <a href={sit.url} target="_blank" rel="noreferrer">{sit.url} <ExtLinkIcon /></a></li>;
                                                    }
                                                } else {
                                                    return <li key={`${index}-${i}`}><a href={sit.url} target="_blank" rel="noreferrer">{sit.url} <ExtLinkIcon /></a></li>;
                                                }
                                            })
                                        }
                                    </ul>
                                </td>
                            </tr>
                        )}
                        {lang.dict && (
                            <tr>
                                <td>辞書</td>
                                <td>
                                    <ul>
                                        {
                                            lang.dict.map((dic, i) => {
                                                return (
                                                    <li key={`${index}-${i}`}>
                                                        <a href={dic} target="_blank" rel="noreferrer">{dic} <ExtLinkIcon /></a>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </td>
                            </tr>
                        )}
                        {lang.grammar && (
                            <tr>
                                <td>文法</td>
                                <td>
                                    <ul>
                                        {
                                            lang.grammar.map((gram, i) => {
                                                return (
                                                    <li key={`${index}-${i}`}>
                                                        <a href={gram} target="_blank" rel="noreferrer">{gram} <ExtLinkIcon /></a>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </td>
                            </tr>
                        )}
                        {lang.twitter && (
                            <tr>
                                <td>𝕏 (旧twitter)</td>
                                <td>
                                    <ul>
                                        {
                                            lang.twitter.map((url, i) => {
                                                return (
                                                    <li key={`${index}-${i}`}>
                                                        <a href={url} target="_blank" rel="noreferrer">{url} <ExtLinkIcon /></a>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </td>
                            </tr>
                        )}
                        {lang.world && (
                            <tr>
                                <td>世界</td>
                                <td>{lang.world.join(', ')}</td>
                            </tr>
                        )}
                        {lang.category && (
                            <tr>
                                <td>カテゴリ</td>
                                <td>
                                    <ul>
                                        {
                                            lang.category.map((cat, i) => {
                                                if (cat.name === 'CLA v3' || cat.name === 'モユネ分類') {
                                                    return null;

                                                } else if (cat.content) {
                                                    return <li key={`${index}-${i}`}>{cat.name}: {cat.content}</li>;

                                                } else {
                                                    return <li key={`${index}-${i}`}>{cat.name}</li>;
                                                }
                                            })
                                        }
                                    </ul>
                                </td>
                            </tr>
                        )}
                        {lang.moyune && (
                            <tr>
                                <td>モユネ分類</td>
                                <td>{lang.moyune.join('/')}</td>
                            </tr>
                        )}
                        {lang.clav3 && (
                            <tr>
                                <td>CLA v3</td>
                                <td>{lang.clav3.dialect}_{lang.clav3.language}_{lang.clav3.family}_{lang.clav3.creator}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default GachaResult;

