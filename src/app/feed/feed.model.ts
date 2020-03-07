export interface Source {
    id: number;
    name: string;
    url: string;
}

export interface Article {
    title: string;
    author: string;
    date: Date;
    excerpt: string;
    imageSrc: string;
    link: string;
}