import { Source } from '../sources/sources.model';

export interface Article {
    title: string;
    author: string;
    date: Date;
    excerpt: string;
    imageSrc?: string;
    link: string;
}

export interface ArticlesGetResponse {
  status: string;
  totalResults: number;
  articles: ArticleApi[];
}

export interface ArticleApi {
  source: Source;
  title: string;
  author: string | null;
  publishedAt: Date;
  description: string;
  content: string;
  url: string;
  urlToImage: string | null;
}
