import {
  Observable,
  Subject,
  Subscription,
  Observer,
  combineLatest,
  of,
} from 'rxjs';

import { shareReplay, startWith } from 'rxjs/operators';

export type TaskBasicContext = {
  get: <T extends Task<any, any>>(Task: T) => Observable<TaskOutput<T>>;
  getInput: <T extends Task<any, any>>(Task: T) => Observable<TaskInput<T>>;
  emit: <T extends Task<any, any>>(Task: T, value: TaskInput<T>) => void;
};

export type TaskPreloadContext<I, O> = {
  preloadedInputValue?: I;
  preloadedOutputValue?: O;
};

export type TaskPreload<I = unknown, O = unknown> = TaskPreloadContext<I, O> & {
  Task: Task<I, O>;
};

export type TaskContext<I, O> = TaskBasicContext & TaskPreloadContext<I, O>;

export type Task<I = unknown, O = unknown> = {
  kind: 'Task';
  name: string;
  task: (input$: Observable<I>, context: TaskContext<I, O>) => Observable<O>;
  preload: (options: { input?: I; output?: O }) => TaskPreload<I, O>;
};

export type TaskInput<T extends Task> = T extends Task<infer I, any>
  ? I
  : never;

export type TaskOutput<T extends Task> = T extends Task<any, infer O>
  ? O
  : never;

export type TaskOptions<I, O> = {
  name: string;
  task: Task<I, O>['task'];
};

export type AtomOptions<I> = {
  name: string;
  startValue: I;
};

export type Atom<I> = Task<I, I>;

export type SelectorGetterContext = {
  get: TaskBasicContext['get'];
  getInput: TaskBasicContext['getInput'];
};

export type SelectorOptions<O> = {
  name: string;
  get: (context: SelectorGetterContext) => Observable<O>;
};

export type Selector<O> = Task<void, O>;

export const Remesh = {
  task: <I, O>(options: TaskOptions<I, O>): Task<I, O> => {
    const Task: Task<I, O> = {
      kind: 'Task',
      name: options.name,
      task: options.task,
      preload: (options): TaskPreload<I, O> => {
        return {
          preloadedInputValue: options.input,
          preloadedOutputValue: options.output,
          Task,
        };
      },
    };
    return Task;
  },
  atom: <I>(options: AtomOptions<I>): Atom<I> => {
    return Remesh.task({
      name: options.name,
      task: (input$) => {
        return input$.pipe(startWith(options.startValue));
      },
    });
  },
  selector: <O>(options: SelectorOptions<O>): Selector<O> => {
    return Remesh.task({
      name: options.name,
      task: (_, context) => {
        return options.get({
          get: context.get,
          getInput: context.getInput,
        });
      },
    });
  },
  get store() {
    return createStore;
  },
};

export type TaskStore = ReturnType<typeof createStore>;

export type TaskStoreOptions = {
  preloaded?: TaskPreload<any, any>[];
};

export const createStore = (options?: TaskStoreOptions) => {
  const storage = {
    subject: {
      input: new Map<Task<any, any>, Subject<any>>(),
    },
    observable: {
      input: new Map<Task<any, any>, Observable<any>>(),
      output: new Map<Task<any, any>, Observable<any>>(),
    },
    subscription: new Set<Subscription>(),
  };

  const getPreloaded = <I, O>(
    Task: Task<I, O>
  ): TaskPreload<I, O> | undefined => {
    if (!options?.preloaded) {
      return;
    }

    for (const preloaded of options.preloaded) {
      if (preloaded.Task === Task) {
        return preloaded as TaskPreload<I, O>;
      }
    }
  };

  const getTaskStore = <I, O>(Task: Task<I, O>) => {
    let inputSubject = storage.subject.input.get(Task);
    let input$ = storage.observable.input.get(Task);
    let output$ = storage.observable.output.get(Task);

    if (!inputSubject || !input$ || !output$) {
      const preloaded = getPreloaded(Task);

      inputSubject = new Subject<I>();
      input$ = inputSubject.asObservable();
      output$ = Task.task(input$, {
        ...taskContext,
        preloadedInputValue: preloaded?.preloadedInputValue,
        preloadedOutputValue: preloaded?.preloadedOutputValue,
      }).pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );

      storage.subject.input.set(Task, inputSubject);
      storage.observable.input.set(Task, input$);
      storage.observable.output.set(Task, output$);
    }

    return {
      inputSubject,
      input$,
      output$,
    };
  };

  const taskContext: TaskBasicContext = {
    get: (Task) => {
      return getTaskStore(Task).output$;
    },
    getInput: (Task) => {
      return getTaskStore(Task).input$;
    },
    emit: (Task, input) => {
      getTaskStore(Task).inputSubject.next(input);
    },
  };

  const subscribe = <I, O>(
    Task: Task<I, O>,
    observer: Partial<Observer<O>>
  ): Subscription => {
    const observable = getTaskStore(Task).output$ as Observable<O>;
    const subscription = observable.subscribe(observer);

    storage.subscription.add(subscription);

    subscription.add(() => {
      storage.subscription.delete(subscription);
    });

    return subscription;
  };

  const unsubscribeAll = () => {
    for (const subscription of storage.subscription) {
      subscription.unsubscribe();
    }
  };

  return {
    ...taskContext,
    subscribe,
    unsubscribeAll,
  };
};
