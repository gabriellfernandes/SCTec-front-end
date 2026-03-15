import { useEffect, useMemo, useState } from 'react';
import {
  ApiHttpError,
  createCity,
  deleteCity,
  listCities,
  updateCity,
} from '../services/api/city-api';
import type { City, CitySearch } from '../types/city';

type CitiesFilters = {
  name: string;
  limit: number;
  sort: 'name' | 'createdAt' | 'updatedAt';
  order: 'ASC' | 'DESC';
};

const INITIAL_FILTERS: CitiesFilters = {
  name: '',
  limit: 10,
  sort: 'name',
  order: 'ASC',
};

type UseCitiesListResult = {
  items: City[];
  isLoading: boolean;
  errorMessage: string;
  filters: CitiesFilters;
  page: number;
  total: number;
  totalPages: number;
  setNameFilter: (value: string) => void;
  setLimit: (value: number) => void;
  setSort: (sort: 'name' | 'createdAt' | 'updatedAt') => void;
  toggleOrder: () => void;
  goToPage: (page: number) => void;
  unauthorized: boolean;
  mutationError: string;
  clearMutationError: () => void;
  createItem: (name: string) => Promise<boolean>;
  updateItem: (id: string, name: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
};

export function useCitiesList(token: string | null): UseCitiesListResult {
  const [items, setItems] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unauthorized, setUnauthorized] = useState(false);
  const [mutationError, setMutationError] = useState('');
  const [filters, setFilters] = useState<CitiesFilters>(INITIAL_FILTERS);
  const [debouncedName, setDebouncedName] = useState('');

  const query = useMemo<CitySearch>(
    () => ({
      name: debouncedName || undefined,
      page,
      limit: filters.limit,
      sort: filters.sort,
      order: filters.order,
    }),
    [debouncedName, filters.limit, filters.order, filters.sort, page],
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
      const result = await listCities(token, query);
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
        error instanceof Error ? error.message : 'Erro ao carregar municipios';
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
      await createCity(token, { name });
      await refresh();
      return true;
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return false;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao criar municipio';
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
      await updateCity(token, id, { name });
      await refresh();
      return true;
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return false;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao atualizar municipio';
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
      await deleteCity(token, id);
      await refresh();
      return true;
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        setUnauthorized(true);
        return false;
      }

      const message =
        error instanceof Error ? error.message : 'Erro ao excluir municipio';
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
  }, [token, debouncedName, filters.limit, filters.sort, filters.order]);

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

  function setSort(sort: 'name' | 'createdAt' | 'updatedAt'): void {
    setPage(1);
    setFilters((current) => ({
      ...current,
      sort,
    }));
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
    setNameFilter,
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
    refresh,
  };
}
