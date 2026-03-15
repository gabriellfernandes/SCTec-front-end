import { useEffect, useMemo, useState } from 'react';
import {
  createEnterprise,
  deleteEnterprise,
  EnterpriseApiHttpError,
  listEnterprises,
  updateEnterprise,
} from '../services/api/enterprise-api';
import type { Enterprise, EnterprisePayload, EnterpriseSearch } from '../types/enterprise';

type EnterpriseFilters = {
  cityId: string;
  segmentId: string;
  limit: number;
  sort: 'name' | 'ownerName' | 'active' | 'cityName' | 'segmentName';
  order: 'ASC' | 'DESC';
};

const INITIAL_FILTERS: EnterpriseFilters = {
  cityId: '',
  segmentId: '',
  limit: 10,
  sort: 'name',
  order: 'ASC',
};

type UseEnterprisesListResult = {
  items: Enterprise[];
  isLoading: boolean;
  errorMessage: string;
  filters: EnterpriseFilters;
  page: number;
  total: number;
  totalPages: number;
  setCityFilter: (value: string) => void;
  setSegmentFilter: (value: string) => void;
  setLimit: (value: number) => void;
  setSort: (sort: 'name' | 'ownerName' | 'active' | 'cityName' | 'segmentName') => void;
  toggleOrder: () => void;
  goToPage: (page: number) => void;
  unauthorized: boolean;
  mutationError: string;
  clearMutationError: () => void;
  createItem: (payload: EnterprisePayload) => Promise<string | null>;
  updateItem: (id: string, payload: EnterprisePayload) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
};

export function useEnterprisesList(token: string | null): UseEnterprisesListResult {
  const [items, setItems] = useState<Enterprise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unauthorized, setUnauthorized] = useState(false);
  const [mutationError, setMutationError] = useState('');
  const [filters, setFilters] = useState<EnterpriseFilters>(INITIAL_FILTERS);

  const query = useMemo<EnterpriseSearch>(
    () => ({
      cityId: filters.cityId || undefined,
      segmentId: filters.segmentId || undefined,
      page,
      limit: filters.limit,
      sort: filters.sort,
      order: filters.order,
    }),
    [filters.cityId, filters.limit, filters.order, filters.segmentId, filters.sort, page],
  );

  async function refresh(): Promise<void> {
    if (!token) {
      setErrorMessage('');
      setUnauthorized(false);
      setItems([]);
      setTotal(0);
      setTotalPages(1);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setUnauthorized(false);

    try {
      const result = await listEnterprises(token, query);
      setItems(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      if (error instanceof EnterpriseApiHttpError && error.status === 401) {
        setUnauthorized(true);
        setErrorMessage('Sua sessao expirou. Faca login novamente.');
        setItems([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }

      const message = error instanceof Error ? error.message : 'Erro ao carregar empresas';
      setErrorMessage(message);
      setItems([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }

  async function createItem(payload: EnterprisePayload): Promise<string | null> {
    if (!token) {
      setUnauthorized(true);
      return null;
    }

    setMutationError('');

    try {
      const created = await createEnterprise(token, payload);
      await refresh();
      return created.id;
    } catch (error) {
      if (error instanceof EnterpriseApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return null;
      }

      const message = error instanceof Error ? error.message : 'Erro ao criar empresa';
      setMutationError(message);
      return null;
    }
  }

  async function updateItem(id: string, payload: EnterprisePayload): Promise<boolean> {
    if (!token) {
      setUnauthorized(true);
      return false;
    }

    setMutationError('');

    try {
      await updateEnterprise(token, id, payload);
      await refresh();
      return true;
    } catch (error) {
      if (error instanceof EnterpriseApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return false;
      }

      const message = error instanceof Error ? error.message : 'Erro ao atualizar empresa';
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
      await deleteEnterprise(token, id);
      await refresh();
      return true;
    } catch (error) {
      if (error instanceof EnterpriseApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return false;
      }

      const message = error instanceof Error ? error.message : 'Erro ao excluir empresa';
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
  }, [token, filters.cityId, filters.limit, filters.order, filters.segmentId, filters.sort]);

  useEffect(() => {
    if (!token || page === 1) {
      return;
    }

    void refresh();
  }, [token, page]);

  function setCityFilter(value: string): void {
    setPage(1);
    setFilters((current) => ({ ...current, cityId: value }));
  }

  function setSegmentFilter(value: string): void {
    setPage(1);
    setFilters((current) => ({ ...current, segmentId: value }));
  }

  function setLimit(value: number): void {
    setPage(1);
    setFilters((current) => ({ ...current, limit: value }));
  }

  function setSort(sort: 'name' | 'ownerName' | 'active' | 'cityName' | 'segmentName'): void {
    setPage(1);
    setFilters((current) => ({ ...current, sort }));
  }

  function toggleOrder(): void {
    setPage(1);
    setFilters((current) => ({
      ...current,
      order: current.order === 'ASC' ? 'DESC' : 'ASC',
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
    setCityFilter,
    setSegmentFilter,
    setLimit,
    setSort,
    toggleOrder,
    goToPage,
    unauthorized,
    mutationError,
    clearMutationError,
    createItem,
    updateItem,
    deleteItem,
  };
}
