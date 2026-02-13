import { Notifier } from "./Notifier";

/**
 * A class that notifies observers when its value changes.
 */
export class ValueChanged<T> extends Notifier<[T]> {
  #value: T;

  /**
   * Sets a new value for this instance, and notifies all observers if the value has changed.
   * @param newValue The new value to set.
   */
  set value(newValue: T) {
    if (newValue === this.#value) return;
    this.notify((this.#value = newValue));
  }

  setValue(newValue: T) {
    this.value = newValue
  }

  /**
   * Gets the current value of this instance.
   * @returns The current value.
   */
  get value() {
    return this.#value;
  }

  /**
   * Creates a new instance with an initial value and attaches it to a notifier.
   * @param initValue The initial value for this instance.
   */
  constructor(initValue: T) {
    super();
    this.#value = initValue;
  }
}
