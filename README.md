magnet-uri
==========

Parse a magnet URI and return an object of keys/values. If the magnet URI is invalid, this module throws an exception.

## Installation

`npm install magnet-uri`

## Usage

```js
var magnet = require('magnet-uri')

// "Leaves of Grass" by Walt Whitman
var leavesOfGrass = 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&dn=Leaves+of+Grass+by+Walt+Whitman.epub&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Ftracker.ccc.de%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337'

try {
  var parse = magnet(leavesOfGrass)
} catch (e) {
  console.error('Invalid magnet URI')
}

```

The parsed magnet link object looks like this:

```js
  {
    "xt": "urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36",
    "dn": "Leaves+of+Grass+by+Walt+Whitman.epub",
    "tr": [
      "udp://tracker.openbittorrent.com:80",
      "udp://tracker.publicbt.com:80",
      "udp://tracker.istole.it:6969",
      "udp://tracker.ccc.de:80",
      "udp://open.demonii.com:1337"
    ]
  }
```

## MIT License

Copyright (c) [Feross Aboukhadijeh](http://feross.org)