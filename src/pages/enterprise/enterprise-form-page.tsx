import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  clearAuthSession,
  getAccessToken,
  getAuthUser,
} from '../../services/auth-session';
import { useEnterprisesList } from '../../hooks/use-enterprises-list';
import { useEnterpriseReferenceOptions } from '../../hooks/use-enterprise-reference-options';
import { getEnterpriseById } from '../../services/api/enterprise-api';
import {
  createContact,
  createContactEmail,
  createContactPhone,
  deleteContact,
  deleteContactEmail,
  deleteContactPhone,
  updateContact,
} from '../../services/api/contact-api';
import { SelectField } from '../../components/form/select-field';
import { AdminShell } from '../../components/layout/admin-shell';
import {
  BackButton,
  ContactCard,
  ContactCardHeader,
  ContactsNotice,
  ContactIdentity,
  ContactSummary,
  ContactsHeader,
  ContactsActions,
  ContactsSection,
  DangerSmallButton,
  DangerSmallGhostButton,
  ErrorText,
  Field,
  Footer,
  FormCard,
  GhostButton,
  Grid,
  InlineRow,
  EditContactButton,
  PageContainer,
  PageHeader,
  PrimaryButton,
  SmallButton,
  StatusToggle,
  ContactConfirmOverlay,
  ContactConfirmCard,
  ContactConfirmActions,
} from './enterprise-form-page.styles';

type EnterpriseFormPageProps = {
  mode: 'create' | 'edit';
};

type FormState = {
  name: string;
  ownerName: string;
  cityId: string;
  segmentId: string;
  active: boolean;
  contacts: Array<{
    id?: string;
    name: string;
    department: string;
    emails: string[];
    emailIds: string[];
    phones: string[];
    phoneIds: string[];
  }>;
};

type ContactSnapshot = {
  id?: string;
  name: string;
  department: string;
  emails: string[];
  emailIds: string[];
  phones: string[];
  phoneIds: string[];
};

const INITIAL_FORM: FormState = {
  name: '',
  ownerName: '',
  cityId: '',
  segmentId: '',
  active: true,
  contacts: [],
};

