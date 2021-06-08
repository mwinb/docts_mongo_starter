import { String } from '@mwinberry/doc-ts';
import { evaluateJsonContent } from '../Evaluators/jsonContent.evaluator';

export class JsonContentValidator {
  @String({ evaluators: [evaluateJsonContent] })
  'content-type': string;
}

export default new JsonContentValidator();
