import Flux from '../../../local/index';

@Flux.View.Component({
  selector: 'SubOneView',
  template: (`<div>
    <span>One</span>
  </div>`)
})
class SubOneView extends Flux.View {
}

export default SubOneView;
