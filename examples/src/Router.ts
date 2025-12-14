import SimpleLess from "./examples/simple-less";
import AsyncAction from "./examples/async-action";
import MultiActions from "./examples/multi-actions";
import MultiStates from "./examples/multi-states";
import multiInstance from "./examples/multi-instance";

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
