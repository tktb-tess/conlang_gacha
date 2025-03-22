const moyunes = ['INT', 'ART', 'EXP', 'PHI', 'HYP', 'NAT', 'REA', 'IMG', 'CIN', 'CDE', 'GEN', 'SPE', 'SON', 'LIT', 'KIN', 'SER', 'JOK', 'PAV', 'AAV', 'PWL', 'AWL', 'TOL', 'PRI', 'PUB', 'FIX'] as const;

type Moyune = (typeof moyunes)[number];

const isMoyune = (str: string): str is Moyune => {

    for (const moyune of moyunes) {
        if (moyune === str) return true;
    }
    return false;
};

type CotecMetadata = Readonly<{
    datasize: readonly [number, number];
    title: string;
    author: readonly string[];
    date_created: Date;
    date_last_updated: Date;
    license: Readonly<{ name: string, content: string }>;
    advanced: number;
    label: readonly string[];
    type: readonly string[];
}>;

type CotecContent = {
    messier: unknown;
    name: {
        normal: string[];
        kanji?: string[];
    };
    desc?: string[];
    creator: string[];
    period?: string;
    site?: { name?: string, url: string }[];
    twitter?: string[];
    dict?: string[];
    grammar?: string[];
    world?: string[];
    category?: { name: string, content?: string }[];
    moyune?: Moyune[];
    clav3?: {
        dialect: string;
        language: string;
        family: string;
        creator: string;
    };
    part?: string;
    example?: string[];
    script?: string[];
};

const ctcurl = "https://kaeru2193.github.io/Conlang-List-Works/conlinguistics-wiki-list.ctc";

/** by ChatGPT */
const parseCSV = (csvString: string) => {

    const rows: string[][] = [];
    let row: string[] = [];
    let currentField = '';
    let is_inside_of_quote = false;

    for (let i = 0; i < csvString.length; i++) {
        const char = csvString[i];

        if (char === '"' && (i === 0 || csvString[i - 1] !== '\\')) { // ダブルクォート（not エスケープ）に入った/出た時にトグル
            is_inside_of_quote = !is_inside_of_quote;

        } else if (char === ',' && !is_inside_of_quote) {  // クォート内でないコンマ
            row.push(currentField.trim());           // フィールドを列配列に追加
            currentField = '';                       // クリア

        } else if (char === '\n' && !is_inside_of_quote) { // クォート内でない改行
            row.push(currentField.trim());           // フィールドを列配列に追加
            rows.push(row);                          // 列配列を2次元配列に追加
            row = [];                                // 列配列, フィールドをクリア
            currentField = '';

        } else {                                     // フィールドに文字を追加
            currentField += char;
        }
    }

    // 最後のセルと行を追加
    row.push(currentField.trim());
    rows.push(row);

    return rows;
}

const fetchConlangList = async () => {

    const resp = await fetch(ctcurl);

    if (!resp.ok) {
        throw new Error(`failed to fetch!\nresponse status: ${resp.status}`);
    }

    const raw = await resp.text();
    const parsed = parseCSV(raw);

    return parsed;
};

