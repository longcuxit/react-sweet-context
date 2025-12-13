import { vi, beforeEach, describe, it, expect } from "vitest";
import { ValueChanged } from "../ValueChanged";

describe("ValueChanged", () => {
  let valueChanged: ValueChanged<string>;

  beforeEach(() => {
    valueChanged = new ValueChanged("initial");
  });

  it("should initialize with the correct initial value", () => {
    expect(valueChanged.value).toBe("initial");
  });

  it("should notify observers when value changes", () => {
    const listener = vi.fn();

    valueChanged.listen(listener);

    valueChanged.value = "new value";

    expect(listener).toHaveBeenCalledWith("new value");
  });

  it("should not notify observers when value does not change", () => {
    const listener = vi.fn();

    valueChanged.listen(listener);

    valueChanged.value = "initial";

    expect(listener).not.toHaveBeenCalled();
  });

  it("should notify all observers when value changes", () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    valueChanged.listen(listener1);
    valueChanged.listen(listener2);

    valueChanged.value = "another value";

    expect(listener1).toHaveBeenCalledWith("another value");
    expect(listener2).toHaveBeenCalledWith("another value");
  });

  it("should update value when setter is called", () => {
    valueChanged.value = "updated value";

    expect(valueChanged.value).toBe("updated value");
  });

  it("should handle different value types", () => {
    const numberValue = new ValueChanged(42);
    const booleanValue = new ValueChanged(true);

    expect(numberValue.value).toBe(42);
    expect(booleanValue.value).toBe(true);

    numberValue.value = 100;
    booleanValue.value = false;

    expect(numberValue.value).toBe(100);
    expect(booleanValue.value).toBe(false);
  });

  it("should return a function that removes the listener when listen is called", () => {
    const listener = vi.fn();

    const removeListener = valueChanged.listen(listener);

    expect(typeof removeListener).toBe("function");

    removeListener();

    valueChanged.value = "test value";
    expect(listener).not.toHaveBeenCalled();
  });

  it("should remove listener when dispose is called", () => {
    const listener = vi.fn();
    const valueChanged = new ValueChanged(42);

    valueChanged.listen(listener);

    valueChanged.dispose();

    valueChanged.value = 1;
    expect(listener).not.toHaveBeenCalled();
  });
});
