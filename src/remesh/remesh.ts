import { Observable, Subject, Subscription, Observer } from 'rxjs';

import { distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';

import shallowEqual from 'shallowequal';

export const Remesh = {
  get atom() {
    return RemeshAtom;
  },
  get pack() {
    return RemeshPack;
  },
  get stream() {
    return RemeshStream;
  },
  get store() {
    return RemeshStore;
  },
};

export type RemeshContext = {
  get: <T>(Node: RemeshNode<T>) => Observable<T>;
  getValue: <T>(Node: RemeshNode<T>) => T;
  emit: <T>(Atom: RemeshAtom<T>, value: T) => void;
  emitError: <T>(Atom: RemeshAtom<T>, error: Error) => void;
};

export type StartValue<T extends RemeshNode<any> = RemeshNode<unknown>> = {
  type: 'StartValue';
  RemeshNode: T;
  value: RemeshNodeValue<T>;
};

export type RemeshAtom<T = unknown> = {
  type: 'RemeshAtom';
  name?: string;
  startValue: T;
  startWith: (value: T) => StartValue<RemeshNode<T>>;
};

export type RemeshPackContext<T> = RemeshContext & {
  startValue: T;
};

export type RemeshPack<T = unknown> = {
  type: 'RemeshPack';
  name?: string;
  startValue: T;
  impl: ($: RemeshPackContext<T>) => Observable<T>;
  startWith: (value: T) => StartValue<RemeshPack<T>>;
};

export type RemeshNode<T = unknown> = RemeshAtom<T> | RemeshPack<T>;

export type RemeshNodeValue<T extends RemeshNode> = T extends RemeshNode<
  infer U
>
  ? U
  : never;

export type RemeshAtomOptions<T> = {
  name?: RemeshNode<T>['name'];
  startValue: RemeshNode<T>['startValue'];
};

export const RemeshAtom = <T>(options: RemeshAtomOptions<T>): RemeshAtom<T> => {
  const Atom: RemeshNode<T> = {
    ...options,
    type: 'RemeshAtom',
    startWith: (value) => {
      return {
        type: 'StartValue',
        RemeshNode: Atom,
        value: value,
      };
    },
  };

  return Atom;
};

export type RemeshPackOptions<T> = {
  name?: RemeshPack<T>['name'];
  startValue: RemeshPack<T>['startValue'];
  impl: RemeshPack<T>['impl'];
};

export const RemeshPack = <T>(options: RemeshPackOptions<T>): RemeshPack<T> => {
  const Pack: RemeshPack<T> = {
    ...options,
    type: 'RemeshPack',
    startWith: (value) => {
      return {
        type: 'StartValue',
        RemeshNode: Pack,
        value: value,
      };
    },
  };

  return Pack;
};

export type RemeshStreamStartValue<I, O> = {
  input: I;
  output: O;
};

export type RemeshStreamContext<I, O> = RemeshContext & {
  startValue: RemeshStreamStartValue<I, O>;
};

export type RemeshStream<I, O> = {
  type: 'RemeshStream';
  name?: string;
  startValue: RemeshStreamStartValue<I, O>;
  impl: (input$: Observable<I>, $: RemeshStreamContext<I, O>) => Observable<O>;
  Input: RemeshAtom<I>;
  Output: RemeshPack<O>;
};

export type RemeshStreamOptions<I, O> = {
  name?: RemeshStream<I, O>['name'];
  startValue: RemeshStream<I, O>['startValue'];
  impl: RemeshStream<I, O>['impl'];
};

export const RemeshStream = function <I, O>(
  options: RemeshStreamOptions<I, O>
): RemeshStream<I, O> {
  const Input: RemeshStream<I, O>['Input'] = RemeshAtom({
    name: options.name !== undefined ? `Input(${options.name})` : undefined,
    startValue: options.startValue.input,
  });

  const Output: RemeshStream<I, O>['Output'] = RemeshPack({
    name: options.name !== undefined ? `Output(${options.name})` : undefined,
    startValue: options.startValue.output,
    impl: ($) => {
      const input$ = $.get(Input);
      const startValue = {
        input: $.getValue(Input),
        output: $.startValue,
      };
      const remeshStreamContext: RemeshStreamContext<I, O> = {
        ...$,
        startValue,
      };

      return options.impl(input$, remeshStreamContext);
    },
  });

  return {
    ...options,
    type: 'RemeshStream',
    Input,
    Output,
  };
};

export type RemeshStoreOptions = {
  startValues?: StartValue<RemeshNode<any>>[];
};

type RemeshAtomStorage<T = unknown> = {
  subject: Subject<T>;
  observable: Observable<T>;
  value: T;
};

type RemeshPackStorage<T = unknown> = {
  observable: Observable<T>;
  value: T;
};

export type RemeshStore = ReturnType<typeof RemeshStore>;

export const RemeshStore = (options?: RemeshStoreOptions) => {
  const storage = {
    atom: new Map<RemeshAtom<any>, RemeshAtomStorage<any>>(),
    pack: new Map<RemeshPack<any>, RemeshPackStorage<any>>(),
    subscription: new Map<RemeshNode<any>, Set<Subscription>>(),
  };

  const getStartValue = <T>(Node: RemeshNode<T>) => {
    if (!options?.startValues) {
      return Node.startValue;
    }

    for (const startValue of options.startValues) {
      if (startValue.RemeshNode === Node) {
        return startValue.value as T;
      }
    }

    return Node.startValue;
  };

  const getAtomStorage = <T>(Atom: RemeshAtom<T>): RemeshAtomStorage<T> => {
    let atomStorage = storage.atom.get(Atom);

    if (!atomStorage) {
      const startValue = getStartValue(Atom);
      const subject = new Subject<T>();
      const observable = subject.pipe(
        tap({
          next: (newValue) => {
            currentAtomStorage.value = newValue;
          },
          complete: () => {
            currentAtomStorage.value = startValue;
          },
          error: () => {
            currentAtomStorage.value = startValue;
          },
        }),
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );

      const currentAtomStorage: RemeshAtomStorage<T> = {
        subject,
        observable,
        value: startValue,
      };

      atomStorage = currentAtomStorage;
      storage.atom.set(Atom, atomStorage);
    }

    return atomStorage;
  };

  const getPackStorage = <T>(Pack: RemeshPack<T>): RemeshPackStorage<T> => {
    let packStorage = storage.pack.get(Pack);

    if (!packStorage) {
      const startValue = getStartValue(Pack);
      const remeshPackContext: RemeshPackContext<T> = {
        ...remeshContext,
        startValue,
      };
      const observable = Pack.impl(remeshPackContext).pipe(
        tap({
          next: (newValue) => {
            currentPackStorage.value = newValue;
          },
          error: () => {
            currentPackStorage.value = startValue;
          },
          complete: () => {
            currentPackStorage.value = startValue;
          },
        }),
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );

      const currentPackStorage: RemeshPackStorage<T> = {
        observable,
        value: startValue,
      };

      packStorage = currentPackStorage;
      storage.pack.set(Pack, packStorage);
    }

    return packStorage;
  };

  const remeshContext: RemeshContext = {
    get: (Node) => {
      if (Node.type === 'RemeshAtom') {
        return getAtomStorage(Node).observable;
      }

      if (Node.type === 'RemeshPack') {
        return getPackStorage(Node).observable;
      }

      throw new Error(`Unknown Node in $.get(Node): ${Node}`);
    },
    getValue: (Node) => {
      if (Node.type === 'RemeshAtom') {
        return getAtomStorage(Node).value;
      }

      if (Node.type === 'RemeshPack') {
        return getPackStorage(Node).value;
      }

      throw new Error(`Unknown Node in $.get(Node): ${Node}`);
    },
    emit: (Atom, value) => {
      getAtomStorage(Atom).subject.next(value);
    },
    emitError: (Atom, error) => {
      getAtomStorage(Atom).subject.error(error);
    },
  };

  const getSubscriptionSet = <T>(Node: RemeshNode<T>): Set<Subscription> => {
    let subscriptionSet = storage.subscription.get(Node);

    if (!subscriptionSet) {
      subscriptionSet = new Set();
      storage.subscription.set(Node, subscriptionSet);
    }

    return subscriptionSet;
  };

  const clearNode = <T>(Node: RemeshNode<T>) => {
    const subscriptionSet = getSubscriptionSet(Node);

    if (Node.type === 'RemeshAtom') {
      storage.atom.delete(Node);
    } else if (Node.type === 'RemeshPack') {
      storage.pack.delete(Node);
    }

    for (const subscription of subscriptionSet) {
      subscription.unsubscribe();
    }
  };

  const subscribe = <T>(
    Node: RemeshNode<T>,
    observer: Partial<Observer<T>>
  ): Subscription => {
    const observable = remeshContext.get(Node);

    /**
     * Only trigger next value when changed
     */
    const subscription = observable
      .pipe(distinctUntilChanged(shallowEqual))
      .subscribe(observer);

    const subscriptionSet = getSubscriptionSet(Node);

    subscriptionSet.add(subscription);

    subscription.add(() => {
      const subscriptionSet = getSubscriptionSet(Node);

      subscriptionSet.delete(subscription);

      /**
       * clear subscription set if no subscription left
       */
      if (subscriptionSet.size === 0) {
        clearNode(Node);
      }
    });

    return subscription;
  };

  const unsubscribeAll = () => {
    for (const Atom of storage.atom.keys()) {
      clearNode(Atom);
    }

    for (const Pack of storage.pack.keys()) {
      clearNode(Pack);
    }
  };

  return {
    ...remeshContext,
    subscribe,
    unsubscribeAll,
  };
};
