import { ReactNode, MouseEventHandler, FC } from "react";


type Props = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
}

const MyBtn: FC<Props> = ({ onClick, children = '' }) => {
    return (
        <button
            role="button"
            type="button"
            className="
                px-3 py-2 font-bold
                text-lg text-center text-black
                transition-colors bg-white hover:bg-neutral-400 bg-gradient-to-b from-transparent to-[#00000030]
                rounded-md
            "
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default MyBtn;