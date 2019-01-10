import 'whatwg-fetch'

/* global fetch Headers */

const port = window.configuration.host.port
const address = window.location.hostname

const restURL = endpoint => `http://${address}:${port}/api/${endpoint}`

const restFetch = async (endpoint, options) => {
  const url = restURL(endpoint)
  const response = await fetch(url, options)
  if (response && response.ok) return validateJSONResponse(response)
  throw Error(`${url} (${response.statusText})`)
}

const validateJSONResponse = response => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  throw TypeError('Badly formatted JSON')
}

export default {
  get: async endpoint => restFetch(endpoint),
  post: async (endpoint, data) => restFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({ 'Content-Type': 'application/json' })
  })
}