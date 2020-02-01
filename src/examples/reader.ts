import { Reader } from '../reader'
import { readFileSync, writeFileSync } from 'fs'

interface Config {
  inputFile: string
  outputFile: string
  logging: boolean
}

type ConfigReader<T> = Reader<Config, T>

const read: ConfigReader<Buffer> = new Reader(({ inputFile }) => readFileSync(inputFile))
const write = (data: Buffer): ConfigReader<void> => new Reader(({ outputFile }) => writeFileSync(outputFile, data))
const log = (message: string) => <T> (val: T): ConfigReader<T> => new Reader(({ logging }) => {
  if (logging) {
    console.log(message)
  }
  return val
})

const main = read
  .then(log('Read successful'))
  .transform(buf => buf.toString('base64'))
  .transform(str => Buffer.from(str, 'utf8'))
  .then(write)
  .then(log('Write successful'))

main.run({
  inputFile: 'input.txt',
  outputFile: 'output.base64.txt',
  logging: true
})
