import type { CotecMetadata } from "../modules/fetching";
import GachaResult from "./GachaResult";
import { FC } from "react";

type props = {
    metadata: CotecMetadata;
}

const Gacha: FC<props> = ({ metadata }: props) => {
    
    return (
        <>
            <p>最終更新: <code>{metadata.date_last_updated.toLocaleString('ja-JP')}</code></p>
            <h3 className="text-center font-medium font-serif text-2xl">合計 {metadata.datasize[0]} 語</h3>
            <GachaResult />
            
        </>
    );
}

export default Gacha;
