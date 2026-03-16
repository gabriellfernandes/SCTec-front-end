const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

type ApiErrorPayload = {
  message?: string | string[];
};

export class ContactApiHttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ContactApiHttpError';
    this.status = status;
  }
}

async function parseError(response: Response, fallback: string): Promise<never> {
  const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
  const message = Array.isArray(payload?.message)
    ? payload?.message[0]
    : payload?.message;

  throw new ContactApiHttpError(message ?? fallback, response.status);
}

type ContactDto = {
  id: string;
  enterpriseId: string;
  name?: string | null;
  department?: string | null;
};

type EmailDto = {
  id: string;
  address: string;
};

type PhoneDto = {
  id: string;
  number: string;
};

export async function createContact(
  token: string,
  enterpriseId: string,
  payload: { name: string; department: string },
): Promise<ContactDto> {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      enterpriseId,
      name: payload?.name,
      department: payload?.department,
    }),
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao criar contato');
  }

  return (await response.json()) as ContactDto;
}

export async function deleteContact(token: string, contactId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao excluir contato');
  }
}

export async function updateContact(
  token: string,
  id: string,
  payload: { enterpriseId: string; name: string; department: string },
): Promise<ContactDto> {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao atualizar contato');
  }

  return (await response.json()) as ContactDto;
}

export async function createContactEmail(
  token: string,
  contactId: string,
  address: string,
): Promise<EmailDto> {
  const response = await fetch(`${API_BASE_URL}/contact-emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contactId, address }),
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao salvar email de contato');
  }

  return (await response.json()) as EmailDto;
}

export async function updateContactEmail(
  token: string,
  id: string,
  contactId: string,
  address: string,
): Promise<EmailDto> {
  const response = await fetch(`${API_BASE_URL}/contact-emails/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contactId, address }),
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao atualizar email de contato');
  }

  return (await response.json()) as EmailDto;
}

export async function deleteContactEmail(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contact-emails/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao excluir email de contato');
  }
}

export async function createContactPhone(
  token: string,
  contactId: string,
  number: string,
): Promise<PhoneDto> {
  const response = await fetch(`${API_BASE_URL}/contact-phones`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contactId, number }),
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao salvar telefone de contato');
  }

  return (await response.json()) as PhoneDto;
}

export async function updateContactPhone(
  token: string,
  id: string,
  contactId: string,
  number: string,
): Promise<PhoneDto> {
  const response = await fetch(`${API_BASE_URL}/contact-phones/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contactId, number }),
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao atualizar telefone de contato');
  }

  return (await response.json()) as PhoneDto;
}

export async function deleteContactPhone(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contact-phones/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return parseError(response, 'Falha ao excluir telefone de contato');
  }
}
