import 'babel-core/polyfill';

// React DOM to render react components. Duh.
import ReactDOM from 'react-dom';

// Bind action creators, essentially wrap them in dispatch.
import { bindActionCreators } from 'redux';

// Grab our primary app state
import app from './containers/App';
import configureStore from './store/configureStore';
import * as TodoActions from './actions/todos';
import * as TodoAPICalls from './api/todos';
import 'todomvc-app-css/index.css';

// Bind our events to Redux actions.
// It appears that this is a full list of all possible
// events within the application. Would need to be
// broken out for a more complex application.
function handleEvent(store, events) {

  // Wrap our actions with Redux dispatch
  const actions = bindActionCreators(TodoActions, store.dispatch);

  // Test, first attempt. Wrap our redux action in our api call. Stream
  // gets update, store gets update, all works.
  // Theory: We could pull the redux action out, have it be synchonous
  // so the UI is snappy and responsive. Then have API call run, in the event
  // of an error it rewinds Redux to the previous state and exposes and error,
  // thus the UI is in sync with server data, but that only happens in the rare
  // cases where we have an error sending data to server.
  events.save$.subscribe(
    todo => {
      TodoAPICalls.addTodo(todo).then(() => {
        actions.addTodo(todo)
      })
    }
  );

  events.toggleAll$.subscribe(
    () => actions.completeAll()
  );

  events.clearCompleted$.subscribe(
    () => actions.clearCompleted()
  );

  events.deleteTodo$.subscribe(
    ({id}) => actions.deleteTodo(id)
  );

  events.completeTodo$.subscribe(
    ({id}) => actions.completeTodo(id)
  );

  events.editTodo$.subscribe(
    ({id, text}) => actions.editTodo(id, text)
  );
}

// Create our Redux/RxJS store.
const store = configureStore();

// Initially iterate through our state and get the todos.
// More than that, this glues the observable wrapper for the state
// to our todo list we pass from here downward to TodoList.js
// SO: We would do more than one mapping here for multiple data sources
// OR pass store.state$ down and separate out within higher level containers.
// I think the latter makes the most since, so the App props doesn't get insane.
const todos$ = store.state$.map(state => state.todos);

// Create our <App /> React element with the todos.
// Also creates events array to attach Redux dispatch
// to above.
const { element: App, events } = app({ todos$ });

// Take the store and the events from the created
// App and map them.
handleEvent(store, events);

// Render our application.
ReactDOM.render(App, document.getElementById('root'));
