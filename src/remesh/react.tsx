import React, {
  useEffect,
  useRef,
  useContext,
  createContext,
  ReactNode,
  useMemo,
  useState,
} from 'react';

import { Observer } from 'rxjs';
import { TaskInput } from '.';

import {
  Remesh,
  Task,
  TaskStore,
  TaskBasicContext,
  TaskOutput,
  TaskStoreOptions,
} from './remesh';

export type ReactTaskContext = {
  taskStore: TaskStore;
};

export const ReactTaskContext = createContext<ReactTaskContext | null>(null);

export const useTaskContext = () => {
  const context = useContext(ReactTaskContext);

  if (context === null) {
    throw new Error(`You may forgot to add <RemeshRoot />`);
  }

  return context;
};

export type RemeshRootProps = {
  children: ReactNode;
  options?: TaskStoreOptions;
};

export const RemeshRoot = (props: RemeshRootProps) => {
  const taskContextRef = useRef<ReactTaskContext | null>(null);

  if (taskContextRef.current === null) {
    taskContextRef.current = {
      taskStore: Remesh.store(props.options),
    };
  }

  useEffect(() => {
    return () => {
      taskContextRef.current?.taskStore.unsubscribeAll();
    };
  }, []);

  return (
    <ReactTaskContext.Provider value={taskContextRef.current}>
      {props.children}
    </ReactTaskContext.Provider>
  );
};

export const useRemeshTask = <I, O>(
  Task: Task<I, O>,
  observer?: Partial<Observer<O>>
) => {
  const taskContext = useTaskContext();

  const observerRef = useRef<typeof observer>(observer);

  useEffect(() => {
    observerRef.current = observer;
  });

  useEffect(() => {
    const subscription = taskContext.taskStore.subscribe(Task, {
      next: (data) => observerRef.current?.next?.(data),
      error: (error) => observerRef.current?.error?.(error),
      complete: () => observerRef.current?.complete?.(),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
};

export const useRemeshValue = <I, O>(Task: Task<I, O>, initialState: O) => {
  const [value, setValue] = useState<O>(initialState);

  useRemeshTask(Task, { next: setValue });

  return value;
};

export type TaskEmitter<T extends Task> = (value: TaskInput<T>) => void;

export const useRemeshEmitter = <T extends Task<any, any>>(
  Task: T
): TaskEmitter<T> => {
  const taskContext = useTaskContext();

  const emitter = useMemo((): TaskEmitter<T> => {
    return (value) => {
      taskContext.taskStore.emit(Task, value);
    };
  }, [Task, taskContext]);

  return emitter;
};

export const useRemeshState = <I, O>(Task: Task<I, O>, initialState: O) => {
  const state = useRemeshValue(Task, initialState);
  const emit = useRemeshEmitter(Task);

  return [state, emit] as const;
};
