'use strict'

const fs = require('fs')
const readline = require('readline')

const CODE_FILTER = [19, 20, 21, 22, 23, 24, 25, 165, 167, 178, 179, 180, 212, 384, 528]

var FxHash = function () {}

FxHash.prototype.init = function () {
  this.fxHashData = {}
  var rl = readline.createInterface({
    input: fs.createReadStream('./common/util/fxmap.csv')
  })
  rl.on('line', (line) => {
    let split = line.split(',')
    this.fxHashData[split[1]] = split[0]
  })
  return this
}

FxHash.prototype.find = function (code) {
  try {
    if (CODE_FILTER.indexOf(code) >= 0 && this.fxHashData[code]) {
      return this.fxHashData[code]
    }
  } catch (err) {
    return 'Error looking up code ' + code
  }
  return null
}

module.exports = new FxHash()
