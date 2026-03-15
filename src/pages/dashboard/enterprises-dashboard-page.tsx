import { AdminShell } from '../../components/layout/admin-shell';
import {
  FiltersInline,
  PanelCard,
  PanelHeader,
  TableFooter,
  TableFooterMeta,
  TablePagination,
  TableState,
  TableWrap,
} from './enterprises-dashboard-page.styles';
import { useSegmentsList } from '../../hooks/use-segments-list';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActionsCell,
  DangerButton,
  GhostButton,
  IconActionButton,
  ModalBackdrop,
  ModalBody,
  ModalCard,
  ModalError,
  ModalFooter,
  ModalHeader,
  PrimaryButton,
  RowActions,
  ContactsSummaryButton,
  ContactsList,
  StatusBadgeButton,
  Toast,
} from './enterprises-dashboard-page.styles';
import { getAuthUser, getAccessToken, clearAuthSession } from '../../services/auth-session';
import { useToast } from '../../hooks/use-toast';
import { useCitiesList } from '../../hooks/use-cities-list';
import { useScMunicipalities } from '../../hooks/use-sc-municipalities';
import { SelectField } from '../../components/form/select-field';
import { useEnterprisesList } from '../../hooks/use-enterprises-list';
import { useEnterpriseReferenceOptions } from '../../hooks/use-enterprise-reference-options';

type EnterprisesDashboardPageProps = {
  activeModule: 'companies' | 'cities' | 'segments';
  onChangeModule: (module: 'companies' | 'cities' | 'segments') => void;
};

function computeVisibleRange(
  page: number,
  limit: number,
  total: number,
): { first: number; last: number } {
  if (total === 0) {
    return { first: 0, last: 0 };
  }

  const first = (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return { first, last };
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) {
    return '-';
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsedDate);
}

function getSortIndicator(
  currentSort: 'name' | 'createdAt' | 'updatedAt',
  targetSort: 'name' | 'createdAt' | 'updatedAt',
  order: 'ASC' | 'DESC',
): string {
  if (currentSort !== targetSort) {
    return '↕';
  }

  return order === 'ASC' ? '↑' : '↓';
}

