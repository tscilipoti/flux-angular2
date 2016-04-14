# flux-angular2

This package is currently in **BETA**

## Overview
This is a node package that contains an implementation of the flux pattern using Angular2 and the redux package.

## Guide

To install this package execute the following command in the console from within your project.
```
npm install --save flux-angular2
```

This package is a collection of classes that loosley correspond to each of the items defined in the flux pattern.
A short description of each class in this package is below.  See the API section for more detailed information on each class.

- `Page` - Ties together all of the different parts of an application.  There should only ever be one instance on a page.
- `View` - Corresponds to a flux view component.
- `AppView` - Controls one or more Views on the page.
- `Reducer` - Contains all of the business logic for managing data.
- `PageBuilder` - Used on the server side to generate pages.

### Example Application

What follows is an example of an application built using this package.  
For my example I will create an application that allows a user to log questions with a subject and body input.
Note that you will need to use a bundle and transpiler package to transpile from ECMAScript 6/TypeScript and 
deliver your code to the client which is not shown in the examples.

#### Reducer
The first to do is define a reducer for my application.  For this example the reducer is simply going to save and retrieve data from 
memory but normally there would be some kind of communication with a backend service.
Below is code that I've put in a file named `questionReducer.js`:
```JavaScript
import Flux from 'flux-angular2';

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
```

As you can see above the QuestionReducer class code is pretty simple.  There is an initalState function which gets called to provide the initial state
for the reducer.  The name given to the actionAddQuestion function has significance as it begins with the text `action`.  Any function defined in a Reducer class 
that begins with the text action will be called automatically by the dispatcher when the lower camel case version of the text that follows action 
is set in `type`.
For my example this function gets executed whenever a dispatch is sent with the action.type set to `addQuestion`.

You can also use action types with periods if you want.  These get translated into underscores in function names.  For eaxmple the action 
`.my.example.action` will map to the function `action_my_example_action`.

#### View
Now that I have my Reducer defined I'm going to define what will be displayed for UI on the page.  To do this I'm going to break up the different parts of my 
display into a couple of different views.
First up I'll write the view for displaying questions that have been added.  This code will be in a file called `QuestionListView.js`:
```JavaScript
import Flux from 'flux-angular2';

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
```
As you can see, this class extends Flux.View and uses the Flux.View.Component annotation.  Flux.View.component is simply a convenience function
and is equivalent to angular2/core/Component.
Now that I've defined the view for displaying questions I'll define the view for adding questions in a file named `QuestionAddView.js`:
```JavaScript
import Flux from 'flux-angular2';

@Flux.View.component({
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
```
There are a number of things going on in the code above.  First, the user input is being stored in the local state of the view and the state is 
tied to the text input boxes through the template.  
You'll also notice that the handleClick function is dispatching a message using the dispatch function defined in the View class.  The page property is also 
defined in Flux.View and references the current singleton instance of the Page class.

#### AppView
Now that I've defined all of the views I'll need I can create a class that will bring them together to be displayed.  I'll do this with an AppView I'll define in a file named `QuestionAppView.js`:
```JavaScript
import Flux from 'flux-angular2';
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
```
As you can see the QuestionAppView class extends the Flux.AppView class.
In this class I've brought together the QuestionAddView and QuestionListView views and I am displaying the one on top of the other.  
This class also expects a questionReducer property that will be used for reducing calls.
You can see that the storeChanged function is being overridden to update the state with the new collection of questions when the store is changed.

#### Page

Now that I have all the parts needed for my application the last thing to do is to bring it all together within a custom Page class.  
I'll do this in a file named `QuestionPage.js`:
```JavaScript
import Flux from 'flux-angular2';
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
```
This is all that is needed to define my application.  The last thing to do is to create an instance of the QuestionPage and call the load function like so:
```JavaScript
const page = new QuestionPage();
page.load();
```
When the page is loaded an istance of the view returned from the getView function will be created and the properties returned from the getProps function will be passed to the newly created view.
That's all there is to it.  Both the question list and question add views will be displayed and when a user adds a new question it will be immediately displayed.

## API

### `Page`
Type: `Class`

Abstract class definition of a page.  
Page classes aren't used directly but rather custom classes extend the Page class and contain the logic to render content in a client browser.
Only one instance of a class that extends Page should be loaded at a time or unpredicatable results may occur.

