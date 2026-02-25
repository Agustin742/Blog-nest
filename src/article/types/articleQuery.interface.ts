export interface ArticleQuery {
  limit?: number;
  offset?: number;
  tag?: string;
  author?: string;
  favorited?: string;
}
