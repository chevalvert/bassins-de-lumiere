/**
 * A convenient abstraction to wrap all file parsing, sanitization etc for a given dataset
 */

import 'nodelist-foreach'
import Point from 'abstractions/Point'
import raw from 'nanohtml/raw'

export default class Dataset {
  static get REQUIRED_FILES () {
    return window.configuration['datasetRequiredFiles']
  }

  constructor (files) {
    this.files = files
    if (!this.checkIntegrity()) return

    this.parseShapes(files['shapes.svg'])
    this.parseTest(files['__test'])
  }

  checkIntegrity (files = this.files) {
    Dataset.REQUIRED_FILES.forEach(filename => {
      if (!files.hasOwnProperty(filename) || !files[filename]) {
        throw new ReferenceError('Missing file in dataset: ' + filename)
      }
    })
    return true
  }

  parseShapes (shapes) {
    const svg = raw(shapes)[0]
    const groups = svg.querySelectorAll('g')
    this.points = [...groups].map(group => new Point(group))
  }

  parseTest (test) {
    console.log(test)
  }
}