export function EnterpriseFormPage({ mode }: EnterpriseFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = typeof window === 'undefined' ? null : getAccessToken();
  const authUser = typeof window === 'undefined' ? null : getAuthUser();
  const canWrite = authUser?.role === 'admin' || authUser?.role === 'editor';

  const {
    mutationError,
    clearMutationError,
    createItem,
    updateItem,
  } = useEnterprisesList(token);

  const {
    isLoading: isLoadingReferences,
    errorMessage: referencesError,
    cities,
    segments,
  } = useEnterpriseReferenceOptions(token);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSavingEnterprise, setIsSavingEnterprise] = useState(false);
  const [isSavingContacts, setIsSavingContacts] = useState(false);
  const [contactsValidationError, setContactsValidationError] = useState('');
  const [isLoadingEnterprise, setIsLoadingEnterprise] = useState(mode === 'edit');
  const [enterpriseLoadError, setEnterpriseLoadError] = useState('');
  const [initialContactsSnapshot, setInitialContactsSnapshot] =
    useState<ContactSnapshot[]>([]);
  const [pendingContactRemovalIndex, setPendingContactRemovalIndex] = useState<number | null>(
    null,
  );
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);

  useEffect(() => {
    if (mode !== 'edit' || !id || !token) {
      setIsLoadingEnterprise(false);
      return;
    }

    let active = true;
    setIsLoadingEnterprise(true);
    setEnterpriseLoadError('');

    void getEnterpriseById(token, id)
      .then((enterprise) => {
        if (!active) {
          return;
        }

        setForm({
          name: enterprise.name,
          ownerName: enterprise.ownerName,
          cityId: enterprise.city?.id ?? '',
          segmentId: enterprise.segment?.id ?? '',
          active: enterprise.active,
          contacts:
            enterprise.contacts.length > 0
              ? enterprise.contacts.map((contact) => ({
                  id: contact.id,
                  name: contact.name ?? '',
                  department: contact.department ?? '',
                  emails:
                    contact.emails.length > 0
                      ? contact.emails.map((email) => email.address)
                      : [],
                  emailIds: contact.emails.map((email) => email.id),
                  phones:
                    contact.phones.length > 0
                      ? contact.phones.map((phone) => phone.number)
                      : [],
                  phoneIds: contact.phones.map((phone) => phone.id),
                }))
              : [],
        });

        setInitialContactsSnapshot(
          enterprise.contacts.length > 0
            ? enterprise.contacts.map((contact) => ({
                id: contact.id,
                name: contact.name ?? '',
                department: contact.department ?? '',
                emails: contact.emails.map((email) => email.address),
                emailIds: contact.emails.map((email) => email.id),
                phones: contact.phones.map((phone) => phone.number),
                phoneIds: contact.phones.map((phone) => phone.id),
              }))
            : [],
        );

        setContactsValidationError('');
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Nao foi possivel carregar a empresa para edicao.';

        setEnterpriseLoadError(message);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setIsLoadingEnterprise(false);
      });

    return () => {
      active = false;
    };
  }, [id, mode, token]);

  function addContact(): void {
    setContactsValidationError('');
    setForm((current) => ({
      ...current,
      contacts: [
        ...current.contacts,
        {
          name: '',
          department: '',
          emails: [],
          emailIds: [],
          phones: [],
          phoneIds: [],
        },
      ],
    }));
    setEditingContactIndex(form.contacts.length);
  }

  function requestContactRemoval(index: number): void {
    setPendingContactRemovalIndex(index);
  }

  function cancelContactRemoval(): void {
    setPendingContactRemovalIndex(null);
  }

  async function confirmContactRemoval(): Promise<void> {
    if (pendingContactRemovalIndex === null) {
      return;
    }

    setContactsValidationError('');

    const targetContact = form.contacts[pendingContactRemovalIndex];

    if (mode === 'edit' && token && targetContact?.id) {
      try {
        setIsSavingContacts(true);

        for (const emailId of targetContact.emailIds) {
          if (emailId) {
            await deleteContactEmail(token, emailId);
          }
        }

        for (const phoneId of targetContact.phoneIds) {
          if (phoneId) {
            await deleteContactPhone(token, phoneId);
          }
        }

        await deleteContact(token, targetContact.id);
      } catch (error) {
        setContactsValidationError(
          error instanceof Error
            ? error.message
            : 'Falha ao remover contato pela API de contatos.',
        );
        setIsSavingContacts(false);
        setPendingContactRemovalIndex(null);
        return;
      }
    }

    setForm((current) => {
      return {
        ...current,
        contacts: current.contacts.filter(
          (_, contactIndex) => contactIndex !== pendingContactRemovalIndex,
        ),
      };
    });

    setInitialContactsSnapshot((current) =>
      current.filter((_, contactIndex) => contactIndex !== pendingContactRemovalIndex),
    );

    setPendingContactRemovalIndex(null);
    setIsSavingContacts(false);

    if (editingContactIndex !== null) {
      if (pendingContactRemovalIndex === editingContactIndex) {
        setEditingContactIndex(null);
      } else if (pendingContactRemovalIndex < editingContactIndex) {
        setEditingContactIndex(editingContactIndex - 1);
      }
    }
  }

  function openContactEditor(index: number): void {
    setEditingContactIndex(index);
  }

  function closeContactEditor(): void {
    setEditingContactIndex(null);
  }

  function addContactEmail(contactIndex: number): void {
    setContactsValidationError('');
    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, index) =>
        index === contactIndex
          ? {
              ...contact,
              emails: [...contact.emails, ''],
              emailIds: [...contact.emailIds, ''],
            }
          : contact,
      ),
    }));
  }

  async function removeContactEmail(contactIndex: number, emailIndex: number): Promise<void> {
    setContactsValidationError('');

    const contact = form.contacts[contactIndex];
    const emailId = contact?.emailIds?.[emailIndex];

    if (mode === 'edit' && token && contact?.id && emailId) {
      try {
        await deleteContactEmail(token, emailId);
      } catch (error) {
        setContactsValidationError(
          error instanceof Error
            ? error.message
            : 'Falha ao remover email pela API de contatos.',
        );
        return;
      }
    }

    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, index) => {
        if (index !== contactIndex) {
          return contact;
        }

        return {
          ...contact,
          emails: contact.emails.filter((_, currentEmailIndex) => currentEmailIndex !== emailIndex),
          emailIds: contact.emailIds.filter((_, currentEmailIndex) => currentEmailIndex !== emailIndex),
        };
      }),
    }));

    if (mode === 'edit' && contact?.id && emailId) {
      setInitialContactsSnapshot((current) =>
        current.map((snapshot) => {
          if (snapshot.id !== contact.id) {
            return snapshot;
          }

          const emailIndexInSnapshot = snapshot.emailIds.findIndex((id) => id === emailId);

          if (emailIndexInSnapshot < 0) {
            return snapshot;
          }

          return {
            ...snapshot,
            emails: snapshot.emails.filter((_, index) => index !== emailIndexInSnapshot),
            emailIds: snapshot.emailIds.filter((_, index) => index !== emailIndexInSnapshot),
          };
        }),
      );
    }
  }

  function addContactPhone(contactIndex: number): void {
    setContactsValidationError('');
    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, index) =>
        index === contactIndex
          ? {
              ...contact,
              phones: [...contact.phones, ''],
              phoneIds: [...contact.phoneIds, ''],
            }
          : contact,
      ),
    }));
  }

  async function removeContactPhone(contactIndex: number, phoneIndex: number): Promise<void> {
    setContactsValidationError('');

    const contact = form.contacts[contactIndex];
    const phoneId = contact?.phoneIds?.[phoneIndex];

    if (mode === 'edit' && token && contact?.id && phoneId) {
      try {
        await deleteContactPhone(token, phoneId);
      } catch (error) {
        setContactsValidationError(
          error instanceof Error
            ? error.message
            : 'Falha ao remover telefone pela API de contatos.',
        );
        return;
      }
    }

    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, index) => {
        if (index !== contactIndex) {
          return contact;
        }

        return {
          ...contact,
          phones: contact.phones.filter((_, currentPhoneIndex) => currentPhoneIndex !== phoneIndex),
          phoneIds: contact.phoneIds.filter((_, currentPhoneIndex) => currentPhoneIndex !== phoneIndex),
        };
      }),
    }));

    if (mode === 'edit' && contact?.id && phoneId) {
      setInitialContactsSnapshot((current) =>
        current.map((snapshot) => {
          if (snapshot.id !== contact.id) {
            return snapshot;
          }

          const phoneIndexInSnapshot = snapshot.phoneIds.findIndex((id) => id === phoneId);

          if (phoneIndexInSnapshot < 0) {
            return snapshot;
          }

          return {
            ...snapshot,
            phones: snapshot.phones.filter((_, index) => index !== phoneIndexInSnapshot),
            phoneIds: snapshot.phoneIds.filter((_, index) => index !== phoneIndexInSnapshot),
          };
        }),
      );
    }
  }

  function updateContactEmail(
    contactIndex: number,
    emailIndex: number,
    value: string,
  ): void {
    setContactsValidationError('');
    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, index) =>
        index === contactIndex
          ? {
              ...contact,
              emails: contact.emails.map((email, currentEmailIndex) =>
                currentEmailIndex === emailIndex ? value : email,
              ),
            }
          : contact,
      ),
    }));
  }

  function updateContactPhone(
    contactIndex: number,
    phoneIndex: number,
    value: string,
  ): void {
    setContactsValidationError('');
    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, index) =>
        index === contactIndex
          ? {
              ...contact,
              phones: contact.phones.map((phone, currentPhoneIndex) =>
                currentPhoneIndex === phoneIndex ? value : phone,
              ),
            }
          : contact,
      ),
    }));
  }

  function formatPhoneMask(rawValue: string): string {
    const digits = rawValue.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function updateContactName(contactIndex: number, value: string): void {
    setContactsValidationError('');
    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, index) =>
        index === contactIndex ? { ...contact, name: value } : contact,
      ),
    }));
  }

  function updateContactDepartment(contactIndex: number, value: string): void {
    setContactsValidationError('');
    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, index) =>
        index === contactIndex ? { ...contact, department: value } : contact,
      ),
    }));
  }

  function buildContactsPayload(): Array<{ emails?: string[]; phones?: string[] }> | undefined {
    const normalized: Array<{ emails?: string[]; phones?: string[] }> = [];

    form.contacts.forEach((contact) => {
        const emails = contact.emails.map((item) => item.trim()).filter((item) => item.length > 0);
        const phones = contact.phones.map((item) => item.trim()).filter((item) => item.length > 0);

        if (emails.length === 0 && phones.length === 0) {
          return;
        }

        normalized.push({
          emails: emails.length > 0 ? emails : undefined,
          phones: phones.length > 0 ? phones : undefined,
        });
      });

    return normalized.length > 0 ? normalized : undefined;
  }

  function hasInvalidContactFields(): boolean {
    return form.contacts.some((contact) => {
      const hasAnyContent =
        contact.name.trim().length > 0 ||
        contact.department.trim().length > 0 ||
        contact.emails.some((email) => email.trim().length > 0) ||
        contact.phones.some((phone) => phone.trim().length > 0);

      if (!contact.id && !hasAnyContent) {
        return false;
      }

      const hasRequiredContactIdentity =
        contact.name.trim().length > 0 && contact.department.trim().length > 0;
      const hasEmailFields = contact.emails.length > 0;
      const hasPhoneFields = contact.phones.length > 0;

      const hasEmptyEmail = hasEmailFields
        ? contact.emails.some((email) => email.trim().length === 0)
        : false;
      const hasEmptyPhone = hasPhoneFields
        ? contact.phones.some((phone) => phone.trim().length === 0)
        : false;

      return !hasRequiredContactIdentity || hasEmptyEmail || hasEmptyPhone;
    });
  }

  function hasPendingNewContactCreation(): boolean {
    if (mode !== 'edit') {
      return false;
    }

    return form.contacts.some((contact) => {
      if (contact.id) {
        return false;
      }

      const hasName = contact.name.trim().length > 0;
      const hasDepartment = contact.department.trim().length > 0;
      const hasEmails = contact.emails.some((email) => email.trim().length > 0);
      const hasPhones = contact.phones.some((phone) => phone.trim().length > 0);

      return hasName || hasDepartment || hasEmails || hasPhones;
    });
  }

  const hasRequiredEnterpriseFields =
    form.name.trim().length > 0 &&
    form.ownerName.trim().length > 0 &&
    form.cityId.length > 0 &&
    form.segmentId.length > 0;

  const hasPendingContactCreation = hasPendingNewContactCreation();

  const isEditingAnyContact = editingContactIndex !== null;

  const shouldBlockByContactEditing =
    isEditingAnyContact && (hasInvalidContactFields() || hasPendingContactCreation);

  const isCreateMode = mode === 'create';

  const canSubmitForm =
    hasRequiredEnterpriseFields &&
    !shouldBlockByContactEditing;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]): void {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    clearMutationError();
    setContactsValidationError('');

    if (!form.name.trim() || !form.ownerName.trim() || !form.cityId || !form.segmentId) {
      return;
    }

    if (hasInvalidContactFields()) {
      setContactsValidationError(
        'Preencha todos os emails e telefones adicionados, ou remova os campos vazios.',
      );
      return;
    }

    const hasInvalidEmailFormat = form.contacts.some((contact) =>
      contact.emails.some((email) => email.trim().length > 0 && !isValidEmail(email)),
    );

    if (hasInvalidEmailFormat) {
      setContactsValidationError('Existe email invalido em contatos. Revise os campos de email.');
      return;
    }

    setIsSavingEnterprise(true);

    const payload = {
      name: form.name.trim(),
      ownerName: form.ownerName.trim(),
      cityId: form.cityId,
      segmentId: form.segmentId,
      active: form.active,
      contacts: mode === 'create' ? buildContactsPayload() : undefined,
    };

    let success = false;
    let createdEnterpriseId: string | null = null;

    if (mode === 'create') {
      createdEnterpriseId = await createItem(payload);
      success = Boolean(createdEnterpriseId);
    } else {
      success = id ? await updateItem(id, payload) : false;
    }

    if (success && mode === 'edit') {
      try {
        await syncContactsOnEdit();
      } catch (error) {
        setIsSavingEnterprise(false);
        setContactsValidationError(
          error instanceof Error
            ? error.message
            : 'Falha ao salvar os contatos via API de contatos.',
        );
        return;
      }
    }

    setIsSavingEnterprise(false);

    if (success) {
      if (mode === 'create' && createdEnterpriseId) {
        navigate(`/enterprises/${createdEnterpriseId}/edit`, { replace: true });
      } else {
        navigate('/dashboard/companies', { replace: true });
      }
    }
  }

  function handleLogout(): void {
    clearAuthSession();
    navigate('/login', { replace: true });
  }

  async function syncContactsOnEdit(): Promise<void> {
    if (mode !== 'edit' || !token || !id) {
      return;
    }

    const nextSnapshot: ContactSnapshot[] = [];
    const initialById = new Map(initialContactsSnapshot.map((contact) => [contact.id, contact]));
    const currentById = new Map(
      form.contacts.filter((contact) => Boolean(contact.id)).map((contact) => [contact.id, contact]),
    );

    for (const initialContact of initialContactsSnapshot) {
      if (!initialContact.id) {
        continue;
      }

      if (!currentById.has(initialContact.id)) {
        for (const emailId of initialContact.emailIds) {
          await deleteContactEmail(token, emailId);
        }

        for (const phoneId of initialContact.phoneIds) {
          await deleteContactPhone(token, phoneId);
        }

        await deleteContact(token, initialContact.id);
      }
    }

    for (const contact of form.contacts) {
      let contactId = contact.id;

      const nextContactSnapshot: ContactSnapshot = {
        id: contactId,
        name: contact.name,
        department: contact.department,
        emails: [],
        emailIds: [],
        phones: [],
        phoneIds: [],
      };

      if (contact.id) {
        await updateContact(token, contact.id, {
          enterpriseId: id || '',
          name: contact.name.trim(),
          department: contact.department.trim(),
        });
      } else {
        const createdContact = await createContact(token, id, {
          name: contact.name.trim(),
          department: contact.department.trim(),
        });
        contactId = createdContact.id;
        nextContactSnapshot.id = createdContact.id;
      }

      const baseContact = contact.id ? initialById.get(contact.id) : undefined;

      const existingEmailIds = baseContact?.emailIds ?? [];
      const existingPhoneIds = baseContact?.phoneIds ?? [];

      for (let index = 0; index < contact.emails.length; index += 1) {
        const address = contact.emails[index]?.trim();

        if (!address) {
          continue;
        }

        const emailId = contact.emailIds[index] || existingEmailIds[index];

        if (emailId) {
          await deleteContactEmail(token, emailId);
        }

        if (!contactId) {
          continue;
        }

        const createdEmail = await createContactEmail(token, contactId, address);
        nextContactSnapshot.emails.push(address);
        nextContactSnapshot.emailIds.push(createdEmail.id);
      }

      for (const leftoverEmailId of existingEmailIds.slice(contact.emails.length)) {
        await deleteContactEmail(token, leftoverEmailId);
      }

      for (let index = 0; index < contact.phones.length; index += 1) {
        const number = contact.phones[index]?.trim();

        if (!number) {
          continue;
        }

        const phoneId = contact.phoneIds[index] || existingPhoneIds[index];

        if (phoneId) {
          await deleteContactPhone(token, phoneId);
        }

        if (!contactId) {
          continue;
        }

        const createdPhone = await createContactPhone(token, contactId, number);
        nextContactSnapshot.phones.push(number);
        nextContactSnapshot.phoneIds.push(createdPhone.id);
      }

      for (const leftoverPhoneId of existingPhoneIds.slice(contact.phones.length)) {
        await deleteContactPhone(token, leftoverPhoneId);
      }

      nextSnapshot.push(nextContactSnapshot);
    }

    setForm((current) => ({
      ...current,
      contacts: nextSnapshot.map((contact) => ({
        id: contact.id,
        name: contact.name,
        department: contact.department,
        emails: [...contact.emails],
        emailIds: [...contact.emailIds],
        phones: [...contact.phones],
        phoneIds: [...contact.phoneIds],
      })),
    }));

    setInitialContactsSnapshot(nextSnapshot);
  }

  async function handleSaveContactsOnly(): Promise<void> {
    if (mode !== 'edit') {
      return;
    }

    setContactsValidationError('');

    if (hasInvalidContactFields()) {
      setContactsValidationError(
        'Preencha todos os emails e telefones adicionados, ou remova os campos vazios.',
      );
      return;
    }

    const hasInvalidEmailFormat = form.contacts.some((contact) =>
      contact.emails.some((email) => email.trim().length > 0 && !isValidEmail(email)),
    );

    if (hasInvalidEmailFormat) {
      setContactsValidationError('Existe email invalido em contatos. Revise os campos de email.');
      return;
    }

    setIsSavingContacts(true);

    try {
      await syncContactsOnEdit();
      setContactsValidationError('');
      setEditingContactIndex(null);
    } catch (error) {
      setContactsValidationError(
        error instanceof Error
          ? error.message
          : 'Falha ao salvar os contatos via API de contatos.',
      );
    } finally {
      setIsSavingContacts(false);
    }
  }

  return (
    <AdminShell
      activeModule="companies"
      onChangeModule={(nextModule) => navigate(`/dashboard/${nextModule}`)}
      canCreate={canWrite}
      userName={authUser?.name}
      userRole={authUser?.role ?? null}
      onLogout={handleLogout}
    >
      <PageContainer>
        <PageHeader>
          <div>
            <h2>{mode === 'create' ? 'Nova empresa' : 'Editar empresa'}</h2>
            <p>Contato sera configurado em uma aba dedicada da empresa.</p>
          </div>

          <BackButton type="button" onClick={() => navigate('/dashboard/companies')}>
            Voltar
          </BackButton>
        </PageHeader>

        <FormCard onSubmit={(event) => void handleSubmit(event)}>
          {isLoadingEnterprise ? <ErrorText>Carregando dados da empresa...</ErrorText> : null}
          {enterpriseLoadError ? <ErrorText>{enterpriseLoadError}</ErrorText> : null}

          <Grid>
            <Field>
              <label htmlFor="enterprise-name">Nome da empresa *</label>
              <input
                id="enterprise-name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Informe o nome"
              />
            </Field>

            <Field>
              <label htmlFor="enterprise-owner">Responsavel *</label>
              <input
                id="enterprise-owner"
                value={form.ownerName}
                onChange={(event) => updateField('ownerName', event.target.value)}
                placeholder="Informe o nome do responsavel"
              />
            </Field>

          <Field>
              <SelectField
                id="enterprise-city"
                label="Municipio *"
                value={form.cityId}
                onChange={(value) => updateField('cityId', value)}
                disabled={isLoadingReferences}
                filterPlaceholder="Filtrar municipios"
                emptyText="Nenhum municipio encontrado"
                options={cities.map((city) => ({
                  value: city.id,
                  label: city.name,
                }))}
              />
            </Field>

            <Field>
              <SelectField
                id="enterprise-segment"
                label="Segmento *"
                value={form.segmentId}
                onChange={(value) => updateField('segmentId', value)}
                disabled={isLoadingReferences}
                filterPlaceholder="Filtrar segmentos"
                emptyText="Nenhum segmento encontrado"
                options={segments.map((segment) => ({
                  value: segment.id,
                  label: segment.name,
                }))}
            />
          </Field>
        </Grid>

        <ContactsSection $disabled={isCreateMode}>
          <ContactsHeader>
            <div>
              <h3>Contatos</h3>
              <p>Cada contato pode ter varios emails e telefones.</p>
            </div>

            <ContactsActions>
              <SmallButton type="button" onClick={addContact} disabled={isCreateMode}>
                Adicionar novo contato
              </SmallButton>
            </ContactsActions>
          </ContactsHeader>

          {isCreateMode ? (
            <ContactsNotice>
              O cadastro e a edicao de contatos ficam disponiveis apos criar a empresa. Salve a
              empresa primeiro e depois use a tela de edicao.
            </ContactsNotice>
          ) : null}

          {form.contacts.map((contact, contactIndex) => (
            <ContactCard key={`contact-${contactIndex}`}>
              <ContactCardHeader>
                <ContactIdentity>
                  <strong>{contact.name.trim() || `Contato ${contactIndex + 1}`}</strong>
                  <span>{contact.department.trim() || 'Departamento nao informado'}</span>
                </ContactIdentity>

                <ContactsActions>
                  <EditContactButton
                    type="button"
                    disabled={isCreateMode}
                    onClick={() => openContactEditor(contactIndex)}
                  >
                    Editar
                  </EditContactButton>
                  <DangerSmallButton
                    type="button"
                    onClick={() => requestContactRemoval(contactIndex)}
                    disabled={isCreateMode}
                  >
                    Remover contato
                  </DangerSmallButton>
                </ContactsActions>
              </ContactCardHeader>

              {editingContactIndex !== contactIndex ? (
                <ContactSummary>
                  <div className="summary-list-group">
                    <strong>Emails</strong>
                    <ul>
                      {contact.emails.filter((email) => email.trim().length > 0).length > 0 ? (
                        contact.emails
                          .filter((email) => email.trim().length > 0)
                          .map((email, index) => <li key={`summary-email-${contactIndex}-${index}`}>{email}</li>)
                      ) : (
                        <li>-</li>
                      )}
                    </ul>
                  </div>

                  <div className="summary-list-group">
                    <strong>Telefones</strong>
                    <ul>
                      {contact.phones.filter((phone) => phone.trim().length > 0).length > 0 ? (
                        contact.phones
                          .filter((phone) => phone.trim().length > 0)
                          .map((phone, index) => <li key={`summary-phone-${contactIndex}-${index}`}>{phone}</li>)
                      ) : (
                        <li>-</li>
                      )}
                    </ul>
                  </div>
                </ContactSummary>
              ) : null}

              {editingContactIndex === contactIndex ? (
                <>
                  <Field>
                    <label>Nome do contato *</label>
                    <input
                      required
                      value={contact.name}
                      disabled={isCreateMode}
                      onChange={(event) => updateContactName(contactIndex, event.target.value)}
                      placeholder="Ex.: Maria Silva"
                    />
                  </Field>

                  <Field>
                    <label>Departamento *</label>
                    <input
                      required
                      value={contact.department}
                      disabled={isCreateMode}
                      onChange={(event) =>
                        updateContactDepartment(contactIndex, event.target.value)
                      }
                      placeholder="Ex.: Financeiro"
                    />
                  </Field>

                  <Field>
                    <label>Emails</label>
                    {contact.emails.map((email, emailIndex) => (
                      <InlineRow key={`contact-${contactIndex}-email-${emailIndex}`}>
                        <input
                          required
                          type="email"
                          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                          value={email}
                          disabled={isCreateMode}
                          onChange={(event) =>
                            updateContactEmail(contactIndex, emailIndex, event.target.value)
                          }
                          placeholder="email@exemplo.com"
                        />
                        <DangerSmallButton
                          type="button"
                          disabled={isCreateMode}
                          onClick={() => void removeContactEmail(contactIndex, emailIndex)}
                        >
                          Remover
                        </DangerSmallButton>
                      </InlineRow>
                    ))}
                    <SmallButton
                      type="button"
                      disabled={isCreateMode}
                      onClick={() => addContactEmail(contactIndex)}
                    >
                      Adicionar email
                    </SmallButton>
                  </Field>

                  <Field>
                    <label>Telefones</label>
                    {contact.phones.map((phone, phoneIndex) => (
                      <InlineRow key={`contact-${contactIndex}-phone-${phoneIndex}`}>
                        <input
                          required
                          value={phone}
                          disabled={isCreateMode}
                          onChange={(event) =>
                            updateContactPhone(
                              contactIndex,
                              phoneIndex,
                              formatPhoneMask(event.target.value),
                            )
                          }
                          placeholder="(48) 99999-0000"
                        />
                        <DangerSmallButton
                          type="button"
                          disabled={isCreateMode}
                          onClick={() => void removeContactPhone(contactIndex, phoneIndex)}
                        >
                          Remover
                        </DangerSmallButton>
                      </InlineRow>
                    ))}
                    <SmallButton
                      type="button"
                      disabled={isCreateMode}
                      onClick={() => addContactPhone(contactIndex)}
                    >
                      Adicionar telefone
                    </SmallButton>
                  </Field>

                  <InlineRow>
                    {mode === 'edit' ? (
                      <SmallButton
                        type="button"
                        onClick={() => void handleSaveContactsOnly()}
                        title="Salva os contatos pendentes e fecha a ediçao"
                      >
                        {isSavingContacts ? 'Salvando contato...' : 'Salvar contato'}
                      </SmallButton>
                    ) : null}
                    <SmallButton type="button" onClick={closeContactEditor}>
                      Fechar ediçao
                    </SmallButton>
                  </InlineRow>
                </>
              ) : null}
            </ContactCard>
          ))}
        </ContactsSection>

        {pendingContactRemovalIndex !== null ? (
          <ContactConfirmOverlay>
            <ContactConfirmCard>
              <h4>Remover contato</h4>
              <p>Deseja realmente remover este contato?</p>
              <ContactConfirmActions>
                <GhostButton type="button" onClick={cancelContactRemoval}>
                  Cancelar
                </GhostButton>
                <DangerSmallGhostButton type="button" onClick={confirmContactRemoval}>
                  {isSavingContacts ? 'Removendo...' : 'Remover'}
                </DangerSmallGhostButton>
              </ContactConfirmActions>
            </ContactConfirmCard>
          </ContactConfirmOverlay>
        ) : null}

          <StatusToggle>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => updateField('active', event.target.checked)}
            />
            Empresa ativa
          </StatusToggle>

          {referencesError ? <ErrorText>{referencesError}</ErrorText> : null}
          {contactsValidationError ? <ErrorText>{contactsValidationError}</ErrorText> : null}
          {shouldBlockByContactEditing ? (
            <ErrorText>
              Existem contatos pendentes de cadastro. Use o botão "Salvar contato" antes de salvar a empresa.
            </ErrorText>
          ) : null}
          {mutationError ? <ErrorText>{mutationError}</ErrorText> : null}

          <Footer>
            <GhostButton type="button" onClick={() => navigate('/dashboard/companies')}>
              Cancelar
            </GhostButton>
            <PrimaryButton
              type="submit"
              disabled={isSavingEnterprise || !canSubmitForm}
              title={
                shouldBlockByContactEditing
                  ? 'Salve os contatos pendentes antes de salvar a empresa'
                  : undefined
              }
            >
              {isSavingEnterprise ? 'Salvando...' : mode === 'create' ? 'Criar empresa' : 'Salvar'}
            </PrimaryButton>
          </Footer>
        </FormCard>
      </PageContainer>
    </AdminShell>
  );
}
