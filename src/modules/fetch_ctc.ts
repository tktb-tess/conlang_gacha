import type { Cotec, CTCCache } from "./cotec";

export const key = 'ctc-cache';

export const fetchCotec = async (): Promise<Cotec> => {
  const url = `https://www.tktb-tess.dev/api/cotec`;
  const resp = await fetch(url, { method: "GET" });

  if (!resp.ok) {
    throw Error(`failed to fetch cotec json - error status: ${resp.status}`);
  }

  return resp.json();
};

export const loadCotec = async (): Promise<Cotec> => {
  const ctcCache = localStorage.getItem(key);
  let cotec: Cotec | undefined;

  if (!ctcCache) {
    console.log("cache: no data");
    cotec = await fetchCotec();
  } else {
    try {
      const { cache, expires } = JSON.parse(ctcCache) as CTCCache;
      const cond = Date.now() < expires;
      console.log(`cache: ${cond ? "valid" : "expired"}`);
      cotec = cond ? cache : await fetchCotec();
    } catch (e) {
      console.error(e);
      cotec = await fetchCotec();
    }
  }

  return cotec;
};