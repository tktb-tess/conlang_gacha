import type { Cotec, CTCCache } from './cotec';

export const key = 'ctc-cache';

export const fetchCotec = async (): Promise<Cotec> => {
  const url = `https://tktb-tess.github.io/cotec-json-data/parsed-from-conlinguistics-wiki-list.ctc.json`;
  const resp = await fetch(url, { method: 'GET' });

  if (!resp.ok) {
    throw Error(`failed to fetch cotec json - error status: ${resp.status}`);
  }

  return resp.json();
};

export const loadCotec = () => {
  const ctcCache = localStorage.getItem(key);
  let cotec: Promise<Cotec> | Cotec | undefined;

  if (!ctcCache) {
    console.log('cache: no data');
    cotec = fetchCotec();
  } else {
    try {
      const { cache, expires } = JSON.parse(ctcCache) as CTCCache;
      const cond = Date.now() < expires;
      console.log(`cache: ${cond ? 'valid' : 'expired'}`);
      cotec = cond ? cache : fetchCotec();
    } catch (e) {
      console.error(e);
      cotec = fetchCotec();
    }
  }

  return cotec;
};
