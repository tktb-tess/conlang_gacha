import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

const root = ReactDOM.createRoot(document.querySelector<HTMLDivElement>('div#root')!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);



