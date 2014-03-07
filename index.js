var base32 = require('thirty-two')

/**
 * Parse a magnet URI and return an object of keys/values
 *
 * @param  {string} uri
 * @return {Object} parsed uri
 */

module.exports = function (uri) {
  var result = {}
  var data = uri.split('magnet:?')[1]

  if (!data || data.length === 0)
    return result

  var params = data.split('&')

  params.forEach(function (param) {
    var keyval = param.split('=')

    // This keyval is invalid, skip it
    if (keyval.length !== 2)
      return

    var key = keyval[0]
    var val = keyval[1]

    // Address tracker (tr) is an encoded URI, so decode it
    if (key === 'tr')
      val = decodeURIComponent(val)

    // If there are repeated parameters, return an array of values
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(val)
      } else {
        var old = result[key]
        result[key] = [old, val]
      }
    } else {
      result[key] = val
    }
  })

  var m
  if (result.xt && (m = result.xt.match(/^urn:btih:(.{40})/))) {
    result.btih = new Buffer(m[1], 'hex').toString('hex')
  } else if (result.xt && (m = result.xt.match(/^urn:btih:(.{32})/))) {
    result.btih = decode_base32(m[1])
  }

  return result
}

function decode_base32(s) {
  var r = base32.decode(s);
  var result = new Buffer(r.length);
  for(var i = 0; i < r.length; i++) {
    result[i] = r.charCodeAt(i);
  }
  return result.toString('hex');
}
