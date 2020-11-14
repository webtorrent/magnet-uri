const magnet = require('../')
const test = require('tape')

const leavesOfGrass = 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&dn=Leaves+of+Grass+by+Walt+Whitman.epub&tr=udp%3A%2F%2Ftracker.example4.com%3A80&tr=udp%3A%2F%2Ftracker.example5.com%3A80&tr=udp%3A%2F%2Ftracker.example3.com%3A6969&tr=udp%3A%2F%2Ftracker.example2.com%3A80&tr=udp%3A%2F%2Ftracker.example1.com%3A1337'

const empty = { announce: [], urlList: [], peerAddresses: [] }

test('decode: valid magnet uris', t => {
  const result = magnet(leavesOfGrass)
  t.equal(result.xt, 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36')
  t.equal(result.dn, 'Leaves of Grass by Walt Whitman.epub')
  t.equal(result.infoHash, 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36')
  const announce = [
    'udp://tracker.example1.com:1337',
    'udp://tracker.example2.com:80',
    'udp://tracker.example3.com:6969',
    'udp://tracker.example4.com:80',
    'udp://tracker.example5.com:80'
  ]

  // sort so that order doesn't matter
  t.deepEqual(result.tr.sort(), announce.sort())
  t.deepEqual(result.announce.sort(), announce.sort())

  t.end()
})

test('decode: empty magnet URIs return empty object', t => {
  const empty1 = ''
  const empty2 = 'magnet:'
  const empty3 = 'magnet:?'

  t.deepEqual(magnet(empty1), empty)
  t.deepEqual(magnet(empty2), empty)
  t.deepEqual(magnet(empty3), empty)
  t.end()
})

test('empty string as keys is okay', t => {
  const uri = 'magnet:?a=&b=&c='

  t.deepEqual(magnet(uri), Object.assign({ a: '', b: '', c: '' }, empty))
  t.end()
})

test('decode: invalid magnet URIs return empty object', t => {
  const invalid1 = 'magnet:?xt=urn:btih:==='
  const invalid2 = 'magnet:?xt'
  const invalid3 = 'magnet:?xt=?dn='

  t.deepEqual(magnet(invalid1), empty)
  t.deepEqual(magnet(invalid2), empty)
  t.deepEqual(magnet(invalid3), empty)
  t.end()
})

test('decode: invalid magnet URIs return only valid keys (ignoring invalid ones)', t => {
  const invalid1 = 'magnet:?a=a&==='
  const invalid2 = 'magnet:?a==&b=b'
  const invalid3 = 'magnet:?a=b=&c=c&d==='

  t.deepEqual(magnet(invalid1), Object.assign({ a: 'a' }, empty))
  t.deepEqual(magnet(invalid2), Object.assign({ b: 'b' }, empty))
  t.deepEqual(magnet(invalid3), Object.assign({ c: 'c' }, empty))
  t.end()
})

test('decode: extracts 40-char hex BitTorrent info_hash', t => {
  const result = magnet('magnet:?xt=urn:btih:aad050ee1bb22e196939547b134535824dabf0ce')
  t.equal(result.infoHash, 'aad050ee1bb22e196939547b134535824dabf0ce')
  t.end()
})

test('decode: extracts 32-char base32 BitTorrent info_hash', t => {
  const result = magnet('magnet:?xt=urn:btih:64DZYZWMUAVLIWJUXGDIK4QGAAIN7SL6')
  t.equal(result.infoHash, 'f7079c66cca02ab45934b9868572060010dfc97e')
  t.end()
})

test('decode: extracts keywords', t => {
  const result = magnet('magnet:?xt=urn:btih:64DZYZWMUAVLIWJUXGDIK4QGAAIN7SL6&kt=joe+blow+mp3')
  t.deepEqual(result.keywords, ['joe', 'blow', 'mp3'])
  t.end()
})

test('decode: complicated magnet uri (multiple xt params, and as, xs)', t => {
  const result = magnet('magnet:?xt=urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1&xt=urn:tree:tiger:7N5OAMRNGMSSEUE3ORHOKWN4WWIQ5X4EBOOTLJY&xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q&xl=10826029&dn=mediawiki-1.15.1.tar.gz&tr=udp%3A%2F%2Ftracker.example4.com%3A80%2Fannounce&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5&xs=dchub://example.org')
  t.equal(result.infoHash, '81e177e2cc00943b29fcfc635457f575237293b0')
  t.deepEqual(result.xt, [
    'urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1',
    'urn:tree:tiger:7N5OAMRNGMSSEUE3ORHOKWN4WWIQ5X4EBOOTLJY',
    'urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q'
  ])
  t.equal(result.xl, '10826029')
  t.equal(result.dn, 'mediawiki-1.15.1.tar.gz')
  const announce = 'udp://tracker.example4.com:80/announce'
  t.equal(result.tr, announce)
  t.deepEqual(result.announce, [announce])
  t.equal(result.as, 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz')
  t.deepEqual(result.urlList, ['http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz'])
  t.deepEqual(result.xs, [
    'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5',
    'dchub://example.org'
  ])
  t.end()
})

test('multiple as, ws params', t => {
  const result = magnet('magnet:?xt=urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz1&ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz2&ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz3')
  t.deepEqual(result.urlList, [
    'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz',
    'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz1',
    'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz2',
    'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz3'
  ])
  t.end()
})

test('dedupe repeated trackers', t => {
  const result = magnet('magnet:?xt=urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1&tr=udp%3A%2F%2Ftracker.example4.com%3A80&tr=udp%3A%2F%2Ftracker.example4.com%3A80&tr=udp%3A%2F%2Ftracker.example5.com%3A80&tr=udp%3A%2F%2Ftracker.example3.com%3A6969&tr=udp%3A%2F%2Ftracker.example2.com%3A80&tr=udp%3A%2F%2Ftracker.example1.com%3A1337')
  const announce = [
    'udp://tracker.example1.com:1337',
    'udp://tracker.example2.com:80',
    'udp://tracker.example3.com:6969',
    'udp://tracker.example4.com:80',
    'udp://tracker.example5.com:80'
  ]
  // sort so that order doesn't matter
  t.deepEqual(result.announce.sort(), announce.sort())
  t.end()
})

test('Cast file index (ix) to a number', t => {
  const result = magnet(`${leavesOfGrass}&ix=1`)
  t.equal(typeof result.ix, 'number')
  t.equal(result.ix, 1)
  t.end()
})

test('decode: Extracts public key from xs', t => {
  const key = '9a36edf0988ddc1a0fc02d4e8652cce87a71aaac71fce936e650a597c0fb72e0'
  const result = magnet(`magnet:?xs=urn:btpk:${key}`)
  t.equal(result.publicKey, key)
  t.deepEqual(result.publicKeyBuffer, Buffer.from(key, 'hex'))
  t.end()
})

// Select specific file indices for download (BEP53) http://www.bittorrent.org/beps/bep_0053.html
test('decode: select-only', t => {
  const result = magnet('magnet:?xt=urn:btih:64DZYZWMUAVLIWJUXGDIK4QGAAIN7SL6&so=0,2,4,6-8')
  t.deepEqual(result.so, [0, 2, 4, 6, 7, 8])
  t.end()
})

// Peer address expressed as hostname:port (BEP09) http://bittorrent.org/beps/bep_0009.html
test('decode: peer-address single value', t => {
  const result = magnet('magnet:?xt=urn:btih:64DZYZWMUAVLIWJUXGDIK4QGAAIN7SL6&x.pe=123.213.32.10:47450')
  const peerAddresses = ['123.213.32.10:47450']
  t.deepEqual(result['x.pe'], peerAddresses[0])
  t.deepEqual(result.peerAddresses, peerAddresses)
  t.end()
})

test('decode: peer-address multiple values', t => {
  const result = magnet('magnet:?xt=urn:btih:64DZYZWMUAVLIWJUXGDIK4QGAAIN7SL6&x.pe=123.213.32.10:47450&x.pe=[2001:db8::2]:55013')
  const peerAddresses = ['123.213.32.10:47450', '[2001:db8::2]:55013']
  t.deepEqual(result['x.pe'], peerAddresses)
  t.deepEqual(result.peerAddresses, peerAddresses)
  t.end()
})

test('decode: peer-address remove duplicates', t => {
  const result = magnet('magnet:?xt=urn:btih:64DZYZWMUAVLIWJUXGDIK4QGAAIN7SL6&x.pe=123.213.32.10:47450&x.pe=[2001:db8::2]:55013&x.pe=123.213.32.10:47450')

  // raw value is *not* deduped
  t.deepEqual(result['x.pe'], ['123.213.32.10:47450', '[2001:db8::2]:55013', '123.213.32.10:47450'])

  // friendly value is deduped
  t.deepEqual(result.peerAddresses, ['123.213.32.10:47450', '[2001:db8::2]:55013'])
  t.end()
})