const parseToJSON = async (): Promise<[CotecMetadata, readonly Readonly<CotecContent>[]]> => {

    const contents: CotecContent[] = [];

    const parsed_data = await fetchConlangList();
    const row_meta = parsed_data[0];


    // メタデータ
    const datasize = ((): [number, number] => {
        const datasize = row_meta[0].split('x').map((size) => Number.parseInt(size));
        return [datasize[0], datasize[1]];
    })();

    const title = row_meta[1];
    const author = row_meta[2].split(',').map((str) => str.trim());
    const date_created = new Date(row_meta[3]);
    const date_last_updated = new Date(row_meta[4]);
    const license = { name: row_meta[5], content: row_meta[6] } as const;
    const advanced = Number.parseInt(row_meta[7]);

    // if (advanced !== 0) {
    //     /* 何か処理 */;
    // }

    const label = parsed_data[1];
    const type = parsed_data[2];

    const metadata: CotecMetadata = {
        datasize,
        title,
        author,
        date_created,
        date_last_updated,
        license,
        advanced,
        label,
        type
    } as const;

    // messier,name,kanji,desc,creator,period,site,twitter,dict,grammar,world,category,moyune,cla,part,example,script
    for (let i = 3; i < parsed_data.length - 1; i++) {

        const row = parsed_data[i];

        const cotec_one_content: CotecContent = {
            messier: undefined,
            name: {
                normal: [],
            },
            creator: [],
        };

        // messier, name, kanji
        if (row[0]) cotec_one_content.messier = row[0];
        if (row[1]) cotec_one_content.name.normal = row[1].split(';').map((datum) => datum.trim());
        if (row[2]) cotec_one_content.name.kanji = row[2].split(';').map((datum) => datum.trim());

        // desc
        if (row[3]) {
            const descs = row[3].split(';').map((datum) => datum.trim());

            // urlがあったら抽出してsiteに追加
            const regexurl = /(?:https:\/\/web\.archive\.org\/web\/[0-9]+\/)?https?:\/\/[\w.-]+[\w-]+(?:\/[\w?+\-_~=.&@#%]*)*/gu;

            const desc_: NonNullable<typeof cotec_one_content.desc> = [];
            const site_: NonNullable<typeof cotec_one_content.site> = [];

            for (const desc of descs) {
                desc_.push(desc);
                const matchurls = desc.match(regexurl);

                if (matchurls) {
                    const urlarray = Array.from(matchurls);

                    urlarray.forEach((url) => {
                        const res = { url };
                        site_.push(res);
                    });
                }
            }
            if (desc_.length > 0) cotec_one_content.desc = desc_;
            if (site_.length > 0) cotec_one_content.site = site_;
        }

        // creator, period
        if (row[4]) cotec_one_content.creator = row[4].split(';').map((datum) => datum.trim());
        if (row[5]) cotec_one_content.period = row[5];

        // site
        if (row[6]) {
            const site_p = row[6];

            const regex_for_site = /(?:(?<name>(?:\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana})+\d*):\s?|\s|^)(?<url>(?:https:\/\/web\.archive\.org\/web\/[0-9]+\/)?https?:\/\/[\w\-.]+[\w-]+(?:\/[\w?+\-_~=.&@#%]*)*)/gu;
            const matches = site_p.matchAll(regex_for_site);

            const site_: NonNullable<typeof cotec_one_content.site> = [];

            for (const match of matches) {
                if (match.groups) {

                    const res = match.groups;
                    const name = res.name, url = res.url;

                    if (!url) throw Error('parse error: site.url is empty');

                    const s_ = name
                        ? { name, url }
                        : { url }
                        ;

                    site_.push(s_);
                }
            }

            if (cotec_one_content.site) {
                cotec_one_content.site = cotec_one_content.site.concat(site_);

            } else {
                cotec_one_content.site = site_;

            }

        }



        // 辞書・文法のsiteをdict, grammarにパース
        if (cotec_one_content.site) {
            const grammar_: NonNullable<typeof cotec_one_content.grammar> = [];
            const dict_: NonNullable<typeof cotec_one_content.dict> = [];

            cotec_one_content.site.forEach((elem) => {
                if (typeof (elem) !== 'object' || Array.isArray(elem)) return;

                if (elem.name) {
                    if (elem.name.includes('文法')) grammar_.push(elem.url);
                    if (elem.name.includes('辞書')) dict_.push(elem.url);
                }
            });

            if (grammar_.length > 0) cotec_one_content.grammar = grammar_;
            if (dict_.length > 0) cotec_one_content.dict = dict_;
        }

        // twitter
        if (row[7]) cotec_one_content.twitter = row[7].split(';').map((s) => s.trim());

        // dict
        if (row[8]) {
            const dict_p = row[8].split(';').map((s) => s.trim());

            if (cotec_one_content.dict) {
                cotec_one_content.dict = cotec_one_content.dict.concat(dict_p);
            } else {
                cotec_one_content.dict = dict_p;
            }

        }

        // grammar
        if (row[9]) {
            const grammar_p = row[9].split(';').map((s) => s.trim());

            if (cotec_one_content.grammar) {
                cotec_one_content.grammar = cotec_one_content.grammar.concat(grammar_p);
            } else {
                cotec_one_content.grammar = grammar_p;
            }
        }

        // world
        if (row[10]) cotec_one_content.world = row[10].split(';').map((s) => s.trim());

        // category
        if (row[11]) {
            const category_p = row[11].split(';').map((s) => s.trim());

            const regex = /^(?<name>[^:]+)(?::(?<content>.+))?$/u;
            const category_: NonNullable<typeof cotec_one_content.category> = [];

            for (const elem of category_p) {
                const match = regex.exec(elem);

                if (match && match.groups) {
                    const res = match.groups;
                    const name = res.name, content = res.content;

                    const c_ = content
                        ? { name, content }
                        : { name }
                        ;

                    category_.push(c_);
                }
            }
            if (category_.length > 0) cotec_one_content.category = category_;
        }

        // モユネ分類・CLA v3をmoyune, clav3にパース
        if (cotec_one_content.category) {
            cotec_one_content.category.forEach((elem) => {
                if (typeof elem !== 'object' || Array.isArray(elem)) return;

                switch (elem.name) {
                    case "CLA v3": {
                        if (!elem.content) throw Error('');
                        const clav3_regex = /^(?<dialect>~|[a-z]{2})_(?<language>[a-z]{2})_(?<family>~|[a-z]{3})_(?<creator>[a-z]{3})$/;
                        const match = clav3_regex.exec(elem.content);

                        if (match && match.groups) {
                            const res = match.groups;
                            const dia = res.dialect;
                            const lang = res.language;
                            const fam = res.family;
                            const cre = res.creator;

                            const clav3 = {
                                dialect: dia,
                                language: lang,
                                family: fam,
                                creator: cre,
                            };
                            cotec_one_content.clav3 = clav3;
                        }
                        break;
                    }
                    case "モユネ分類": {

                        if (elem.content) {
                            const m: Moyune[] = [];
                            const parsed = Array.from(elem.content.match(/[A-Z]{3}/g) ?? []);
                            parsed.forEach(s => {
                                if (isMoyune(s)) m.push(s);
                            });
                            cotec_one_content.moyune = m;
                            cotec_one_content.moyune.sort();
                        }
                        break;
                    }
                    default: break;
                }
            });
        }


        // moyune
        if (row[12]) {
            const m: Moyune[] = [];
            const parsed = Array.from(row[12].match(/[A-Z]{3}/g) ?? []);

            parsed.forEach(s => {
                if (isMoyune(s)) m.push(s);
            });

            cotec_one_content.moyune = m;
            cotec_one_content.moyune.sort();
        }

        // clav3
        if (row[13]) {
            const clav3_regex = /^(?<dialect>~|[a-z]{2})_(?<language>[a-z]{2})_(?<family>~|[a-z]{3})_(?<creator>[a-z]{3})$/;
            const match = clav3_regex.exec(row[13]);

            if (match && match.groups) {
                const res = match.groups;
                const clav3 = {
                    dialect: res.dialect,
                    language: res.language,
                    family: res.family,
                    creator: res.creator,
                } as const;

                cotec_one_content.clav3 = clav3;
            }
        }

        // part
        if (row[14]) cotec_one_content.part = row[14].trim();

        // example, script
        if (row[15]) cotec_one_content.example = row[15].split(';').map((s) => s.trim());

        if (row[16]) cotec_one_content.script = row[16].split(';').map((s) => s.trim());

        contents.push(cotec_one_content);
    }

    console.log('fetching cotec file is successful');
    return [metadata, contents];
}


export const [metadata, contents] = await parseToJSON()
    .catch((e) => {
        if (e instanceof Error) {
            throw e;
        } else {
            throw Error('unidentified error!');
        }
    })
;


export const util = {

    /** JSONのダウンロード */
    downloadJSON() {
        const json_obj = JSON.stringify({ metadata, contents }, null);
        const url = URL.createObjectURL(new Blob([json_obj], { type: 'application/json' }));
        const anchorE = document.createElement('a');
        anchorE.href = url;
        anchorE.download = "conlinguistics-wiki-list-cotec.json";
        anchorE.click();
        anchorE.remove();
        URL.revokeObjectURL(url);
    },

    /** CTCのダウンロード */
    downloadCTC() {
        const anchorE = document.createElement('a');
        anchorE.href = ctcurl;
        anchorE.click();
        anchorE.remove();
    },

    showData(key: keyof CotecContent) {
        contents.forEach((lang, index) => {

            const data = lang[key];

            if (!data) return;

            const result = { index, name: lang.name.normal[0], data };

            if (Array.isArray(data)) {
                if (data.length === 0 || data[0] === '') return;

                console.log(result);
                return;

            } else if (typeof data === 'object') {
                if (Object.keys(data).length === 0) return;

                console.log(result);
                return;

            } else {
                console.log(result);
            }
        });
    },

    showdataAll(key: keyof CotecContent) {
        contents.forEach((lang, index) => { console.log({ index, name: lang.name.normal[0], data: lang[key] }) });
    },

    showsiteurl() {
        contents.forEach((lang, index) => {
            const site = lang.site ?? [];
            for (const e of site) {
                console.log(`index: ${index}, ${(e.name) ? `${e.name}: ` : ``}${e.url}`);
            }
        });
    },

    showCategories() {
        contents.forEach((lang, index) => {
            const cat = lang.category ?? [];
            for (const elem of cat) {
                console.log(`index: ${index}, ${elem.name}${(elem.content) ? `: ${elem.content}` : ``}`);
            }
        });
    },


    searchByName(name: string) {
        type result_t = {
            index: number;
            name: string;
            content: CotecContent;
        };

        const results: result_t[] = [];

        contents.forEach((lang, index) => {
            const names = lang.name.normal.concat(lang.name.kanji ?? []);

            const found = names.find((n) => n.includes(name));

            if (found) {
                results.push({ index, name: lang.name.normal[0], content: lang });
            }
        });

        if (results.length === 0) {
            console.log('Not found!');
        }

        return results;
    },

    searchByCreator(name: string) {
        type result_t = {
            index: number;
            name: string;
            content: CotecContent;
        };

        const results: result_t[] = [];
        contents.forEach((lang, index) => {
            const creators = lang.creator;
            const found = creators.find((n) => n.includes(name));
            if (found) {
                results.push({ index, name: lang.name.normal[0], content: lang });
            }
        });

        if (results.length === 0) {
            console.log('Not found!');
        }

        return results;
    },
} as const;

Object.defineProperty(window, 'cotec_json', {
    value: {
        metadata,
        contents,
        util,
    },
    enumerable: true,
});


