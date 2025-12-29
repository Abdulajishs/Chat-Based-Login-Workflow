"use server";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ServerRequestOptions<TBody = unknown> {
  url: string;
  method: HttpMethod;
  token?: string;
  body?: TBody;
  headers?: Record<string, string>;
}

export async function serverRequest<TResponse>(
  options: ServerRequestOptions
): Promise<TResponse> {
  const { url, method, token, body, headers } = options;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `ApiKey ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Request failed [${method}] ${url}: ${errorText}`
    );
  }

  return response.json();
}
