import {expect, test} from '@jest/globals'
import {generate} from '../src/generate'
import {readFileSync} from 'fs'
import * as cp from 'child_process'
import * as path from 'path'
import * as process from 'process'

const TEMPLATE = path.join(__dirname, 'template.md.hbs')
const TEST_DATA = readFileSync(path.join(__dirname, 'test_data.json'), 'utf8')
const OUTPUT = path.join(__dirname, 'output.md')

test('generate result', async () => {
  generate(TEMPLATE, TEST_DATA, OUTPUT)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_TEMPLATE'] = TEMPLATE
  process.env['INPUT_JSON'] = TEST_DATA
  process.env['INPUT_DEST'] = OUTPUT
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
