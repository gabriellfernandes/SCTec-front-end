import type { City, CitySearch, PaginatedResult } from '../../types/city';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

type HeadersLike = {
  get: (name: string) => string | null;
};

export class ApiHttpError extends Error {
  status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = status;
  }
}

function parsePagination(headers: HeadersLike): Omit<PaginatedResult<never>, 'items'> {
  return {
    total: Number(headers.get('x-total') ?? '0'),
    page: Number(headers.get('x-page') ?? '1'),
    limit: Number(headers.get('x-limit') ?? '10'),
    totalPages: Number(headers.get('x-total-pages') ?? '1'),
  };
}

function toQuery(search: CitySearch): string {
  const params = new URLSearchParams();

  if (search.name) {
    params.set('name', search.name);
  }

  if (search.page) {
    params.set('page', String(search.page));
  }

  if (search.limit) {
    params.set('limit', String(search.limit));
  }

  if (search.sort) {
    params.set('sort', search.sort);
  }

  if (search.order) {
    params.set('order', search.order);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function listCities(
  token: string,
  search: CitySearch,
): Promise<PaginatedResult<City>> {
  const response = await fetch(`${API_BASE_URL}/cities${toQuery(search)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;

    const message = Array.isArray(payload?.message)
      ? payload?.message[0]
      : payload?.message;

    throw new ApiHttpError(
      message ?? 'Falha ao listar municipios',
      response.status,
    );
  }

  const items = (await response.json()) as City[];
  const pagination = parsePagination(response.headers);

  return {
    items,
    ...pagination,
  };
}

type CityPayload = {
  name: string;
};

async function handleMutationError(response: Response): Promise<never> {
  const payload = (await response.json().catch(() => null)) as
    | { message?: string | string[] }
    | null;

  const message = Array.isArray(payload?.message)
    ? payload?.message[0]
    : payload?.message;

  throw new ApiHttpError(message ?? 'Falha ao processar municipio', response.status);
}

export async function createCity(
  token: string,
  payload: CityPayload,
): Promise<City> {
  const response = await fetch(`${API_BASE_URL}/cities`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return handleMutationError(response);
  }

  return (await response.json()) as City;
}

export async function updateCity(
  token: string,
  id: string,
  payload: CityPayload,
): Promise<City> {
  const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return handleMutationError(response);
  }

  return (await response.json()) as City;
}

export async function deleteCity(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return handleMutationError(response);
  }
}
