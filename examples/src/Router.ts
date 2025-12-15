import { lazy } from "react";
const SimpleLess = lazy(() => import("./examples/simple-less"));
const AsyncAction = lazy(() => import("./examples/async-action"));
const MultiActions = lazy(() => import("./examples/multi-actions"));
const MultiStates = lazy(() => import("./examples/multi-states"));
const multiInstance = lazy(() => import("./examples/multi-instance"));

export const routers: Record<string, ExampleItem> = {
  "simple-less": {
    title: "Simple less store",
    component: SimpleLess,
  },
  "async-action": {
    title: "Async Action",
    component: AsyncAction,
  },
  "multi-actions": {
    title: "Multi Actions",
    component: MultiActions,
  },
  "multi-states": {
    title: "Multi State",
    component: MultiStates,
  },
  "multi-instance": {
    title: "Multi Instance",
    component: multiInstance,
  },
};
