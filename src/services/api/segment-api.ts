import type { PaginatedResult, Segment, SegmentSearch } from '../../types/segment';

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

function toQuery(search: SegmentSearch): string {
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

export async function listSegments(
  token: string,
  search: SegmentSearch,
): Promise<PaginatedResult<Segment>> {
  const response = await fetch(`${API_BASE_URL}/segments${toQuery(search)}`, {
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
      message ?? 'Falha ao listar segmentos',
      response.status,
    );
  }

  const items = (await response.json()) as Segment[];
  const pagination = parsePagination(response.headers);

  return {
    items,
    ...pagination,
  };
}

type SegmentPayload = {
  name: string;
};

async function handleMutationError(response: Response): Promise<never> {
  const payload = (await response.json().catch(() => null)) as
    | { message?: string | string[] }
    | null;

  const message = Array.isArray(payload?.message)
    ? payload?.message[0]
    : payload?.message;

  throw new ApiHttpError(message ?? 'Falha ao processar segmento', response.status);
}

export async function createSegment(
  token: string,
  payload: SegmentPayload,
): Promise<Segment> {
  const response = await fetch(`${API_BASE_URL}/segments`, {
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

  return (await response.json()) as Segment;
}

export async function updateSegment(
  token: string,
  id: string,
  payload: SegmentPayload,
): Promise<Segment> {
  const response = await fetch(`${API_BASE_URL}/segments/${id}`, {
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

  return (await response.json()) as Segment;
}

export async function deleteSegment(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/segments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return handleMutationError(response);
  }
}
