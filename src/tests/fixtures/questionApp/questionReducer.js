import Flux from '../../../local/index';

export default class QuestionReducer extends Flux.Reducer {

  constructor(opts) {
    super(opts);
    this.mQuestionIdNext = 0;
  }

  actionAddQuestion(state, action) {
    return [...state, {
      id: ++this.mQuestionIdNext,
      subject: action.subject,
      body: action.body
    }];
  }
}
