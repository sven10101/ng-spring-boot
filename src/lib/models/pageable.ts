export interface Pageable {
  page?: number;
  size?: number;
  sort?: string;
  sortDir?: 'ASC'|'DESC';
  filter?: string;
}