export function EnterprisesDashboardPage({
  activeModule,
  onChangeModule,
}: EnterprisesDashboardPageProps) {
  const navigate = useNavigate();
  const token = typeof window === 'undefined' ? null : getAccessToken();
  const authUser = typeof window === 'undefined' ? null : getAuthUser();
  const canWrite = authUser?.role === 'admin' || authUser?.role === 'editor';
  const canDelete = authUser?.role === 'admin';
  const { toast, showToast } = useToast();
  const {
    items: segments,
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
  } = useSegmentsList(token);
  const {
    items: cities,
    isLoading: isLoadingCities,
    errorMessage: errorCities,
    filters: cityFilters,
    page: cityPage,
    total: cityTotal,
    totalPages: cityTotalPages,
    setNameFilter: setCityNameFilter,
    setLimit: setCityLimit,
    setSort: setCitySort,
    toggleOrder: toggleCityOrder,
    goToPage: goToCityPage,
    unauthorized: unauthorizedCities,
    mutationError: cityMutationError,
    clearMutationError: clearCityMutationError,
    createItem: createCity,
    updateItem: updateCity,
    deleteItem: deleteCity,
  } = useCitiesList(token);
  const {
    items: enterprises,
    isLoading: isLoadingEnterprises,
    errorMessage: errorEnterprises,
    filters: enterpriseFilters,
    page: enterprisePage,
    total: enterpriseTotal,
    totalPages: enterpriseTotalPages,
    setCityFilter: setEnterpriseCityFilter,
    setSegmentFilter: setEnterpriseSegmentFilter,
    setLimit: setEnterpriseLimit,
    setSort: setEnterpriseSort,
    toggleOrder: toggleEnterpriseOrder,
    goToPage: goToEnterprisePage,
    unauthorized: unauthorizedEnterprises,
    updateItem: updateEnterprise,
    deleteItem: deleteEnterprise,
    mutationError: enterpriseMutationError,
  } = useEnterprisesList(token);
  const {
    isLoading: isLoadingEnterpriseReferences,
    cities: enterpriseCities,
    segments: enterpriseSegments,
  } = useEnterpriseReferenceOptions(token);
  const {
    isLoading: isLoadingScMunicipalities,
    errorMessage: scMunicipalitiesError,
    states,
    selectedStateCode,
    setSelectedStateCode,
    options: scMunicipalityOptions,
    findStateCodeByMunicipalityName,
  } = useScMunicipalities();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [deletingSegmentId, setDeletingSegmentId] = useState<string | null>(null);
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [deletingCityId, setDeletingCityId] = useState<string | null>(null);
  const [deletingEnterpriseId, setDeletingEnterpriseId] = useState<string | null>(null);
  const [viewingEnterpriseContactsId, setViewingEnterpriseContactsId] = useState<string | null>(
    null,
  );
  const [formName, setFormName] = useState('');

  const visibleRange = computeVisibleRange(page, filters.limit, total);
  const hasItems = total > 0;
  const cityVisibleRange = computeVisibleRange(cityPage, cityFilters.limit, cityTotal);
  const cityHasItems = cityTotal > 0;
  const enterpriseVisibleRange = computeVisibleRange(
    enterprisePage,
    enterpriseFilters.limit,
    enterpriseTotal,
  );
  const enterpriseHasItems = enterpriseTotal > 0;

  useEffect(() => {
    if (!unauthorized && !unauthorizedCities && !unauthorizedEnterprises) {
      return;
    }

    clearAuthSession();
    navigate('/login', { replace: true });
  }, [unauthorized, unauthorizedCities, unauthorizedEnterprises, navigate]);

  useEffect(() => {
    if (!mutationError && !cityMutationError) {
      return;
    }

    const timeout = window.setTimeout(() => {
      clearMutationError();
      clearCityMutationError();
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [mutationError, cityMutationError, clearMutationError, clearCityMutationError]);

  function openCreateModal(): void {
    setFormName('');
    setIsCreateOpen(true);
    setEditingSegmentId(null);
    setEditingCityId(null);
    clearMutationError();
    clearCityMutationError();
  }

  function openEditModal(id: string, currentName: string): void {
    setFormName(currentName);
    setEditingSegmentId(id);
    setIsCreateOpen(false);
    clearMutationError();
  }

  function openCityEditModal(id: string, currentName: string): void {
    setFormName(currentName);
    setEditingCityId(id);
    setIsCreateOpen(false);
    clearCityMutationError();

    void (async () => {
      try {
        const stateCode = await findStateCodeByMunicipalityName(currentName);
        setSelectedStateCode(stateCode ?? '');
      } catch {
        setSelectedStateCode('');
      }
    })();
  }

  function closeCreateModal(): void {
    setIsCreateOpen(false);
    setFormName('');
    clearMutationError();
    clearCityMutationError();
  }

  function closeEditModal(): void {
    setEditingSegmentId(null);
    setFormName('');
    clearMutationError();
  }

  function closeCityEditModal(): void {
    setEditingCityId(null);
    setFormName('');
    clearCityMutationError();
  }

  function handleCityHeaderSort(
    sort: 'name' | 'createdAt' | 'updatedAt',
  ): void {
    if (cityFilters.sort === sort) {
      toggleCityOrder();
      return;
    }

    setCitySort(sort);
  }

  function handleSegmentHeaderSort(
    sort: 'name' | 'createdAt' | 'updatedAt',
  ): void {
    if (filters.sort === sort) {
      toggleOrder();
      return;
    }

    setSort(sort);
  }

  function handleEnterpriseHeaderSort(
    sort: 'name' | 'ownerName' | 'active' | 'cityName' | 'segmentName',
  ): void {
    if (enterpriseFilters.sort === sort) {
      toggleEnterpriseOrder();
      return;
    }

    setEnterpriseSort(sort);
  }

  async function handleToggleEnterpriseStatus(
    id: string,
    nextActive: boolean,
  ): Promise<void> {
    const enterprise = enterprises.find((item) => item.id === id);

    if (!enterprise) {
      return;
    }

    const success = await updateEnterprise(id, {
      name: enterprise.name,
      ownerName: enterprise.ownerName,
      cityId: enterprise.city?.id,
      segmentId: enterprise.segment?.id,
      active: nextActive,
    });

    if (success) {
      showToast('success', nextActive ? 'Empresa ativada com sucesso.' : 'Empresa desativada com sucesso.');
    } else {
      showToast('error', enterpriseMutationError || 'Nao foi possivel atualizar o status da empresa.');
    }
  }

  async function handleCreateSubmit(): Promise<void> {
    const name = formName.trim();

    if (!name) {
      return;
    }

    if (activeModule === 'cities') {
      const successCity = await createCity(name);
      if (successCity) {
        closeCreateModal();
        showToast('success', 'Municipio criado com sucesso.');
      } else {
        showToast('error', cityMutationError || 'Nao foi possivel criar o municipio.');
      }
      return;
    }

    const success = await createItem(name);
    if (success) {
      closeCreateModal();
      showToast('success', 'Segmento criado com sucesso.');
    } else {
      showToast('error', mutationError || 'Nao foi possivel criar o segmento.');
    }
  }

  async function handleUpdateSubmit(): Promise<void> {
    if (activeModule === 'cities') {
      if (!editingCityId) {
        return;
      }

      const name = formName.trim();
      if (!name) {
        return;
      }

      const successCity = await updateCity(editingCityId, name);
      if (successCity) {
        closeCityEditModal();
        showToast('success', 'Municipio atualizado com sucesso.');
      } else {
        showToast('error', cityMutationError || 'Nao foi possivel atualizar o municipio.');
      }
      return;
    }

    if (!editingSegmentId) {
      return;
    }

    const name = formName.trim();

    if (!name) {
      return;
    }

    const success = await updateItem(editingSegmentId, name);
    if (success) {
      closeEditModal();
      showToast('success', 'Segmento atualizado com sucesso.');
    } else {
      showToast('error', mutationError || 'Nao foi possivel atualizar o segmento.');
    }
  }

  async function handleDeleteConfirm(): Promise<void> {
    if (activeModule === 'companies') {
      if (!deletingEnterpriseId) {
        return;
      }

      const successEnterprise = await deleteEnterprise(deletingEnterpriseId);
      if (successEnterprise) {
        setDeletingEnterpriseId(null);
        showToast('success', 'Empresa excluida com sucesso.');
      } else {
        showToast('error', enterpriseMutationError || 'Nao foi possivel excluir a empresa.');
      }
      return;
    }

    if (activeModule === 'cities') {
      if (!deletingCityId) {
        return;
      }

      const successCity = await deleteCity(deletingCityId);
      if (successCity) {
        setDeletingCityId(null);
        showToast('success', 'Municipio excluido com sucesso.');
      } else {
        showToast('error', cityMutationError || 'Nao foi possivel excluir o municipio.');
      }
      return;
    }

    if (!deletingSegmentId) {
      return;
    }

    const success = await deleteItem(deletingSegmentId);
    if (success) {
      setDeletingSegmentId(null);
      showToast('success', 'Segmento excluido com sucesso.');
    } else {
      showToast('error', mutationError || 'Nao foi possivel excluir o segmento.');
    }
  }

  function handleLogout(): void {
    clearAuthSession();
    navigate('/login', { replace: true });
  }

  function handleCreateEnterprise(): void {
    navigate('/enterprises/new');
  }

  function handleEditEnterprise(id: string): void {
    navigate(`/enterprises/${id}/edit`);
  }

  const viewingEnterprise =
    viewingEnterpriseContactsId !== null
      ? enterprises.find((enterprise) => enterprise.id === viewingEnterpriseContactsId) ?? null
      : null;

  if (activeModule === 'companies') {
    return (
      <AdminShell
        activeModule={activeModule}
        onChangeModule={onChangeModule}
        onCreateClick={canWrite ? handleCreateEnterprise : undefined}
        canCreate={canWrite}
        userName={authUser?.name}
        userRole={authUser?.role ?? null}
        onLogout={handleLogout}
      >
        <PanelCard>
          <PanelHeader>
            <h2>Empresas</h2>

            <FiltersInline>
              <select
                value={enterpriseFilters.cityId}
                onChange={(event) => setEnterpriseCityFilter(event.target.value)}
                disabled={isLoadingEnterpriseReferences}
              >
                <option value="">Todos os municipios</option>
                {enterpriseCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <select
                value={enterpriseFilters.segmentId}
                onChange={(event) => setEnterpriseSegmentFilter(event.target.value)}
                disabled={isLoadingEnterpriseReferences}
              >
                <option value="">Todos os segmentos</option>
                {enterpriseSegments.map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.name}
                  </option>
                ))}
              </select>
            </FiltersInline>
          </PanelHeader>

          <TableWrap>
            {isLoadingEnterprises ? <TableState>Carregando empresas...</TableState> : null}
            {!isLoadingEnterprises && errorEnterprises ? (
              <TableState>{errorEnterprises}</TableState>
            ) : null}

            {!isLoadingEnterprises && !errorEnterprises ? (
              <table>
                <thead>
                  <tr>
                    <th
                      data-sortable="true"
                      onClick={() => handleEnterpriseHeaderSort('name')}
                    >
                      Nome{' '}
                      <span className="sort-indicator">
                        {getSortIndicator(
                          enterpriseFilters.sort as 'name' | 'createdAt' | 'updatedAt',
                          'name',
                          enterpriseFilters.order,
                        )}
                      </span>
                    </th>
                    <th
                      data-sortable="true"
                      onClick={() => handleEnterpriseHeaderSort('ownerName')}
                    >
                      Responsavel{' '}
                      <span className="sort-indicator">
                        {enterpriseFilters.sort === 'ownerName'
                          ? enterpriseFilters.order === 'ASC'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </span>
                    </th>
                    <th
                      data-sortable="true"
                      onClick={() => handleEnterpriseHeaderSort('cityName')}
                    >
                      Municipio{' '}
                      <span className="sort-indicator">
                        {enterpriseFilters.sort === 'cityName'
                          ? enterpriseFilters.order === 'ASC'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </span>
                    </th>
                    <th
                      data-sortable="true"
                      onClick={() => handleEnterpriseHeaderSort('segmentName')}
                    >
                      Segmento{' '}
                      <span className="sort-indicator">
                        {enterpriseFilters.sort === 'segmentName'
                          ? enterpriseFilters.order === 'ASC'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </span>
                    </th>
                    <th
                      data-sortable="true"
                      onClick={() => handleEnterpriseHeaderSort('active')}
                    >
                      Status{' '}
                      <span className="sort-indicator">
                        {enterpriseFilters.sort === 'active'
                          ? enterpriseFilters.order === 'ASC'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </span>
                    </th>
                    <th>Contatos</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {enterprises.length > 0 ? (
                    enterprises.map((enterprise) => (
                      <tr key={enterprise.id}>
                        <td>{enterprise.name}</td>
                        <td>{enterprise.ownerName}</td>
                        <td>{enterprise.city?.name ?? '-'}</td>
                        <td>{enterprise.segment?.name ?? '-'}</td>
                        <td>
                          <StatusBadgeButton
                            type="button"
                            $active={enterprise.active}
                            title={
                              enterprise.active
                                ? 'Clique para desativar esta empresa'
                                : 'Clique para ativar esta empresa'
                            }
                            disabled={!canWrite}
                            onClick={() => void handleToggleEnterpriseStatus(enterprise.id, !enterprise.active)}
                          >
                            {enterprise.active ? 'Ativa' : 'Inativa'}
                          </StatusBadgeButton>
                        </td>
                        <td>
                          <ContactsSummaryButton
                            type="button"
                            onClick={() => setViewingEnterpriseContactsId(enterprise.id)}
                          >
                            {(enterprise.contacts[0]?.name || 'Sem contato')}
                            {enterprise.contacts.length > 1 ? ` +${enterprise.contacts.length - 1}` : ''}
                          </ContactsSummaryButton>
                        </td>
                        <ActionsCell>
                          <RowActions>
                            <IconActionButton
                              type="button"
                              aria-label="Editar empresa"
                              title="Editar"
                              onClick={() => handleEditEnterprise(enterprise.id)}
                              disabled={!canWrite}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  d="M4 20h4l10-10-4-4L4 16v4zM13 7l4 4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </IconActionButton>

                            <IconActionButton
                              type="button"
                              $danger
                              aria-label="Excluir empresa"
                              title="Excluir"
                              onClick={() => setDeletingEnterpriseId(enterprise.id)}
                              disabled={!canDelete}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  d="M5 7h14M9 7V5h6v2M9 10v7M15 10v7M7 7l1 12h8l1-12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </IconActionButton>
                          </RowActions>
                        </ActionsCell>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>Nenhuma empresa encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : null}
          </TableWrap>

          <TableFooter>
            <TableFooterMeta>
              <p>
                Pagina {enterpriseHasItems ? enterprisePage : 0} de{' '}
                {enterpriseHasItems ? enterpriseTotalPages : 0}
              </p>
              <label htmlFor="enterprise-page-size">Itens por pagina</label>
              <select
                id="enterprise-page-size"
                value={String(enterpriseFilters.limit)}
                onChange={(event) => setEnterpriseLimit(Number(event.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <p>
                Mostrando {enterpriseVisibleRange.first} a {enterpriseVisibleRange.last} de{' '}
                {enterpriseTotal} empresas
              </p>
            </TableFooterMeta>

            <TablePagination>
              <button
                type="button"
                onClick={() => goToEnterprisePage(enterprisePage - 1)}
                disabled={enterprisePage <= 1}
              >
                Anterior
              </button>
              <button type="button" className="active">
                {enterprisePage}
              </button>
              <button
                type="button"
                onClick={() => goToEnterprisePage(enterprisePage + 1)}
                disabled={enterprisePage >= enterpriseTotalPages}
              >
                Proxima
              </button>
            </TablePagination>
          </TableFooter>
        </PanelCard>

        {deletingEnterpriseId && canDelete ? (
          <ModalBackdrop>
            <ModalCard>
              <ModalHeader>
                <h3>Confirmar exclusao</h3>
              </ModalHeader>

              <ModalBody>
                <p>Deseja realmente excluir esta empresa?</p>
                {enterpriseMutationError ? <ModalError>{enterpriseMutationError}</ModalError> : null}
              </ModalBody>

              <ModalFooter>
                <GhostButton type="button" onClick={() => setDeletingEnterpriseId(null)}>
                  Cancelar
                </GhostButton>
                <DangerButton type="button" onClick={() => void handleDeleteConfirm()}>
                  Excluir
                </DangerButton>
              </ModalFooter>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {viewingEnterprise ? (
          <ModalBackdrop>
            <ModalCard>
              <ModalHeader>
                <h3>Contatos da empresa</h3>
              </ModalHeader>

              <ModalBody>
                {viewingEnterprise.contacts.length > 0 ? (
                  <ContactsList>
                    {viewingEnterprise.contacts.map((contact) => (
                      <li key={contact.id}>
                        <strong>
                          {contact.name?.trim() || 'Contato sem nome'}
                          {' - '}
                          {contact.department?.trim() || 'Sem departamento'}
                        </strong>
                        <small>
                          Emails:{' '}
                          {contact.emails.map((email) => email.address).join(', ') || '-'}
                        </small>
                        <small>
                          Telefones:{' '}
                          {contact.phones.map((phone) => phone.number).join(', ') || '-'}
                        </small>
                      </li>
                    ))}
                  </ContactsList>
                ) : (
                  <p>Esta empresa nao possui contatos cadastrados.</p>
                )}
              </ModalBody>

              <ModalFooter>
                <GhostButton type="button" onClick={() => setViewingEnterpriseContactsId(null)}>
                  Fechar
                </GhostButton>
              </ModalFooter>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {toast.visible ? <Toast $type={toast.type}>{toast.message}</Toast> : null}
      </AdminShell>
    );
  }

  if (activeModule === 'cities') {
    return (
      <AdminShell
        activeModule={activeModule}
        onChangeModule={onChangeModule}
        onCreateClick={canWrite ? openCreateModal : undefined}
        canCreate={canWrite}
        userName={authUser?.name}
        userRole={authUser?.role ?? null}
        onLogout={handleLogout}
      >
        <PanelCard>
          <PanelHeader>
            <h2>Municipios</h2>

            <FiltersInline>
              <input
                type="search"
                placeholder="Buscar por nome"
                value={cityFilters.name}
                onChange={(event) => setCityNameFilter(event.target.value)}
              />
            </FiltersInline>
          </PanelHeader>

          <TableWrap>
            {isLoadingCities ? <TableState>Carregando municipios...</TableState> : null}

            {!isLoadingCities && errorCities ? <TableState>{errorCities}</TableState> : null}

            {!isLoadingCities && !errorCities ? (
              <table>
                <thead>
                  <tr>
                    <th
                      data-sortable="true"
                      onClick={() => handleCityHeaderSort('name')}
                      aria-sort={
                        cityFilters.sort === 'name'
                          ? cityFilters.order === 'ASC'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      Nome <span className="sort-indicator">{getSortIndicator(cityFilters.sort, 'name', cityFilters.order)}</span>
                    </th>
                    <th
                      data-sortable="true"
                      onClick={() => handleCityHeaderSort('createdAt')}
                      aria-sort={
                        cityFilters.sort === 'createdAt'
                          ? cityFilters.order === 'ASC'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      Criado em <span className="sort-indicator">{getSortIndicator(cityFilters.sort, 'createdAt', cityFilters.order)}</span>
                    </th>
                    <th
                      data-sortable="true"
                      onClick={() => handleCityHeaderSort('updatedAt')}
                      aria-sort={
                        cityFilters.sort === 'updatedAt'
                          ? cityFilters.order === 'ASC'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      Atualizado em <span className="sort-indicator">{getSortIndicator(cityFilters.sort, 'updatedAt', cityFilters.order)}</span>
                    </th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.length > 0 ? (
                    cities.map((city) => (
                      <tr key={city.id}>
                        <td>{city.name}</td>
                        <td>{formatDate(city.createdAt)}</td>
                        <td>{formatDate(city.updatedAt)}</td>
                        <ActionsCell>
                          <RowActions>
                            <IconActionButton
                              type="button"
                              aria-label="Editar municipio"
                              title="Editar"
                              onClick={() => openCityEditModal(city.id, city.name)}
                              disabled={!canWrite}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  d="M4 20h4l10-10-4-4L4 16v4zM13 7l4 4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </IconActionButton>

                            <IconActionButton
                              type="button"
                              $danger
                              aria-label="Excluir municipio"
                              title="Excluir"
                              onClick={() => setDeletingCityId(city.id)}
                              disabled={!canDelete}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  d="M5 7h14M9 7V5h6v2M9 10v7M15 10v7M7 7l1 12h8l1-12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </IconActionButton>
                          </RowActions>
                        </ActionsCell>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>Nenhum municipio encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : null}
          </TableWrap>

          <TableFooter>
            <TableFooterMeta>
              <p>
                Pagina {cityHasItems ? cityPage : 0} de {cityHasItems ? cityTotalPages : 0}
              </p>
              <label htmlFor="city-page-size">Itens por pagina</label>
              <select
                id="city-page-size"
                value={String(cityFilters.limit)}
                onChange={(event) => setCityLimit(Number(event.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <p>
                Mostrando {cityVisibleRange.first} a {cityVisibleRange.last} de {cityTotal} municipios
              </p>
            </TableFooterMeta>

            <TablePagination>
              <button
                type="button"
                onClick={() => goToCityPage(cityPage - 1)}
                disabled={cityPage <= 1}
              >
                Anterior
              </button>
              <button type="button" className="active">
                {cityPage}
              </button>
              <button
                type="button"
                onClick={() => goToCityPage(cityPage + 1)}
                disabled={cityPage >= cityTotalPages}
              >
                Proxima
              </button>
            </TablePagination>
          </TableFooter>
        </PanelCard>

        {isCreateOpen && canWrite ? (
          <ModalBackdrop>
            <ModalCard>
              <ModalHeader>
                <h3>Novo municipio</h3>
              </ModalHeader>

              <ModalBody>
                <SelectField
                  id="city-create-state"
                  label="Estado"
                  value={selectedStateCode}
                  onChange={setSelectedStateCode}
                  disabled={isLoadingScMunicipalities || states.length === 0}
                  filterPlaceholder="Digite para filtrar estados"
                  emptyText="Nenhum estado encontrado"
                  options={states.map((state) => ({
                    value: state.code,
                    label: state.name,
                  }))}
                />

                <SelectField
                  id="city-create-select"
                  label="Municipio"
                  value={formName}
                  onChange={setFormName}
                  disabled={isLoadingScMunicipalities || Boolean(scMunicipalitiesError)}
                  filterPlaceholder="Digite para filtrar municipios"
                  emptyText="Nenhum municipio encontrado"
                  helperText="Opcoes desabilitadas ja estao cadastradas no sistema"
                  options={scMunicipalityOptions.map((option) => {
                    const alreadyRegistered = cities.some(
                      (city) =>
                        city.name.trim().toLocaleLowerCase('pt-BR') ===
                        option.name.trim().toLocaleLowerCase('pt-BR'),
                    );

                    return {
                      value: option.name,
                      label: option.name,
                      disabled: alreadyRegistered,
                      tooltip: alreadyRegistered
                        ? 'Municipio ja cadastrado'
                        : undefined,
                    };
                  })}
                />

                {isLoadingScMunicipalities ? (
                  <p>Carregando municipios de Santa Catarina...</p>
                ) : null}
                {scMunicipalitiesError ? <ModalError>{scMunicipalitiesError}</ModalError> : null}
                {cityMutationError ? <ModalError>{cityMutationError}</ModalError> : null}
              </ModalBody>

              <ModalFooter>
                <GhostButton type="button" onClick={closeCreateModal}>
                  Cancelar
                </GhostButton>
                <PrimaryButton type="button" onClick={() => void handleCreateSubmit()}>
                  Criar
                </PrimaryButton>
              </ModalFooter>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {editingCityId && canWrite ? (
          <ModalBackdrop>
            <ModalCard>
              <ModalHeader>
                <h3>Atualizar municipio</h3>
              </ModalHeader>

              <ModalBody>
                <SelectField
                  id="city-edit-state"
                  label="Estado"
                  value={selectedStateCode}
                  onChange={setSelectedStateCode}
                  disabled={isLoadingScMunicipalities || states.length === 0}
                  filterPlaceholder="Digite para filtrar estados"
                  emptyText="Nenhum estado encontrado"
                  options={states.map((state) => ({
                    value: state.code,
                    label: state.name,
                  }))}
                />

                <SelectField
                  id="city-edit-select"
                  label="Municipio"
                  value={formName}
                  onChange={setFormName}
                  disabled={isLoadingScMunicipalities || Boolean(scMunicipalitiesError)}
                  filterPlaceholder="Digite para filtrar municipios"
                  emptyText="Nenhum municipio encontrado"
                  helperText="Opcoes desabilitadas ja estao cadastradas no sistema"
                  options={scMunicipalityOptions.map((option) => {
                    const alreadyRegistered = cities.some(
                      (city) =>
                        city.id !== editingCityId &&
                        city.name.trim().toLocaleLowerCase('pt-BR') ===
                          option.name.trim().toLocaleLowerCase('pt-BR'),
                    );

                    return {
                      value: option.name,
                      label: option.name,
                      disabled: alreadyRegistered,
                      tooltip: alreadyRegistered
                        ? 'Municipio ja cadastrado'
                        : undefined,
                    };
                  })}
                />

                {isLoadingScMunicipalities ? (
                  <p>Carregando municipios de Santa Catarina...</p>
                ) : null}
                {scMunicipalitiesError ? <ModalError>{scMunicipalitiesError}</ModalError> : null}
                {cityMutationError ? <ModalError>{cityMutationError}</ModalError> : null}
              </ModalBody>

              <ModalFooter>
                <GhostButton type="button" onClick={closeCityEditModal}>
                  Cancelar
                </GhostButton>
                <PrimaryButton type="button" onClick={() => void handleUpdateSubmit()}>
                  Salvar
                </PrimaryButton>
              </ModalFooter>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {deletingCityId && canDelete ? (
          <ModalBackdrop>
            <ModalCard>
              <ModalHeader>
                <h3>Confirmar exclusao</h3>
              </ModalHeader>

              <ModalBody>
                <p>Deseja realmente excluir este municipio?</p>
                {cityMutationError ? <ModalError>{cityMutationError}</ModalError> : null}
              </ModalBody>

              <ModalFooter>
                <GhostButton type="button" onClick={() => setDeletingCityId(null)}>
                  Cancelar
                </GhostButton>
                <DangerButton type="button" onClick={() => void handleDeleteConfirm()}>
                  Excluir
                </DangerButton>
              </ModalFooter>
            </ModalCard>
          </ModalBackdrop>
        ) : null}

        {toast.visible ? <Toast $type={toast.type}>{toast.message}</Toast> : null}
      </AdminShell>
    );
  }

  if (activeModule !== 'segments') {
    return null;
  }

  return (
      <AdminShell
        activeModule={activeModule}
        onChangeModule={onChangeModule}
        onCreateClick={canWrite ? openCreateModal : undefined}
        canCreate={canWrite}
        userName={authUser?.name}
        userRole={authUser?.role ?? null}
        onLogout={handleLogout}
      >
      <PanelCard>
        <PanelHeader>
          <h2>Segmentos</h2>

          <FiltersInline>
            <input
              type="search"
              placeholder="Buscar por nome"
              value={filters.name}
              onChange={(event) => setNameFilter(event.target.value)}
            />
          </FiltersInline>

        </PanelHeader>

        <TableWrap>
          {isLoading ? <TableState>Carregando segmentos...</TableState> : null}

          {!isLoading && errorMessage ? (
            <TableState>{errorMessage}</TableState>
          ) : null}

          {!isLoading && !errorMessage ? (
            <table>
                <thead>
                <tr>
                  <th
                    data-sortable="true"
                    onClick={() => handleSegmentHeaderSort('name')}
                    aria-sort={
                      filters.sort === 'name'
                        ? filters.order === 'ASC'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    Nome <span className="sort-indicator">{getSortIndicator(filters.sort, 'name', filters.order)}</span>
                  </th>
                  <th
                    data-sortable="true"
                    onClick={() => handleSegmentHeaderSort('createdAt')}
                    aria-sort={
                      filters.sort === 'createdAt'
                        ? filters.order === 'ASC'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    Criado em <span className="sort-indicator">{getSortIndicator(filters.sort, 'createdAt', filters.order)}</span>
                  </th>
                  <th
                    data-sortable="true"
                    onClick={() => handleSegmentHeaderSort('updatedAt')}
                    aria-sort={
                      filters.sort === 'updatedAt'
                        ? filters.order === 'ASC'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    Atualizado em <span className="sort-indicator">{getSortIndicator(filters.sort, 'updatedAt', filters.order)}</span>
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {segments.length > 0 ? (
                  segments.map((segment) => (
                    <tr key={segment.id}>
                      <td>{segment.name}</td>
                      <td>{formatDate(segment.createdAt)}</td>
                      <td>{formatDate(segment.updatedAt)}</td>
                      <ActionsCell>
                        <RowActions>
                          <IconActionButton
                            type="button"
                            aria-label="Editar segmento"
                            title="Editar"
                            onClick={() => openEditModal(segment.id, segment.name)}
                            disabled={!canWrite}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                d="M4 20h4l10-10-4-4L4 16v4zM13 7l4 4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </IconActionButton>

                          <IconActionButton
                            type="button"
                            $danger
                            aria-label="Excluir segmento"
                            title="Excluir"
                            onClick={() => setDeletingSegmentId(segment.id)}
                            disabled={!canDelete}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                d="M5 7h14M9 7V5h6v2M9 10v7M15 10v7M7 7l1 12h8l1-12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </IconActionButton>
                        </RowActions>
                      </ActionsCell>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>Nenhum segmento encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : null}
        </TableWrap>

        <TableFooter>
          <TableFooterMeta>
            <p>
              Pagina {hasItems ? page : 0} de {hasItems ? totalPages : 0}
            </p>
            <label htmlFor="page-size">Itens por pagina</label>
            <select
              id="page-size"
              value={String(filters.limit)}
              onChange={(event) => setLimit(Number(event.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <p>
              Mostrando {visibleRange.first} a {visibleRange.last} de {total} segmentos
            </p>
          </TableFooterMeta>

          <TablePagination>
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              Anterior
            </button>
            <button type="button" className="active">
              {page}
            </button>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              Proxima
            </button>
          </TablePagination>
        </TableFooter>
      </PanelCard>

      {isCreateOpen && canWrite ? (
        <ModalBackdrop>
          <ModalCard>
            <ModalHeader>
              <h3>Novo segmento</h3>
            </ModalHeader>

            <ModalBody>
              <label htmlFor="segment-create-name">Nome</label>
              <input
                id="segment-create-name"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                placeholder="Informe o nome do segmento"
              />
              {mutationError ? <ModalError>{mutationError}</ModalError> : null}
            </ModalBody>

            <ModalFooter>
              <GhostButton type="button" onClick={closeCreateModal}>
                Cancelar
              </GhostButton>
              <PrimaryButton type="button" onClick={() => void handleCreateSubmit()}>
                Criar
              </PrimaryButton>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      ) : null}

      {editingSegmentId && canWrite ? (
        <ModalBackdrop>
          <ModalCard>
            <ModalHeader>
              <h3>Atualizar segmento</h3>
            </ModalHeader>

            <ModalBody>
              <label htmlFor="segment-edit-name">Nome</label>
              <input
                id="segment-edit-name"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                placeholder="Informe o nome do segmento"
              />
              {mutationError ? <ModalError>{mutationError}</ModalError> : null}
            </ModalBody>

            <ModalFooter>
              <GhostButton type="button" onClick={closeEditModal}>
                Cancelar
              </GhostButton>
              <PrimaryButton type="button" onClick={() => void handleUpdateSubmit()}>
                Salvar
              </PrimaryButton>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      ) : null}

      {deletingSegmentId && canDelete ? (
        <ModalBackdrop>
          <ModalCard>
            <ModalHeader>
              <h3>Confirmar exclusao</h3>
            </ModalHeader>

            <ModalBody>
              <p>Deseja realmente excluir este segmento?</p>
              {mutationError ? <ModalError>{mutationError}</ModalError> : null}
            </ModalBody>

            <ModalFooter>
              <GhostButton type="button" onClick={() => setDeletingSegmentId(null)}>
                Cancelar
              </GhostButton>
              <DangerButton type="button" onClick={() => void handleDeleteConfirm()}>
                Excluir
              </DangerButton>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      ) : null}

      {toast.visible ? <Toast $type={toast.type}>{toast.message}</Toast> : null}
    </AdminShell>
  );
}
