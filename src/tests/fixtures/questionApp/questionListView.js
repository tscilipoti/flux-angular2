import Flux from '../../../local/index';

@Flux.View.component({
  selector: 'QuestionListView',
  template: (`<div>
    <div *ngFor="#question of props.questions">
      <b>{{question.subject}}</b> - {{question.body}}
    </div>
  </div>`),
  inputs: ['props.questions']
})
export default class QuestionListView extends Flux.View {
}
