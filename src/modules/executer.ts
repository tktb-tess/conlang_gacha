type PromiseState<T> =
  | {
      state: "pending";
      promise: Promise<T>;
    }
  | {
      state: "fulfilled";
      value: T;
    }
  | {
      state: "rejected";
      error: unknown;
    };

export default class PromiseExecuter<T> {
  #state: PromiseState<T>;

  constructor(promise: Promise<T>) {
    promise
      .then((r) => {
        this.#state = {
          state: "fulfilled",
          value: r,
        };
      })
      .catch((err) => {
        this.#state = {
          state: "rejected",
          error: err,
        };
      });

    this.#state = {
      state: "pending",
      promise,
    };
  }

  get() {
    switch (this.#state.state) {
      case "fulfilled": {
        return this.#state.value;
      }
      case "rejected": {
        throw this.#state.error;
      }
      case "pending": {
        throw this.#state.promise;
      }
    }
  }
}

export const useData = <T>(promise: Promise<T>) => {
    const exe = new PromiseExecuter(promise);
    return exe.get();
};
