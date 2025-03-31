import type { Cotec } from "../modules/cotec";
import { FC, use } from "react";

type props = {
    ctcpromise: Promise<Cotec>;
}

const CotecData: FC<props> = ({ ctcpromise }: props) => {
    
    const metadata = use(ctcpromise).metadata;
    const last_update = new Date(metadata.date_last_updated);

    return (
        <>
            <p>最終更新: <code>{last_update.toLocaleString()}</code></p>
            <h3 className="text-center font-medium font-serif text-2xl">合計 {metadata.datasize[0]} 語</h3>
        </>
    );
}

export default CotecData;
