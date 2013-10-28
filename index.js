/**
 * Parse a magnet URI and return an object of keys/values. If the magnet URI is
 * invalid, this module throws an exception.
 *
 * @param  {string} uri
 * @return {Object}     parsed uri
 */

module.exports = function (uri) {
  var result = {}
  var data = uri.split('magnet:?')[1]

  if (!data || data.length === 0) {
    return result
  }

  var params = data.split('&')

  params.forEach(function (param) {
    var keyval = param.split('=')
    var key = keyval[0]
    var val = keyval[1]

    if (keyval.length !== 2) {
      throw new Error('Invalid magnet URI')
    }

    // Address tracker (tr) is an encoded URI, so decode it
    if (key === 'tr') {
      val = decodeURIComponent(val)
    }

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

  return result
}