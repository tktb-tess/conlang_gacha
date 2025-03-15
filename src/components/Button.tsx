import React from "react";

type btnProps = {
    content: string;
    type?: "button" | "submit" | "reset";
    role?: React.AriaRole;
};




const GachaBtn: React.FC<btnProps> = ({ content, type = 'button', role = 'button' }: btnProps) => {

    return (
        <button
            role={role} 
            type={type} 
            className="font-serif font-semibold text-lg text-center px-3 py-2
                transition-colors bg-gradient-to-b from-white hover:from-gray-400 to-gray-400 hover:to-gray-500 text-purple-950 
                drop-shadow-md cursor-pointer rounded-lg">
                    {content}
        </button>
    );
}

export default GachaBtn;