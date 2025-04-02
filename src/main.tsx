import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./Apps";

const root = document.querySelector<HTMLDivElement>("div#root");
if (!root) throw Error("cannot get `root`");

localStorage.removeItem("last_shown_lang_ID");
localStorage.removeItem("last-shown-lang-ID");
localStorage.removeItem("ctc_cache");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
