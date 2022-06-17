import {generate} from './generate'
import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const template_filename: string = core.getInput('template')
    const input_object: string = core.getInput('json')
    const output_filename: string = core.getInput('dest')
    const result = await generate(
      template_filename,
      input_object,
      output_filename
    )
    core.setOutput('result', result)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
