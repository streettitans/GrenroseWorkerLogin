export class ApiError extends Error {
  constructor(message, status, fields = {}, code = '') {
    super(message)
    this.status = status
    this.fields = fields
    this.code = code
  }
}

export async function request(path, { signal, method = 'GET', body, headers } = {}) {
  const timeout = AbortSignal.timeout(12000)
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout
  const requestHeaders = new Headers(headers)
  if (body && !requestHeaders.has('Content-Type')) requestHeaders.set('Content-Type', 'application/json')
  let response
  try {
    response = await fetch(path, {
      method,
      signal: requestSignal,
      credentials: 'same-origin',
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (timeout.aborted && !signal?.aborted) throw new ApiError('The server took too long to respond. Refresh and try again.', 0)
    if (error.name === 'AbortError') throw error
    throw new ApiError('Unable to connect. Check your connection and try again.', 0)
  }
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      result?.error?.message || 'Something went wrong. Please try again.',
      response.status,
      result?.error?.fields || {},
      result?.error?.code || '',
    )
  }
  if (!result && response.status !== 204) {
    throw new ApiError('The server returned an unexpected response. Please try again.', response.status)
  }
  return result
}

