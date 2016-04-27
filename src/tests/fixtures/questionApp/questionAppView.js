import Flux from '../../../local/index';
import QuestionListView from './questionListView';
import QuestionAddView from './questionAddView';
import QuestionReducer from './questionReducer';

@Flux.View.component({
  selector: 'QuestionAppView',
  template: (`<div>
    <QuestionAddView></QuestionAddView>
    <div>Size: <span id="questionSize">{{state.questions.length}}</span></div>
    <QuestionListView [props.questions]="state.questions"></QuestionListView>
  </div>`),
  directives: [QuestionAddView, QuestionListView]
})
export default class QuestionAppView extends Flux.AppView {

  constructor() {
    super();
    this.questionReducer = new QuestionReducer({ initialState: this.props.questions });
    this.copyInitialState();
  }

  reduce(state, action) {
    return {
      questions: this.questionReducer.reduce(state.questions, action)
    };
  }

  initialState() {
    return {
      questions: this.questionReducer.initialState()
    };
  }

  storeChanged() {
    this.state.questions = this.storeState.questions;
  }
}
