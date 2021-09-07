import {
  Observable,
  Subject,
  Subscription,
  Observer,
  interval,
  combineLatest,
} from 'rxjs';
import { map, switchMap, startWith, scan, shareReplay } from 'rxjs/operators';

export type TaskContext = {
  get: <T extends Task<any, any>>(Task: T) => Observable<TaskOutput<T>>;
  emit: <T extends Task<any, any>>(Task: T, value: TaskInput<T>) => void;
};

export type Task<I = unknown, O = unknown, N extends string = string> = {
  kind: 'Task';
  name: N;
  task: (input$: Observable<I>, context: TaskContext) => Observable<O>;
};

export type TaskName<T extends Task> = T extends Task<any, any, infer N>
  ? N
  : never;

export type TaskInput<T extends Task> = T extends Task<infer I, any, any>
  ? I
  : never;

export type TaskOutput<T extends Task> = T extends Task<any, infer O, any>
  ? O
  : never;

export type Definition<N extends string> = {
  task: <I, O>(task: Task<I, O, N>['task']) => Task<I, O, N>;
  atom: <O>(startValue?: O) => Task<O, O, N>;
  input: <I>(startValue?: I) => {
    output: <O>(task: Task<I, O, N>['task']) => Task<I, O, N>;
  };
  output: <O>(
    task: (context: TaskContext) => Observable<O>
  ) => Task<void, O, N>;
};

export const define = <N extends string>(name: N): Definition<N> => {
  const definition: Definition<N> = {
    task: (producer) => {
      return {
        kind: 'Task',
        name,
        task: producer,
      };
    },
    atom: (startValue) => {
      return definition.input(startValue).output((input$) => input$);
    },
    input: (startValue) => {
      return {
        output: (task) => {
          return definition.task((input$, context) => {
            const finalInput$ =
              startValue !== undefined
                ? input$.pipe(startWith(startValue))
                : input$;

            return task(finalInput$, context);
          });
        },
      };
    },
    output: (task) => {
      return definition.task((_, ctx) => task(ctx));
    },
  };

  return definition;
};

export const createStore = () => {
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

  const getTaskStore = <I, O, N extends string>(Task: Task<I, O, N>) => {
    let inputSubject = storage.subject.input.get(Task);
    let input$ = storage.observable.input.get(Task);
    let output$ = storage.observable.output.get(Task);

    if (!inputSubject || !input$ || !output$) {
      inputSubject = new Subject<I>();
      input$ = inputSubject.asObservable();
      output$ = Task.task(input$, taskContext).pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );
    }

    storage.subject.input.set(Task, inputSubject);
    storage.observable.input.set(Task, input$);
    storage.observable.output.set(Task, output$);

    return {
      inputSubject,
      input$,
      output$,
    };
  };

  const taskContext: TaskContext = {
    get: (Task) => {
      return getTaskStore(Task).output$;
    },
    emit: (Task, input) => {
      getTaskStore(Task).inputSubject.next(input);
    },
  };

  const subscribe = <I, O, N extends string = string>(
    Task: Task<I, O, N>,
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

type CountAction = 'incre' | 'decre' | 'reset' | 'noop';

const CountAction = define('CountAction').atom<CountAction>('noop');

const Count = define('Count').output(({ get }) => {
  return get(CountAction).pipe(
    scan((count, action) => {
      if (action === 'noop') return count;
      if (action === 'incre') return count + 1;
      if (action === 'decre') return count - 1;
      if (action === 'reset') return 0;
      return count;
    }, 0)
  );
});

const CountActionHistory = define('CountActionHistory').output(({ get }) => {
  return get(CountAction).pipe(
    scan((history, action) => [...history, action], [] as CountAction[])
  );
});

const Interval = define('Interval')
  .input(1000)
  .output((period$) => {
    return period$.pipe(
      switchMap((period) => {
        return interval(period);
      })
    );
  });

type User = {
  id: number;
  name: string;
  email: string;
};

const User = define('User')
  .input(100)
  .output((userId$) => {
    return userId$.pipe(
      map((userId) => {
        return {
          id: userId,
          name: `user: ${userId}`,
          email: 'abc',
        } as User;
      })
    );
  });

const Main = define('Main').output(({ get }) => {
  return combineLatest({
    interval: get(Interval),
    user: get(User),
    count: get(Count),
    countActionHistory: get(CountActionHistory),
  });
});

const store = createStore();

store.subscribe(Main, {
  next: (data) => {
    console.log('data', JSON.stringify(data, null, 2));
  },
});

// store.emit()

setInterval(() => {
  const actions = ['incre', 'decre'] as const;
  store.emit(CountAction, actions[Math.floor(Math.random() * actions.length)]);
}, 2000);
