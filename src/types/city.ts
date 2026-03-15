export type City = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CitySearch = {
  name?: string;
  page?: number;
  limit?: number;
  sort?: 'name' | 'createdAt' | 'updatedAt';
  order?: 'ASC' | 'DESC';
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
