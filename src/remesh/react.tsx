import React, {
  useEffect,
  useRef,
  useContext,
  createContext,
  ReactNode,
  useMemo,
  useState,
} from 'react';

import {
  RemeshAtom,
  RemeshNode,
  RemeshStream,
  RemeshStore,
  RemeshStoreOptions,
} from './remesh';

const noop = () => {};

export type RemeshReactContext = {
  remeshStore: RemeshStore;
};

export const RemeshReactContext = createContext<RemeshReactContext | null>(
  null
);

export const useRemeshReactContext = () => {
  const context = useContext(RemeshReactContext);

  if (context === null) {
    throw new Error(`You may forgot to add <RemeshRoot />`);
  }

  return context;
};

export const useRemeshStore = () => {
  const context = useRemeshReactContext();
  return context.remeshStore;
};

export type RemeshRootProps = {
  children: ReactNode;
  options?: RemeshStoreOptions;
};

export const RemeshRoot = (props: RemeshRootProps) => {
  const taskContextRef = useRef<RemeshReactContext | null>(null);

  if (taskContextRef.current === null) {
    taskContextRef.current = {
      remeshStore: RemeshStore(props.options),
    };
  }

  useEffect(() => {
    return () => {
      taskContextRef.current?.remeshStore.unsubscribeAll();
    };
  }, []);

  return (
    <RemeshReactContext.Provider value={taskContextRef.current}>
      {props.children}
    </RemeshReactContext.Provider>
  );
};

export const useRemeshValueCallback = function <T>(
  Node: RemeshNode<T>,
  valueHandler: (value: T) => unknown
) {
  const remeshStore = useRemeshStore();

  const valueHandlerRef = useRef(valueHandler);

  useEffect(() => {
    valueHandlerRef.current = valueHandler;
  });

  useEffect(() => {
    const subscription = remeshStore.subscribe(Node, {
      next: (newValue) => {
        valueHandlerRef.current(newValue);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [Node, remeshStore]);
};

export const useRemeshValue = function <T>(Node: RemeshNode<T>) {
  const remeshStore = useRemeshStore();
  const [value, setValue] = useState(() => remeshStore.getValue(Node));

  useRemeshValueCallback(Node, setValue);

  return value;
};

export const useRemeshNode = function <T>(Node: RemeshNode<T>) {
  useRemeshValueCallback(Node, noop);
};

export const useRemeshErrorCallback = function <T>(
  Node: RemeshNode<T>,
  errorHandler: (error: Error) => unknown
) {
  const remeshStore = useRemeshStore();

  const errorHandlerRef = useRef(errorHandler);

  useEffect(() => {
    errorHandlerRef.current = errorHandler;
  });

  useEffect(() => {
    const subscription = remeshStore.subscribe(Node, {
      error: (error) => {
        errorHandlerRef.current(error);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [Node, remeshStore]);
};

export type RemeshEmitter<T> = {
  emit: (value: T) => void;
  emitError: (error: Error) => void;
};

export const useRemeshEmitter = function <T>(
  Atom: RemeshAtom<T>
): RemeshEmitter<T> {
  const remeshStore = useRemeshStore();

  const emitter = useMemo((): RemeshEmitter<T> => {
    return {
      emit: (value) => {
        remeshStore.emit(Atom, value);
      },
      emitError: (error) => {
        remeshStore.emitError(Atom, error);
      },
    };
  }, [Atom, remeshStore]);

  return emitter;
};

export const useRemeshAtom = function <T>(Atom: RemeshAtom<T>) {
  const state = useRemeshValue(Atom);
  const emitter = useRemeshEmitter(Atom);

  return [state, emitter] as const;
};

export const useRemeshStream = function <I, O>(Stream: RemeshStream<I, O>) {};
