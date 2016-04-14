import Flux from '../../../local/index';

@Flux.View.Component({
  selector: 'QuestionAddView',
  template: (`<div>
    <form>
      <input id="questionSubject" [value]="state.subject" (change)="state.subject = $event.target.value" type="text" placeholder="subject" />
      <input id="questionBody" [value]="state.body" (change)="state.body = $event.target.value" type="text" placeholder="body" />
      <button id="questionAdd" type="button" (click)="handleClick()">Create</button>
    </form>
  </div>`)
})
export default class QuestionAddView extends Flux.View {

  handleClick() {
    // dispatch an addQuestion event
    this.dispatch({
      type: 'addQuestion',
      subject: this.state.subject,
      body: this.state.body
    });

    // clear out inputs after creating question
    this.state.subject = '';
    this.state.body = '';
  }
}
