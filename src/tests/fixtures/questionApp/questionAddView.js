import Flux from '../../../local/index';

@Flux.View.component({
  selector: 'QuestionAddView',
  template: (`<div>
    <form>
      <input id="questionSubject" [value]="data.subject" (change)="data.subject = $event.target.value" type="text" placeholder="subject" />
      <input id="questionBody" [value]="data.body" (change)="data.body = $event.target.value" type="text" placeholder="body" />
      <button id="questionAdd" type="button" (click)="handleClick()">Create</button>
    </form>
  </div>`)
})
export default class QuestionAddView extends Flux.View {

  handleClick() {
    // dispatch an addQuestion event
    this.dispatch({
      type: 'addQuestion',
      subject: this.data.subject,
      body: this.data.body
    });

    // clear out inputs after creating question
    this.data.subject = '';
    this.data.body = '';
  }
}
