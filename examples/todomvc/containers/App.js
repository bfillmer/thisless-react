import React from 'react';
import header from '../components/Header';
import mainSection from '../components/MainSection';

function app(props) {
  const { todos$ } = props;

  const {
    element: Header,
    events: { save$ } // Passed here from Header.js
  } = header();

  const {
    element: MainSection,
    events: {
      toggleAll$,
      clearCompleted$,
      deleteTodo$,
      completeTodo$,
      editTodo$
    }
  } = mainSection({todos$});

  const element = (
    <div>
      {Header}
      {MainSection}
    </div>
  );

  return {
    element,
    events: {
      save$, // Pass up to index.js
      toggleAll$,
      clearCompleted$,
      deleteTodo$,
      completeTodo$,
      editTodo$
    }
  }
};

export default app;
