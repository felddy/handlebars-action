import {beforeEach, expect, test} from '@jest/globals'
import {generate} from '../src/generate'
import {readFileSync} from 'fs'
import * as cp from 'child_process'
import * as path from 'path'
import * as process from 'process'
import {stderr} from 'process'

const TEMPLATE_FILE = path.join(__dirname, 'template.md.hbs')
const TEMPLATE = readFileSync(TEMPLATE_FILE, 'utf8')
const INPUT_FILE = path.join(__dirname, 'test_data.json')
const INPUT_JSON = readFileSync(INPUT_FILE, 'utf8')
const INPUT = JSON.parse(INPUT_JSON)
const OUTPUT = path.join(__dirname, 'output.md')

beforeEach(() => {
  // Loop through environment variables and delete the INPUT_* ones
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('INPUT_')) {
      delete process.env[key]
    }
  }
})

function exec_main_js(): void {
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  const stdout: string = cp.execFileSync(np, [ip], options).toString()
  console.log(stdout)
}

test('test generate function in isolation', async () => {
  generate(TEMPLATE, INPUT, OUTPUT)
})

// TEMPLATE, TEMPLATE_FILE, INPUT, INPUT_FILE
const pass_cases = [
  [TEMPLATE, '', INPUT_JSON, ''],
  ['', TEMPLATE_FILE, INPUT_JSON, ''],
  [TEMPLATE, '', '', INPUT_FILE],
  ['', TEMPLATE_FILE, '', INPUT_FILE]
]
const fail_cases = [
  ['', '', '', ''],
  [TEMPLATE, '', '', ''],
  ['', TEMPLATE_FILE, '', ''],
  ['', '', INPUT, ''],
  ['', '', '', INPUT_FILE],
  [TEMPLATE, TEMPLATE_FILE, '', ''],
  ['', '', INPUT, INPUT_FILE],
  [TEMPLATE, TEMPLATE_FILE, INPUT, ''],
  [TEMPLATE, TEMPLATE_FILE, '', INPUT_FILE],
  [TEMPLATE, '', INPUT, INPUT_FILE],
  ['', TEMPLATE_FILE, INPUT, INPUT_FILE],
  [TEMPLATE, TEMPLATE_FILE, INPUT, INPUT_FILE]
]

test.each(pass_cases)(
  'test valid env / stdout protocol combinations %#',
  (template, template_file, input, input_file) => {
    if (template) {
      process.env['INPUT_TEMPLATE'] = template
    }
    if (template_file) {
      process.env['INPUT_TEMPLATE_FILE'] = template_file
    }
    if (input) {
      process.env['INPUT_INPUT'] = input
    }
    if (input_file) {
      process.env['INPUT_INPUT_FILE'] = input_file
    }
    exec_main_js()
  }
)

test.each(fail_cases)(
  'test invalid env / stdout protocol combinations %#',
  (template, template_file, input, input_file) => {
    if (template) {
      process.env['INPUT_TEMPLATE'] = template
    }
    if (template_file) {
      process.env['INPUT_TEMPLATE_FILE'] = template_file
    }
    if (input) {
      process.env['INPUT_INPUT'] = input
    }
    if (input_file) {
      process.env['INPUT_INPUT_FILE'] = input_file
    }
    expect(exec_main_js).toThrow()
  }
)
