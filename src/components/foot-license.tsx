import { FC, use } from "react";
import type { Cotec } from "../modules/cotec";

type Props = {
    ctcpromise: Cotec | Promise<Cotec>;
}

const FootLicense: FC<Props> = ({ ctcpromise }: Props) => {
    const metadata = (ctcpromise instanceof Promise) ? use(ctcpromise).metadata : ctcpromise.metadata;

    return (
        <footer className="flex flex-col items-center gap-y-5 justify-center mb-3">
            <p className="self-end">Cotecライセンス表示: {metadata.license.content}</p>
        </footer>
    );
}

export default FootLicense;