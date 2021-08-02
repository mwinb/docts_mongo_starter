import { String } from 'vaports';
import { evaluateObjectId } from '../Evaluators/objectId.evaluator';

class IdValidator {
  @String({ evaluators: [evaluateObjectId] })
  id: string;
}
export default new IdValidator();
