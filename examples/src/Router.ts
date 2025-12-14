import { lazy } from "react";

export const routers: Record<string, ExampleItem> = {
  "simple-less": {
    title: "Simple less store",
    component: lazy(() => import("./examples/simple-less")),
  },
  "async-action": {
    title: "Async Action",
    component: lazy(() => import("./examples/async-action")),
  },
  "multi-actions": {
    title: "Multi Actions",
    component: lazy(() => import("./examples/multi-actions")),
  },
  "multi-states": {
    title: "Multi States",
    component: lazy(() => import("./examples/multi-states")),
  },
  "multi-instance": {
    title: "Multi Instance",
    component: lazy(() => import("./examples/multi-instance")),
  },
};
