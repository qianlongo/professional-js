let fs = require('fs')

let prevFileName = 'test'
let genTestFiles = (num) => {
  for (let i = 0; i < num; i++) {
    let fileName = `${prevFileName}${i}.txt`
    fs.unlink(fileName, (err) => {
      fs.writeFileSync(fileName, Math.random().toString(36).substr(2))
    })
  }
}

genTestFiles(5)