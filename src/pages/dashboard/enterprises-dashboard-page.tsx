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
  Toast,
} from './enterprises-dashboard-page.styles';
import { getAuthUser, getAccessToken, clearAuthSession } from '../../services/auth-session';
import { useToast } from '../../hooks/use-toast';

type EnterprisesDashboardPageProps = {
  activeModule: 'companies' | 'segments';
  onChangeModule: (module: 'companies' | 'segments') => void;
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

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
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
    goToPage,
    unauthorized,
    mutationError,
    clearMutationError,
    createItem,
    updateItem,
    deleteItem,
  } = useSegmentsList(token);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [deletingSegmentId, setDeletingSegmentId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');

  const visibleRange = computeVisibleRange(page, filters.limit, total);
  const hasItems = total > 0;

  useEffect(() => {
    if (!unauthorized) {
      return;
    }

    clearAuthSession();
    navigate('/login', { replace: true });
  }, [unauthorized, navigate]);

  useEffect(() => {
    if (!mutationError) {
      return;
    }

    const timeout = window.setTimeout(() => {
      clearMutationError();
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [mutationError, clearMutationError]);

  function openCreateModal(): void {
    setFormName('');
    setIsCreateOpen(true);
    setEditingSegmentId(null);
    clearMutationError();
  }

  function openEditModal(id: string, currentName: string): void {
    setFormName(currentName);
    setEditingSegmentId(id);
    setIsCreateOpen(false);
    clearMutationError();
  }

  function closeCreateModal(): void {
    setIsCreateOpen(false);
    setFormName('');
    clearMutationError();
  }

  function closeEditModal(): void {
    setEditingSegmentId(null);
    setFormName('');
    clearMutationError();
  }

  async function handleCreateSubmit(): Promise<void> {
    const name = formName.trim();

    if (!name) {
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

  if (activeModule !== 'segments') {
    return (
      <AdminShell activeModule={activeModule} onChangeModule={onChangeModule}>
        <PanelCard>
          <PanelHeader>
            <h2>Empresas</h2>
          </PanelHeader>
          <TableState>Modulo de empresas sera implementado no proximo commit.</TableState>
        </PanelCard>
      </AdminShell>
    );
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
                  <th>Nome</th>
                  <th>Criado em</th>
                  <th>Atualizado em</th>
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
