import {writeFileSync} from 'fs'
import * as core from '@actions/core'
import * as Handlebars from 'handlebars'

// Read the template file, and the data file, and output the result to the output file
export async function generate(
  template_data: string,
  input_data: object,
  output_filename?: string
): Promise<string> {
  return new Promise(resolve => {
    core.debug(`Parsed input data: ${JSON.stringify(input_data, null, 2)}`)
    const result = Handlebars.compile(template_data)(input_data)
    if (output_filename) {
      core.info(`Writing generated file to ${output_filename}`)
      writeFileSync(output_filename, result, 'utf8')
    }
    resolve(result)
  })
}
