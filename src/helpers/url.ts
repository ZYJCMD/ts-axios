import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, parmas?: any, paramsSerializer?: (parmas: any) => string) {
  if (!parmas) {
    return url
  }

  let serializedParmas

  if (paramsSerializer) {
    serializedParmas = paramsSerializer(parmas)
  } else if (isURLSearchParams(parmas)) {
    serializedParmas = parmas.toString()
  } else {
    const parts: string[] = []

    Object.keys(parmas).forEach(key => {
      const val = parmas[key]

      if (val === null || typeof val === 'undefined') {
        return
      }

      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    serializedParmas = parts.join('&')
  }
  if (serializedParmas) {
    const marIndex = url.indexOf('#')
    if (marIndex !== -1) {
      url = url.slice(0, marIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParmas
  }
  return url
}

export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL?.replace(/^\/+/, '')
    : baseURL
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const currentOrigin = resolveURL(window.location.href)
const urlParsingNode = document.createElement('a') //解析手段

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
