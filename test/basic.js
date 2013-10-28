var magnet = require('../')
var test = require('tape')

var leavesOfGrass = 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&dn=Leaves+of+Grass+by+Walt+Whitman.epub&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Ftracker.ccc.de%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337'

test('parse valid magnet uris', function (t) {
  t.doesNotThrow(function () {
    magnet(leavesOfGrass)
  })
  t.deepEquals(magnet(leavesOfGrass), {
    "xt": "urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36",
    "dn": "Leaves+of+Grass+by+Walt+Whitman.epub",
    "tr": [
      "udp://tracker.openbittorrent.com:80",
      "udp://tracker.publicbt.com:80",
      "udp://tracker.istole.it:6969",
      "udp://tracker.ccc.de:80",
      "udp://open.demonii.com:1337"
    ]
  })
  t.end()
})

var empty1 = ''
var empty2 = 'magnet:'
var empty3 = 'magnet:?'

test('invalid magnet URIs throw', function (t) {
  t.doesNotThrow(function () { magnet(empty1) })
  t.deepEquals(magnet(empty1), {})
  t.doesNotThrow(function () { magnet(empty2) })
  t.deepEquals(magnet(empty2), {})
  t.doesNotThrow(function () { magnet(empty3) })
  t.deepEquals(magnet(empty3), {})
  t.end()
})


var invalid1 = 'magnet:?xt=urn:btih:==='
var invalid2 = 'magnet:?xt'
var invalid3 = 'magnet:?xt=?dn='

test('invalid magnet URIs throw', function (t) {
  t.throws(function () { magnet(invalid1) })
  t.throws(function () { magnet(invalid2) })
  t.throws(function () { magnet(invalid3) })
  t.end()
})