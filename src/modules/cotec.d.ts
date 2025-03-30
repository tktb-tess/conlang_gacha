export type CotecMetadata = {
    datasize: [number, number];
    title: string;
    author: string[];
    date_created: Date;
    date_last_updated: Date;
    license: { name: string, content: string };
    advanced: number;
    label: string[];
    type: string[];
};

export type CotecContent = {
    messier: unknown;
    name: {
        normal: string[];
        kanji: string[];
    };
    desc: string[];
    creator: string[];
    period: string | null;
    site: { name: string | null, url: string }[];
    twitter: string[];
    dict: string[];
    grammar: string[];
    world: string[];
    category: { name: string, content: string | null }[];
    moyune: MoyuneClass[];
    clav3: {
        dialect: string;
        language: string;
        family: string;
        creator: string;
    } | null;
    part: string | null;
    example: string[];
    script: string[];
};

export type Cotec = {
    metadata: Readonly<CotecMetadata>;
    contents: readonly Readonly<CotecContent>[];
};