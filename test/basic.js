var magnet = require('../')
var test = require('tape')

var leavesOfGrass = 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&dn=Leaves+of+Grass+by+Walt+Whitman.epub&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Ftracker.ccc.de%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337'

test('parse valid magnet uris', function (t) {
  var result = magnet(leavesOfGrass)
  t.equal(result.xt, 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36')
  t.equal(result.dn, 'Leaves of Grass by Walt Whitman.epub')
  t.equal(result.infoHash, 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36')
  var announce = [
    'udp://tracker.openbittorrent.com:80',
    'udp://tracker.publicbt.com:80',
    'udp://tracker.istole.it:6969',
    'udp://tracker.ccc.de:80',
    'udp://open.demonii.com:1337'
  ]
  var announceList = [
    [ 'udp://tracker.openbittorrent.com:80' ],
    [ 'udp://tracker.publicbt.com:80' ],
    [ 'udp://tracker.istole.it:6969' ],
    [ 'udp://tracker.ccc.de:80' ],
    [ 'udp://open.demonii.com:1337' ]
  ]
  t.deepEquals(result.tr, announce)
  t.deepEquals(result.announce, announce)
  t.deepEquals(result.announceList, announceList)

  t.end()
})

test('empty magnet URIs return empty object', function (t) {
  var empty1 = ''
  var empty2 = 'magnet:'
  var empty3 = 'magnet:?'

  t.deepEquals(magnet(empty1), {})
  t.deepEquals(magnet(empty2), {})
  t.deepEquals(magnet(empty3), {})
  t.end()
})

test('empty string as keys is okay', function (t) {
  var uri = 'magnet:?a=&b=&c='

  t.deepEquals(magnet(uri), { a: '', b: '', c: '' })
  t.end()
})

test('invalid magnet URIs return empty object', function (t) {
  var invalid1 = 'magnet:?xt=urn:btih:==='
  var invalid2 = 'magnet:?xt'
  var invalid3 = 'magnet:?xt=?dn='

  t.deepEquals(magnet(invalid1), {})
  t.deepEquals(magnet(invalid2), {})
  t.deepEquals(magnet(invalid3), {})
  t.end()
})

test('invalid magnet URIs return only valid keys (ignoring invalid ones)', function (t) {
  var invalid1 = 'magnet:?a=a&==='
  var invalid2 = 'magnet:?a==&b=b'
  var invalid3 = 'magnet:?a=b=&c=c&d==='

  t.deepEquals(magnet(invalid1), { a: 'a' })
  t.deepEquals(magnet(invalid2), { b: 'b' })
  t.deepEquals(magnet(invalid3), { c: 'c' })
  t.end()
})

test('extracts 40-char hex BitTorrent info_hash', function (t) {
  var result = magnet('magnet:?xt=urn:btih:aad050ee1bb22e196939547b134535824dabf0ce')
  t.equal(result.infoHash, 'aad050ee1bb22e196939547b134535824dabf0ce')
  t.end()
})

test('extracts 32-char base32 BitTorrent info_hash', function (t) {
  var result = magnet('magnet:?xt=urn:btih:64DZYZWMUAVLIWJUXGDIK4QGAAIN7SL6')
  t.equal(result.infoHash, 'f7079c66cca02ab45934b9868572060010dfc97e')
  t.end()
})

test('extracts keywords', function (t) {
  var result = magnet('magnet:?xt=urn:btih:64DZYZWMUAVLIWJUXGDIK4QGAAIN7SL6&kt=joe+blow+mp3')
  t.deepEqual(result.keywords, ['joe','blow','mp3'])
  t.end()
})

test('complicated magnet uri (multiple xt params, and as, xs)', function (t) {
  var result = magnet('magnet:?xt=urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1&xt=urn:tree:tiger:7N5OAMRNGMSSEUE3ORHOKWN4WWIQ5X4EBOOTLJY&xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q&xl=10826029&dn=mediawiki-1.15.1.tar.gz&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5&xs=dchub://example.org')
  t.equal(result.infoHash, '81e177e2cc00943b29fcfc635457f575237293b0')
  t.deepEquals(result.xt, [
    'urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1',
    'urn:tree:tiger:7N5OAMRNGMSSEUE3ORHOKWN4WWIQ5X4EBOOTLJY',
    'urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q'
  ])
  t.equal(result.xl, '10826029')
  t.equal(result.dn, 'mediawiki-1.15.1.tar.gz')
  var announce = 'udp://tracker.openbittorrent.com:80/announce'
  var announceList = [
    [ 'udp://tracker.openbittorrent.com:80/announce' ]
  ]
  t.equal(result.tr, announce)
  t.deepEquals(result.announce, [ announce ])
  t.deepEquals(result.announceList, announceList)
  t.equal(result.as, 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz')
  t.deepEquals(result.xs, [
    'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5',
    'dchub://example.org'
  ])
  t.end()
})
