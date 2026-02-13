import { createSweetContext, createHook } from "../SweetContext";

type LoaderState = {
  pending: number;
  loaded: number;
  errors: number;
  total: number;
};

type LoaderAction = <T>(p: Promise<T>) => Promise<T>;

export const LoaderContext = createSweetContext<LoaderState, LoaderAction>({
  name: "Loader",
  initState: { pending: 0, loaded: 0, errors: 0, total: 0 },
  action: (api) => {
    let pendingCount = 0;
    let errorCount = 0;

    const update = () => {
      api.set((prev: LoaderState) => ({
        ...prev,
        pending: pendingCount,
        loaded: pendingCount > 0 ? prev.total - errorCount - pendingCount : 0,
        errors: pendingCount > 0 ? errorCount : 0,
        total: pendingCount > 0 ? prev.total : 0,
      }));
    };

    const push = <T>(p: Promise<T>): Promise<T> => {
      pendingCount++;
      update();

      return p
        .catch(() => {
          errorCount++;
        })
        .finally(() => {
          pendingCount--;
          errorCount--;
          update();
        }) as Promise<T>;
    };

    return push as LoaderAction;
  },
});

export const useLoader = createHook(LoaderContext);

export default LoaderContext;
