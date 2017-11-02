const decode = decodeURIComponent
const encode = encodeURIComponent

function parseCookieString(text, shouldDecode) {
  const cookies = {}
  if (isString(text) && text.length > 0) {
    const decodeValue = shouldDecode ? decode : same
    const cookieParts = text.split(/;\s/g)
    let cookieName
    let cookieValue
    let cookieNameValue
    for (let i = 0, len = cookieParts.length; i < len; i++) {
      // Check for normally-formatted cookie (name-value)
      cookieNameValue = cookieParts[i].match(/([^=]+)=/i)
      if (cookieNameValue instanceof Array) {
        try {
          cookieName = decode(cookieNameValue[1])
          cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1))
        } catch (ex) {}
      } else {
        cookieName = decode(cookieParts[i])
        cookieValue = ''
      }
      if (cookieName) {
        cookies[cookieName] = cookieValue
      }
    }
  }
  return cookies
}
// Helpers
function isString(o) {
  return typeof o === 'string'
}
function isNonEmptyString(s) {
  return isString(s) && s !== ''
}
function validateCookieName(name) {
  if (!isNonEmptyString(name)) {
    throw new TypeError('Cookie name must be a non-empty string')
  }
}
function same(s) {
  return s
}

export default {
  get: function(name, options) {
    validateCookieName(name)
    if (typeof options === 'function') {
      options = {
        converter: options
      }
    } else {
      options = options || {}
    }
    const cookies = parseCookieString(document.cookie, !options['raw'])
    return (options.converter || same)(cookies[name])
  },
  set(name, value, options) {
    validateCookieName(name)
    options = options || {}
    const expires = options['expires']
    const domain = options['domain']
    const path = options['path']
    if (!options['raw']) {
      value = encode(String(value))
    }
    let text = name + '=' + value
    // expires
    let date = expires
    if (typeof date === 'number') {
      date = new Date()
      date.setDate(date.getDate() + expires)
    }
    if (date instanceof Date) {
      text += '; expires=' + date.toUTCString()
    }
    // domain
    if (isNonEmptyString(domain)) {
      text += '; domain=' + domain
    }
    // path
    if (isNonEmptyString(path)) {
      text += '; path=' + path
    }
    // secure
    if (options['secure']) {
      text += '; secure'
    }
    document.cookie = text
    return text
  },
  remove(name, options) {
    options = options || {}
    options['expires'] = new Date(0)
    return this.set(name, '', options)
  }
}
