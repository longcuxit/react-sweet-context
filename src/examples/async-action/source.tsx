import { createHook, createSweetContext } from "react-sweet-context";

export const context = createSweetContext({
  initState: false,
  action({ set }) {
    return async () => {
      set(true);
      await new Promise((next) => setTimeout(next, 2000));
      set(false);
    };
  },
});

const useLoading = createHook(context);

export const TryLoading = () => {
  const [isLoading, load] = useLoading();
  return (
    <button onClick={load} disabled={isLoading}>
      {isLoading ? "Loading..." : "Load"}
    </button>
  );
};
