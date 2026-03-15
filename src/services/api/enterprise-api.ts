import type {
  Enterprise,
  EnterprisePayload,
  EnterpriseSearch,
  PaginatedResult,
} from '../../types/enterprise';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

type HeadersLike = {
  get: (name: string) => string | null;
};

export class EnterpriseApiHttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'EnterpriseApiHttpError';
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

function toQuery(search: EnterpriseSearch): string {
  const params = new URLSearchParams();

  if (search.cityId) {
    params.set('cityId', search.cityId);
  }

  if (search.segmentId) {
    params.set('segmentId', search.segmentId);
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

async function parseError(response: Response, fallback: string): Promise<never> {
  const payload = (await response.json().catch(() => null)) as
    | { message?: string | string[] }
    | null;

  const message = Array.isArray(payload?.message)
    ? payload?.message[0]
    : payload?.message;

  throw new EnterpriseApiHttpError(message ?? fallback, response.status);
}

export async function listEnterprises(
  token: string,
  search: EnterpriseSearch,
): Promise<PaginatedResult<Enterprise>> {
  const response = await fetch(`${API_BASE_URL}/enterprises${toQuery(search)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao listar empresas');
  }

  const items = (await response.json()) as Enterprise[];
  const pagination = parsePagination(response.headers);

  return {
    items,
    ...pagination,
  };
}

export async function createEnterprise(
  token: string,
  payload: EnterprisePayload,
): Promise<Enterprise> {
  const response = await fetch(`${API_BASE_URL}/enterprises`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao criar empresa');
  }

  return (await response.json()) as Enterprise;
}

export async function getEnterpriseById(
  token: string,
  id: string,
): Promise<Enterprise> {
  const response = await fetch(`${API_BASE_URL}/enterprises/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao buscar empresa');
  }

  return (await response.json()) as Enterprise;
}

export async function updateEnterprise(
  token: string,
  id: string,
  payload: EnterprisePayload,
): Promise<Enterprise> {
  const response = await fetch(`${API_BASE_URL}/enterprises/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao atualizar empresa');
  }

  return (await response.json()) as Enterprise;
}

export async function deleteEnterprise(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/enterprises/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao excluir empresa');
  }
}
