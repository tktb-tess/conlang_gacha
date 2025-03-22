import { metadata } from "../modules/fetching";
import GachaResult from "./GachaResult";
import { FC } from "react";


const Gacha: FC = () => {

    return (
        <>
            <p>最終更新: <code>{metadata.date_last_updated.toLocaleString('ja-JP')}</code></p>
            <h3 className="text-center font-medium font-serif text-2xl">合計 {metadata.datasize[0]} 語</h3>
            <GachaResult />
            <p className="text-right mt-auto">Cotecライセンス表示: {metadata.license.content}</p>
        </>
    );
}

export default Gacha;
