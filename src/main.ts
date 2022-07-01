import {generate} from './generate'
import {validate} from './validate'
import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const input_file: string = core.getInput('input_file')
    const input: string = core.getInput('input')
    const output_file: string = core.getInput('output_file')
    const template_file: string = core.getInput('template_file')
    const template: string = core.getInput('template')

    const [template_data, input_data]: [string, object] = await validate(
      input_file,
      input,
      template_file,
      template
    )

    const result: string = await generate(
      template_data,
      input_data,
      output_file
    )
    core.setOutput('result', result)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
