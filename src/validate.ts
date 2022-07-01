import {readFileSync} from 'fs'
import * as core from '@actions/core'

// Verify the inputs are valid and read files if needed
export async function validate(
  input_file?: string,
  input?: string,
  template_file?: string,
  template?: string
): Promise<[string, object]> {
  return new Promise(resolve => {
    let input_data: object = {}
    let template_data = ''
    // Allow the user to specify a template file or template string, but not both
    if (template_file && template) {
      throw new Error(
        'You cannot specify both a template file and a template string'
      )
    }
    // Allow the user to specify an input file or input string, but not both
    if (input_file && input) {
      throw new Error(
        'You cannot specify both an input file and an input string'
      )
    }

    if (template_file) {
      core.debug(`Reading template file: ${template_file}`)
      template_data = readFileSync(template_file, 'utf8')
    } else if (template) {
      core.debug(`Using passed template data`)
      template_data = template
    } else {
      throw new Error('You must specify a template file or template string')
    }

    if (input_file) {
      core.debug(`Reading input file: ${input_file}`)
      input_data = JSON.parse(readFileSync(input_file, 'utf8'))
    } else if (input) {
      core.debug(`Using passed input data`)
      input_data = JSON.parse(input)
    } else {
      throw new Error('You must specify an input file or input string')
    }

    resolve([template_data, input_data])
  })
}