#### Page.constructor(options)
Type: `Constructor`

The constructor for the page class.  Any classes that extend the Page class should pass the options parameter through.

#### options
Type: `Object`

Options for the Page class.

##### options.title
Type: `String`

Optional parameter.  When provided the browser will display the given title.

##### options.isBrowserContext
Type: `Boolean`

Optional parameter that when defined will indicate if the Page is running within the context of a browser or a server.  By default the Page will
determine this on it's own but this option can be useful when creating unit tests and you want to override the default behavior.

##### options.isDevContext
Type: `Boolean`

Optional parameter that when defined will indicate if the Page is running within the development context.  By default the Page will
determine this on it's own but this option can be useful when creating unit tests and you want to override the default behavior.
When left to the default the url of the current page is inspected and if there is a dev token in the page name such as 'index.dev.html' then the isDevContext will be true.

#### Page.current
Type: `Page`

This is a static property that holds the singleton instance of the Page for an application.  It gets set when the Page is first instantiated so
any code that depends on it must be run after the page has been created or within the contructor of a class that extends the Page class.
Whenever a new Page is instantiated it will override this property so having multiple Pages in an application may have unpredictible results.

#### Page.store
Type: `Store`

This is a property on the object that will be an instance of a Redux store as defined in the [Redux](https://www.npmjs.com/package/redux) package.

#### Page.isBrowserContext
Type: `Boolean`

This is a property that indicates if the current code being run is within the context of a client browser.

#### Page.isDevContext
Type: `Boolean`

This is a property that indicates if the current code being run is in the development context.

#### Page.title
Type: `String`

This is a property that corresponds to the title displayed in the browser.  It can be both read from and updated.

#### Page.load()
Type: `Function`

This function is called to load the page into the browser.  It returns a promise that resolves when the page has finished loading.

#### Page.getView()
Type: `Function`

Sub classes should override this function to return the view that will be loaded in the page.

#### Page.getProps()
Type: `Function`

Sub classes should override this function to return the properties that will be loaded in the page.

#### Page.tick()
Type: `Function`

This function is used to manually run a check for any changed state on the page.  It should only be used as part of unit testing.

#### Page.handleError(err)
Type: `Function`

Handle the given error by writing the error to the console.

##### err
Type: `Error`

The error to handle.

### `View`
Type: `Class`

Abstract definition of a View.
View classes are not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### View.page
Type: `Page`

This property is a convenience property and returns the value from Page.current.

#### View.onInit()
Type: `Function`

This function is called by the framework when the view has been initialized.

#### View.onDestroy()
Type: `Function`

This function is called by the framework when the view has been destroyed.

#### View.dispatch(action)
Type: `Function`

A convenience property that is the same as calling Page.current.store.dispatch.

#### View.component
Type: `Component`

A convenience property that is the same as angular2/core/Component.

### `AppView`
Type: `Class`

The AppView class extends the View class and adds additional functionality for sub classes.
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.

#### AppView.reduce(state, action)
Type: `Function`

This function is called by the Redux package whenever an action has been dispatched.  It should return the new state based on the
action.

#### AppView.initialState()
Type: `Function`

This is called by the Redux package to get the initial state when the page is loaded.

#### AppView.storeChanged()
Type: `Function`

This function is called after an action has been dispatched and the state changed.

### AppView.storeState
Type: `Object`

This is a convenience property and is the same as Page.current.store.getState().

### `Reducer`
Type: `Class`

This class is a base class for all Reducer classes.
It is not intended to be used directly but rather to be extended by other classes to provide custom logic.
Classes that override this class can wire up functions to be called when a given action is dispatched.
Any function that has a name that begins with the text action will be wired up to the corresponding action name.

### `PageBuilder`
Type: `Class`

This class is intended to be used on the server to render Pages on the server to be delivered to client browsers.

#### PageBuilder.styleSheets
Type: `String or String[]`

A property that contains the style sheet tags that should be included in the page.

#### PageBuilder.scripts
Type: `String or String[]`

A property that contains the script tags that should be included in the page.

#### PageBuilder.renderToString(page)
Type: `Function`

This function generates an HTML string that will load the given page when the page is loaded in a browser.
In the future this function will generate the rendered output from the page.

##### page
Type: `Page`

The page to render.
