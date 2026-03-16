import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listBrazilianStates,
  listMunicipalitiesByState,
  type BrazilianState,
  type StateMunicipality,
} from '../services/api/address-api';

type UseScMunicipalitiesResult = {
  isLoading: boolean;
  errorMessage: string;
  states: BrazilianState[];
  selectedStateCode: string;
  setSelectedStateCode: (value: string) => void;
  options: StateMunicipality[];
  findStateCodeByMunicipalityName: (name: string) => Promise<string | null>;
};

export function useScMunicipalities(): UseScMunicipalitiesResult {
  const [states, setStates] = useState<BrazilianState[]>([]);
  const [selectedStateCode, setSelectedStateCode] = useState('SC');
  const [allMunicipalities, setAllMunicipalities] = useState<StateMunicipality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    void listBrazilianStates()
      .then((loadedStates) => {
        if (!active) {
          return;
        }

        setStates(loadedStates);

        const defaultState = loadedStates.find((state) => state.code === 'SC');
        const fallbackState = loadedStates[0];
        const selectedState = defaultState ?? fallbackState;

        if (!selectedState) {
          setAllMunicipalities([]);
          setErrorMessage('Nenhum estado disponivel para carregar municipios');
          return;
        }

        setSelectedStateCode(selectedState.code);
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Erro ao carregar estados do Brasil';

        setErrorMessage(message);
        setAllMunicipalities([]);
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
  }, []);

  useEffect(() => {
    if (states.length === 0) {
      setAllMunicipalities([]);
      return;
    }

    const selectedState = states.find((state) => state.code === selectedStateCode);

    if (!selectedState) {
      setAllMunicipalities([]);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    void listMunicipalitiesByState(
      selectedState.id,
      selectedState.code,
      selectedState.name,
    )
      .then((items) => {
        if (!active) {
          return;
        }

        setAllMunicipalities(items);
        setErrorMessage('');
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Erro ao carregar municipios';

        setErrorMessage(message);
        setAllMunicipalities([]);
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
  }, [states, selectedStateCode]);

  const findStateCodeByMunicipalityName = useCallback(
    async (name: string): Promise<string | null> => {
      const normalizedTarget = name.trim().toLocaleLowerCase('pt-BR');

      if (!normalizedTarget) {
        return null;
      }

      let statesPool = states;

      if (statesPool.length === 0) {
        statesPool = await listBrazilianStates();
        setStates(statesPool);
      }

      for (const state of statesPool) {
        const municipalities = await listMunicipalitiesByState(
          state.id,
          state.code,
          state.name,
        );

        const hasMatch = municipalities.some(
          (municipality) =>
            municipality.name.trim().toLocaleLowerCase('pt-BR') === normalizedTarget,
        );

        if (hasMatch) {
          return state.code;
        }
      }

      return null;
    },
    [states],
  );

  const options = useMemo(() => allMunicipalities, [allMunicipalities]);

  return {
    isLoading,
    errorMessage,
    states,
    selectedStateCode,
    setSelectedStateCode,
    options,
    findStateCodeByMunicipalityName,
  };
}
