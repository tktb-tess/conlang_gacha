import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App";

const root = document.querySelector<HTMLDivElement>('div#root');
if (!root) throw Error('cannot get `root`');

ReactDOM.createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);

