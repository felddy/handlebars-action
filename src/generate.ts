import {readFileSync, writeFileSync} from 'fs'
import * as core from '@actions/core'
import * as Handlebars from 'handlebars'

// Read the template file, and the data file, and output the result to the output file
export async function generate(
  template_filename: string,
  input_object: string,
  output_filename?: string
): Promise<string> {
  return new Promise(resolve => {
    core.debug(`Reading template file: ${template_filename}`)
    const template = readFileSync(template_filename, 'utf8')
    core.debug(`Parsing input object: ${input_object}`)
    const parsed_data = JSON.parse(input_object)
    core.debug(`Parsed input object: ${JSON.stringify(parsed_data, null, 2)}`)
    const result = Handlebars.compile(template)(parsed_data)
    if (output_filename) {
      core.info(`Writing generated file to ${output_filename}`)
      writeFileSync(output_filename, result, 'utf8')
    }
    resolve(result)
  })
}
