import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../components';
import { exampleStyle } from './styles.css';

import { interval, combineLatest, EMPTY, NEVER } from 'rxjs';
import { map, switchMap, scan, tap, filter, startWith } from 'rxjs/operators';

import { Remesh } from './remesh';

import {
  useRemeshTask,
  useRemeshEmitter,
  RemeshRoot,
  useRemeshState,
} from './remesh/react';

type CountAction =
  | 'incre'
  | 'decre'
  | 'reset'
  | 'noop'
  | {
      step: number;
    };

const Counter = Remesh.task<CountAction, number>({
  name: 'Counter',
  task: (action$, { preloadedOutputValue }) => {
    return action$.pipe(
      startWith('noop' as const),
      scan((count, action) => {
        if (action === 'noop') return count;
        if (action === 'incre') return count + 1;
        if (action === 'decre') return count - 1;
        if (action === 'reset') return 0;
        return count + action.step;
      }, preloadedOutputValue ?? 0)
    );
  },
});

type User = {
  id: number;
  name: string;
  email: string;
};

const User = Remesh.task<User['id'], User>({
  name: 'User',
  task: (userId$) => {
    return userId$.pipe(
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

const Timer = Remesh.task<TimerAction, number>({
  name: 'Timer',
  task: (action$, { emit }) => {
    return action$.pipe(
      switchMap((action) => {
        if (action.type === 'start') {
          return interval(action.period ?? 1000).pipe(
            tap(() => {
              console.log('tap');
              emit(Counter, 'incre');
            })
          );
        }
        return NEVER;
      })
    );
  },
});

const CounterUI = () => {
  const [count, emitCountAction] = useRemeshState(Counter, 0);

  const emitTimerAction = useRemeshEmitter(Timer);

  const handleIncre = () => {
    emitCountAction('incre');
  };

  const handleDecre = () => {
    emitCountAction('decre');
  };

  const handleReset = () => {
    emitCountAction('reset');
  };

  const handleStart = () => {
    emitTimerAction({
      type: 'start',
      period: 100,
    });
  };

  const handleStop = () => {
    emitTimerAction({
      type: 'stop',
    });
  };

  useRemeshTask(Timer);

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
      <Button onClick={handleStop}>Stop</Button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <RemeshRoot
      options={{
        preloaded: [
          Counter.preload({
            output: 10,
          }),
        ],
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
