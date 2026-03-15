import { useEffect, useState } from 'react';
import { listCities } from '../services/api/city-api';
import { listSegments } from '../services/api/segment-api';

type ReferenceOption = {
  id: string;
  name: string;
};

type UseEnterpriseReferenceOptionsResult = {
  isLoading: boolean;
  errorMessage: string;
  cities: ReferenceOption[];
  segments: ReferenceOption[];
};

export function useEnterpriseReferenceOptions(
  token: string | null,
): UseEnterpriseReferenceOptionsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cities, setCities] = useState<ReferenceOption[]>([]);
  const [segments, setSegments] = useState<ReferenceOption[]>([]);

  useEffect(() => {
    if (!token) {
      setCities([]);
      setSegments([]);
      setErrorMessage('');
      return;
    }

    let active = true;
    setIsLoading(true);
    setErrorMessage('');

    void Promise.all([
      listCities(token, { page: 1, limit: 100, sort: 'name', order: 'ASC' }),
      listSegments(token, { page: 1, limit: 100, sort: 'name', order: 'ASC' }),
    ])
      .then(([cityResult, segmentResult]) => {
        if (!active) {
          return;
        }

        setCities(cityResult.items.map((item) => ({ id: item.id, name: item.name })));
        setSegments(
          segmentResult.items.map((item) => ({ id: item.id, name: item.name })),
        );
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Erro ao carregar opcoes de cidade e segmento';
        setErrorMessage(message);
        setCities([]);
        setSegments([]);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  return {
    isLoading,
    errorMessage,
    cities,
    segments,
  };
}
