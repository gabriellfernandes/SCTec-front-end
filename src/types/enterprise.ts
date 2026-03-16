export type Enterprise = {
  id: string;
  name: string;
  ownerName: string;
  active: boolean;
  city: {
    id: string;
    name: string;
  } | null;
  segment: {
    id: string;
    name: string;
  } | null;
  contacts: Array<{
    id: string;
    name?: string | null;
    department?: string | null;
    emails: Array<{
      id: string;
      address: string;
    }>;
    phones: Array<{
      id: string;
      number: string;
    }>;
  }>;
};

export type EnterpriseSearch = {
  cityId?: string;
  segmentId?: string;
  page?: number;
  limit?: number;
  sort?: 'name' | 'ownerName' | 'active' | 'cityName' | 'segmentName';
  order?: 'ASC' | 'DESC';
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type EnterprisePayload = {
  name: string;
  ownerName: string;
  cityId?: string;
  segmentId?: string;
  active: boolean;
  contacts?: Array<{
    emails?: string[];
    phones?: string[];
  }>;
};
