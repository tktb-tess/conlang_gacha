import React from "react";
import ReactDOM from "react-dom/client";
import Gacha from "./components/Gacha";
import "./style.css";

const gacha = document.querySelector<HTMLDivElement>('div#gacha');
if (!gacha) throw Error('cannot get `gacha`');

ReactDOM.createRoot(gacha).render(
    <React.StrictMode>
        <Gacha />
    </React.StrictMode>
);



