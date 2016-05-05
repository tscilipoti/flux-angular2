import Flux from '../../../local/index';

@Flux.View.component({
  selector: 'QuestionListView',
  template: (`<div>
    <div *ngFor="let question of state">
      <b>{{question.subject}}</b> - {{question.body}}
    </div>
  </div>`),
  inputs: ['state']
})
export default class QuestionListView extends Flux.View {
}
