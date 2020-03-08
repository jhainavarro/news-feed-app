export interface Source {
  id: string;
  name: string;
  url: string;
}

export interface SourcesGetResponse {
  status: string;
  sources: SourceApi[];
}

export interface SourceApi {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}
