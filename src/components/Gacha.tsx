import GachaBtn from "./Button";
import { metadata } from "../modules/conlang_list";




const Gacha = () => {

    const last_updated = new Date(metadata.date_last_updated);
    return (
        <>
            <p>最終更新: {last_updated.toLocaleString('ja-JP')}</p>
            <h3 className="text-center font-medium font-serif text-2xl mb-3">合計 {metadata.datasize[0]} 語</h3>
            <div className="flex flex-col items-center mb-3">
                <GachaBtn content="ガチャを回す！"/>
            </div>
            <p className="text-right">Cotecライセンス表示: {metadata.license.content}</p>
        </>
    );
}

export default Gacha;
