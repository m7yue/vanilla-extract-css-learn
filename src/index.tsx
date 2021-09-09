import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../components';
import { exampleStyle } from './styles.css';

import { interval, combineLatest, EMPTY, NEVER } from 'rxjs';
import { map, switchMap, scan, tap, filter, startWith } from 'rxjs/operators';

import { Remesh } from './remesh';

import {
  useRemeshEmitter,
  RemeshRoot,
  useRemeshValue,
  useRemeshNode,
} from './remesh/react';

let todoUid = 0;

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

type AddTodo = {
  type: 'AddTodo';
  content: string;
};

type RemoveTodo = {
  type: 'RemoveTodo';
  todoId: number;
};

type UpdateTodoContent = {
  type: 'UpdateTodoContent';
  todoId: number;
  content: string;
};

type ToggleTodoStatus = {
  type: 'ToggleTodoStatus';
  todoId: number;
};

type DefaultTodoAction = {
  type: 'DefaultTodoAction';
};

type TodoAction =
  | DefaultTodoAction
  | AddTodo
  | RemoveTodo
  | UpdateTodoContent
  | ToggleTodoStatus;

const Todos = Remesh.stream<TodoAction, Todo[]>({
  startValue: {
    input: {
      type: 'DefaultTodoAction',
    },
    output: [] as Todo[],
  },
  impl: (action$, { startValue }) => {
    const reducer = (todos: Todo[], action: TodoAction): Todo[] => {
      if (action.type === 'AddTodo') {
        const newTodo: Todo = {
          id: todoUid++,
          content: action.content,
          completed: false,
        };
        return [...todos, newTodo];
      }

      if (action.type === 'RemoveTodo') {
        return todos.filter((todo) => todo.id !== action.todoId);
      }

      if (action.type === 'ToggleTodoStatus') {
        return todos.map((todo) => {
          if (todo.id !== action.todoId) return todo;
          return {
            ...todo,
            completed: !todo.completed,
          };
        });
      }

      if (action.type === 'UpdateTodoContent') {
        return todos.map((todo) => {
          if (todo.id !== action.todoId) return todo;
          return {
            ...todo,
            content: action.content,
          };
        });
      }

      return todos;
    };

    return action$.pipe(scan(reducer, startValue.output));
  },
});

const TodoActionHistory = Remesh.pack<TodoAction[]>({
  startValue: [],
  impl: ({ get }) => {
    return get(Todos.Input).pipe(
      scan((history, action) => [...history, action], [] as TodoAction[])
    );
  },
});

type TodoFilter = 'All' | 'Active' | 'Completed';

const TodoFilter = Remesh.atom<TodoFilter>({
  startValue: 'All',
});

const FilteredTodoList = Remesh.pack<Todo[]>({
  startValue: [],
  impl: ({ get }) => {
    const input$ = combineLatest({
      todos: get(Todos.Output),
      filter: get(TodoFilter),
    });

    return input$.pipe(
      map(({ todos, filter }) => {
        if (filter === 'Active') {
          return todos.filter((todo) => !todo.completed);
        }

        if (filter === 'Completed') {
          return todos.filter((todo) => todo.completed);
        }

        return todos;
      })
    );
  },
});

type CounterAction = 'incre' | 'decre' | 'reset' | 'noop';

const Counter = Remesh.stream<CounterAction, number>({
  startValue: {
    input: 'noop',
    output: 0,
  },
  impl: (action$, { startValue }) => {
    return action$.pipe(
      scan((count, action) => {
        if (action === 'noop') return count;
        if (action === 'incre') return count + 1;
        if (action === 'decre') return count - 1;
        if (action === 'reset') return 0;
        return count;
      }, startValue.output)
    );
  },
});

type User = {
  id: number;
  name: string;
  email: string;
};

const isNumber = (input: unknown): input is number => {
  return typeof input === 'number';
};

const User = Remesh.stream<number | null, User | null>({
  startValue: {
    input: null,
    output: null,
  },
  impl: (userId$) => {
    return userId$.pipe(
      filter(isNumber),
      map((userId) => {
        return {
          id: userId,
          name: `user: ${userId}`,
          email: 'abc',
        };
      })
    );
  },
});

type TimerAction =
  | {
      type: 'start';
      period?: number;
    }
  | {
      type: 'stop';
    };

const Timer = Remesh.stream<TimerAction, number>({
  startValue: {
    input: {
      type: 'stop',
    },
    output: 0,
  },
  impl: (action$, { emit }) => {
    return action$.pipe(
      switchMap((action) => {
        if (action.type === 'start') {
          return interval(action.period ?? 1000).pipe(
            tap(() => {
              emit(Counter.Input, 'incre');
            })
          );
        }
        return EMPTY;
      })
    );
  },
});

const CounterUI = () => {
  const count = useRemeshValue(Counter.Output);
  const counterEmitter = useRemeshEmitter(Counter.Input);
  const timerEmitter = useRemeshEmitter(Timer.Input);

  const handleIncre = () => {
    counterEmitter.emit('incre');
  };

  const handleDecre = () => {
    counterEmitter.emit('decre');
  };

  const handleReset = () => {
    counterEmitter.emit('reset');
  };

  const handleStart = () => {
    timerEmitter.emit({
      type: 'start',
      period: 100,
    });
  };

  const handleStop = () => {
    timerEmitter.emit({
      type: 'stop',
    });
  };

  useRemeshNode(Timer.Output);

  useEffect(() => {
    if (count >= 100) {
      ReactDOM.unmountComponentAtNode(document.getElementById('root')!);
    }
  }, [count]);

  return (
    <>
      <h2>{count}</h2>
      <Button onClick={handleIncre}>+1</Button>
      <Button onClick={handleDecre}>-1</Button>
      <Button onClick={handleReset}>reset</Button>
      <Button onClick={handleStart}>start</Button>
      <Button onClick={handleStop}>stop</Button>
    </>
  );
};

const TodoListUI = () => {
  const todos = useRemeshValue(FilteredTodoList);
};

ReactDOM.render(
  <React.StrictMode>
    <RemeshRoot
      options={{
        startValues: [Counter.Output.startWith(10)],
      }}
    >
      <div className={exampleStyle}>
        <Button>button</Button>
      </div>
      <CounterUI />
    </RemeshRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

export const a = 1;

export const b = false;
