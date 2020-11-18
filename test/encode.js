const magnet = require('../')
const test = require('tape')

test('encode: complicated magnet uri (multiple xt params, and as, xs)', t => {
  const uri = magnet.encode({
    xt: [
      'urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1',
      'urn:tree:tiger:7N5OAMRNGMSSEUE3ORHOKWN4WWIQ5X4EBOOTLJY',
      'urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q'
    ],
    xl: '10826029',
    dn: 'mediawiki-1.15.1.tar.gz',
    tr: [
      'udp://tracker.example4.com:80/announce'
    ],
    as: 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz',
    xs: [
      'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5',
      'dchub://example.org'
    ]
  })

  t.equal(uri, 'magnet:?xt=urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1&xt=urn:tree:tiger:7N5OAMRNGMSSEUE3ORHOKWN4WWIQ5X4EBOOTLJY&xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q&xl=10826029&dn=mediawiki-1.15.1.tar.gz&tr=udp%3A%2F%2Ftracker.example4.com%3A80%2Fannounce&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5&xs=dchub%3A%2F%2Fexample.org')
  t.end()
})

test('encode: simple magnet uri using convenience names', t => {
  const obj = {
    xt: [
      'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
      'urn:btmh:1220d2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b'
    ],
    dn: 'Leaves of Grass by Walt Whitman.epub',
    name: 'Leaves of Grass by Walt Whitman.epub',
    infoHash: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    infoHashBuffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36', 'hex'),
    infoHashV2: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b',
    infoHashV2Buffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b', 'hex'),
    tr: [
      'udp://tracker.example1.com:1337',
      'udp://tracker.example2.com:80',
      'udp://tracker.example3.com:6969',
      'udp://tracker.example4.com:80',
      'udp://tracker.example5.com:80'
    ],
    announce: [
      'udp://tracker.example1.com:1337',
      'udp://tracker.example2.com:80',
      'udp://tracker.example3.com:6969',
      'udp://tracker.example4.com:80',
      'udp://tracker.example5.com:80'
    ],
    urlList: [
      'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz'
    ],
    peerAddresses: [],
    ws: 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz',
    kt: ['hey', 'hey2'],
    keywords: ['hey', 'hey2']
  }

  const result = magnet.encode(obj)

  t.equal(result, 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&xt=urn:btmh:1220d2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b&dn=Leaves+of+Grass+by+Walt+Whitman.epub&tr=udp%3A%2F%2Ftracker.example1.com%3A1337&tr=udp%3A%2F%2Ftracker.example2.com%3A80&tr=udp%3A%2F%2Ftracker.example3.com%3A6969&tr=udp%3A%2F%2Ftracker.example4.com%3A80&tr=udp%3A%2F%2Ftracker.example5.com%3A80&ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&kt=hey+hey2')

  t.deepEqual(magnet.decode(result), obj)

  t.end()
})

test('encode: using infoHashBuffer', t => {
  const obj = {
    infoHashBuffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36', 'hex')
  }
  const result = magnet.encode(obj)
  t.equal(result, 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36')
  t.deepEqual(magnet.decode(result), {
    infoHashBuffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36', 'hex'),
    infoHash: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    urlList: [],
    announce: [],
    peerAddresses: []
  })
  t.end()
})

test('encode: using infoHashV2Buffer', t => {
  const obj = {
    infoHashV2Buffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b', 'hex')
  }
  const result = magnet.encode(obj)
  t.equal(result, 'magnet:?xt=urn:btmh:1220d2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b')
  t.deepEqual(magnet.decode(result), {
    infoHashV2: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b',
    infoHashV2Buffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b', 'hex'),
    xt: 'urn:btmh:1220d2474e86c95b19b8bcfdb92bc12c9d44667cfa36d2474e86c95b19b8bcfdb92b',
    urlList: [],
    announce: [],
    peerAddresses: []
  })
  t.end()
})

// Select specific file indices for download (BEP53) http://www.bittorrent.org/beps/bep_0053.html
test('encode: select-only', t => {
  const obj = {
    xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    so: [0, 2, 4, 6, 7, 8]
  }
  const result = magnet.encode(obj)
  t.equal(result, 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&so=0,2,4,6-8')
  t.deepEqual(magnet.decode(result), {
    xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    infoHash: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    infoHashBuffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36', 'hex'),
    urlList: [],
    announce: [],
    peerAddresses: [],
    so: [0, 2, 4, 6, 7, 8]
  })
  t.end()
})

// Peer address expressed as hostname:port (BEP09) http://bittorrent.org/beps/bep_0009.html
test('encode: peer-address single value', t => {
  const obj = {
    xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    'x.pe': '123.213.32.10:47450'
  }
  const result = magnet.encode(obj)
  t.equal(result, 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&x.pe=123.213.32.10:47450')
  t.deepEqual(magnet.decode(result), {
    xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    'x.pe': '123.213.32.10:47450',
    infoHash: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    infoHashBuffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36', 'hex'),
    urlList: [],
    announce: [],
    peerAddresses: ['123.213.32.10:47450']
  })
  t.end()
})

test('encode: peer-address multiple values', t => {
  const obj = {
    xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    'x.pe': ['123.213.32.10:47450', '[2001:db8::2]:55013']
  }
  const result = magnet.encode(obj)
  t.equal(result, 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&x.pe=123.213.32.10:47450&x.pe=[2001:db8::2]:55013')
  t.deepEqual(magnet.decode(result), {
    xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    'x.pe': ['123.213.32.10:47450', '[2001:db8::2]:55013'],
    infoHash: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
    infoHashBuffer: Buffer.from('d2474e86c95b19b8bcfdb92bc12c9d44667cfa36', 'hex'),
    urlList: [],
    announce: [],
    peerAddresses: ['123.213.32.10:47450', '[2001:db8::2]:55013']
  })
  t.end()
})

test('encode: using publicKey', t => {
  const publicKey = '9a36edf0988ddc1a0fc02d4e8652cce87a71aaac71fce936e650a597c0fb72e0'
  const obj = {
    publicKey
  }
  const result = magnet.encode(obj)
  t.equal(result, 'magnet:?xs=urn:btpk:9a36edf0988ddc1a0fc02d4e8652cce87a71aaac71fce936e650a597c0fb72e0')
  t.end()
})

test('encode: using publicKeyBuffer', t => {
  const publicKeyBuffer = Buffer.from('9a36edf0988ddc1a0fc02d4e8652cce87a71aaac71fce936e650a597c0fb72e0', 'hex')
  const obj = {
    publicKeyBuffer
  }
  const result = magnet.encode(obj)
  t.equal(result, 'magnet:?xs=urn:btpk:9a36edf0988ddc1a0fc02d4e8652cce87a71aaac71fce936e650a597c0fb72e0')
  t.end()
})
