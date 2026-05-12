const STRAPI_URL = '/api/strapi';

function getErrorMessage(body, fallback) {
  if (body?.error?.message) return body.error.message;
  if (Array.isArray(body?.error?.details?.errors) && body.error.details.errors[0]?.message) {
    return body.error.details.errors[0].message;
  }
  return fallback;
}

async function request(path, options = {}, fallbackError = 'Request failed') {
  const res = await fetch(`${STRAPI_URL}${path}`, options);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(getErrorMessage(body, fallbackError));
  }

  return body;
}

export function normalizeTodo(item) {
  const documentId = item?.documentId ?? null;
  const numericId = item?.id ?? null;

  return {
    id: numericId,
    documentId,
    apiId: documentId || String(numericId),
    title: item?.title ?? '',
    isCompleted: Boolean(item?.isCompleted),
  };
}

export function normalizeTodos(items) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeTodo);
}

export async function fetchTodos(jwt) {
  const json = await request(
    '/todos',
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: 'no-store',
    },
    'Failed to fetch todos'
  );

  return normalizeTodos(json.data);
}

export async function createTodo(title, jwt) {
  const json = await request(
    '/todos',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          title,
          isCompleted: false,
        },
      }),
    },
    'Failed to create todo'
  );

  return normalizeTodo(json.data);
}

export async function toggleTodo(todo, jwt) {
  const path = `/todos/${todo.apiId}`;
  const json = await request(
    path,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        // Strapi validates required fields on PUT for this content type.
        // Include title to avoid it being treated as null during updates.
        data: {
          title: todo.title,
          isCompleted: !todo.isCompleted,
        },
      }),
    },
    'Failed to update todo'
  );

  return normalizeTodo(json.data);
}

export async function deleteTodo(todo, jwt) {
  await request(
    `/todos/${todo.apiId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
    'Failed to delete todo'
  );
}
