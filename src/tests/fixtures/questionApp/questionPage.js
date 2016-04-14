import Flux from '../../../local/index';
import QuestionReducer from './questionReducer';
import QuestionAppView from './questionAppView';

export default class QuestionPage extends Flux.Page {
  constructor(options) {
    super(options);
    this.mQuestionReducer = new QuestionReducer();
  }

  getView() {
    return QuestionAppView;
  }

  getProps() {
    return { questionReducer: this.mQuestionReducer };
  }
}
