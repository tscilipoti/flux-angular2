import Flux from '../../../local/index';

export default class QuestionReducer extends Flux.Reducer {

  constructor() {
    super();
    this.mQuestionIdNext = 0;
  }

  initialState() {
    return [];
  }

  actionAddQuestion(state, action) {
    return [...state, {
      id: ++this.mQuestionIdNext,
      subject: action.subject,
      body: action.body
    }];
  }
}
