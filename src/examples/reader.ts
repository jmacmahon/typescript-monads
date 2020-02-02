import { Reader, ask } from '../reader'
import { readFileSync, writeFileSync } from 'fs'

interface Config {
  inputFile: string
  outputFile: string
  logging: boolean
}

type ConfigReader<T> = Reader<Config, T>

const noop = Reader.box<Config, void>(undefined)

// const read: ConfigReader<Buffer> = new Reader(({ inputFile }) => readFileSync(inputFile))
const read: ConfigReader<Buffer> = ask<Config>().transform(({ inputFile }) => readFileSync(inputFile))

// const write = (data: Buffer): ConfigReader<void> => new Reader(({ outputFile }) => writeFileSync(outputFile, data))
const write = (data: Buffer): ConfigReader<void> => ask<Config>().transform(({ outputFile }) => writeFileSync(outputFile, data))

const log = (message: string) => <T> (val: T): ConfigReader<T> => noop
  .then(() => ask<Config>())
  .transform(({ logging }) => {
    if (logging) { console.log(message) }
  })
  .transform(() => val)

const main = noop
  .then(() => read)
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
