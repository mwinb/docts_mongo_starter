import { String } from 'vaports';
import { evaluateJsonContent } from '../Evaluators/jsonContent.evaluator';

export class JsonContentValidator {
  @String({ evaluators: [evaluateJsonContent] })
  'content-type': string;
}

export default new JsonContentValidator();
