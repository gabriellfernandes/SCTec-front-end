export type Segment = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SegmentSearch = {
  name?: string;
  page?: number;
  limit?: number;
  sort?: 'name';
  order?: 'ASC' | 'DESC';
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
