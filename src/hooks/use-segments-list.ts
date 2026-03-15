import { useEffect, useMemo, useState } from 'react';
import {
  ApiHttpError,
  createSegment,
  deleteSegment,
  listSegments,
  updateSegment,
} from '../services/api/segment-api';
import type { Segment, SegmentSearch } from '../types/segment';

type SegmentsFilters = {
  name: string;
  limit: number;
};

const INITIAL_FILTERS: SegmentsFilters = {
  name: '',
  limit: 10,
};

type UseSegmentsListResult = {
  items: Segment[];
  isLoading: boolean;
  errorMessage: string;
  filters: SegmentsFilters;
  page: number;
  total: number;
  totalPages: number;
  setNameFilter: (value: string) => void;
  setLimit: (value: number) => void;
  goToPage: (page: number) => void;
  unauthorized: boolean;
  mutationError: string;
  clearMutationError: () => void;
  createItem: (name: string) => Promise<boolean>;
  updateItem: (id: string, name: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
};

export function useSegmentsList(token: string | null): UseSegmentsListResult {
  const [items, setItems] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unauthorized, setUnauthorized] = useState(false);
  const [mutationError, setMutationError] = useState('');
  const [filters, setFilters] = useState<SegmentsFilters>(INITIAL_FILTERS);
  const [debouncedName, setDebouncedName] = useState('');

  const query = useMemo<SegmentSearch>(
    () => ({
      name: debouncedName || undefined,
      page,
      limit: filters.limit,
      sort: 'name' as const,
      order: 'ASC' as const,
    }),
    [debouncedName, filters.limit, page],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedName(filters.name);
      setPage(1);
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [filters.name]);

  async function refresh(): Promise<void> {
    if (!token) {
      setErrorMessage('Faca login para listar segmentos');
      setUnauthorized(true);
      setItems([]);
      setTotal(0);
      setTotalPages(1);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setUnauthorized(false);

    try {
      const result = await listSegments(token, query);
      setItems(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        setUnauthorized(true);
        setErrorMessage('Sua sessao expirou. Faca login novamente.');
        setItems([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao carregar segmentos';
      setErrorMessage(message);
      setItems([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }

  async function createItem(name: string): Promise<boolean> {
    if (!token) {
      setUnauthorized(true);
      return false;
    }

    setMutationError('');

    try {
      await createSegment(token, { name });
      await refresh();
      return true;
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return false;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao criar segmento';
      setMutationError(message);
      return false;
    }
  }

  async function updateItem(id: string, name: string): Promise<boolean> {
    if (!token) {
      setUnauthorized(true);
      return false;
    }

    setMutationError('');

    try {
      await updateSegment(token, id, { name });
      await refresh();
      return true;
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return false;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao atualizar segmento';
      setMutationError(message);
      return false;
    }
  }

  async function deleteItem(id: string): Promise<boolean> {
    if (!token) {
      setUnauthorized(true);
      return false;
    }

    setMutationError('');

    try {
      await deleteSegment(token, id);
      await refresh();
      return true;
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return false;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao excluir segmento';
      setMutationError(message);
      return false;
    }
  }

  function clearMutationError(): void {
    setMutationError('');
  }

  useEffect(() => {
    if (!token) {
      void refresh();
      return;
    }

    if (page !== 1) {
      setPage(1);
      return;
    }

    void refresh();
  }, [token, debouncedName, filters.limit]);

  useEffect(() => {
    if (!token || page === 1) {
      return;
    }

    void refresh();
  }, [token, page]);

  function setNameFilter(value: string): void {
    setPage(1);
    setFilters((current) => ({
      ...current,
      name: value,
    }));
  }

  function setLimit(value: number): void {
    setPage(1);
    setFilters((current) => ({
      ...current,
      limit: value,
    }));
  }

  function goToPage(nextPage: number): void {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);
  }

  return {
    items,
    isLoading,
    errorMessage,
    filters,
    page,
    total,
    totalPages,
    setNameFilter,
    setLimit,
    goToPage,
    unauthorized,
    mutationError,
    clearMutationError,
    createItem,
    updateItem,
    deleteItem,
    refresh,
  };
}
