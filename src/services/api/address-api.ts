export type StateMunicipality = {
  id: number;
  name: string;
  stateCode: string;
  stateName: string;
};

export type BrazilianState = {
  id: number;
  code: string;
  name: string;
};

type IbgeState = {
  id: number;
  sigla: string;
  nome: string;
};

type IbgeMunicipalityPayload = {
  id: number;
  nome: string;
};

const IBGE_STATES_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export async function listBrazilianStates(): Promise<BrazilianState[]> {
  const response = await fetch(IBGE_STATES_URL);

  if (!response.ok) {
    throw new Error('Falha ao carregar estados do Brasil');
  }

  const payload = (await response.json()) as IbgeState[];

  return payload
    .map((item) => ({
      id: item.id,
      code: item.sigla,
      name: item.nome,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export async function listMunicipalitiesByState(
  stateId: number,
  stateCode: string,
  stateName: string,
): Promise<StateMunicipality[]> {
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`,
  );

  if (!response.ok) {
    throw new Error('Falha ao carregar municipios do estado selecionado');
  }

  const payload = (await response.json()) as IbgeMunicipalityPayload[];

  return payload
    .map((item) => ({
      id: item.id,
      name: item.nome,
      stateCode,
      stateName,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}
