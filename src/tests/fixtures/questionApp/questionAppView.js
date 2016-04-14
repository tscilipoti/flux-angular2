import Flux from '../../../local/index';
import QuestionListView from './questionListView';
import QuestionAddView from './questionAddView';

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

  reduce(state, action) {
    return {
      questions: this.props.questionReducer.reduce(state.questions, action)
    };
  }

  initialState() {
    return {
      questions: this.props.questionReducer.initialState()
    };
  }

  storeChanged() {
    this.state.questions = this.storeState.questions;
  }
}
