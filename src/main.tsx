import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';
import App from './Apps';

const root = document.querySelector<HTMLDivElement>('div#root');
if (!root) throw Error('cannot get `root`');

ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
