import { useState, useEffect } from "react";


export const useLocalStorage = <T>(key: string, init_value: T): [T, React.Dispatch<React.SetStateAction<T>>] => {

    const [value, setValue] = useState(() => {
        const ls = localStorage.getItem(key);
        return ls ? JSON.parse(ls) as T : init_value;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
};