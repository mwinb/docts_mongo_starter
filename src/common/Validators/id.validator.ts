import { String } from '@mwinberry/doc-ts';
import { evaluateObjectId } from '../Evaluators/objectId.evaluator';

class IdValidator {
  @String({ evaluators: [evaluateObjectId] })
  id: string;
}
export default new IdValidator();
