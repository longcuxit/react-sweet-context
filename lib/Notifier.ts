export type NotifierListener<Args extends unknown[] = []> = (
  ...args: Args
) => void;

/**
 * A notifier class that allows listeners to be added and removed,
 * and notifies them when an event occurs.
 */
export class Notifier<Args extends unknown[] = []> {
  /**
   * A Set of listener functions that will be called when the notify method is invoked.
   * Using Set provides O(1) performance for add/delete operations and prevents duplicates.
   */
  #listeners: Set<NotifierListener<Args>> = new Set();

  /**
   * Notifies all listeners by calling their respective callback functions.
   * @internal This method is public for subclass access but should not be called externally.
   */
  notify(...args: Args) {
    if (!this.#listeners.size) return;
    this.#listeners.forEach((listener) => listener.apply(this, args));
  }

  /**
   * Adds a new listener to the notifier and returns a function that can be used to remove the listener later.
   * @param listener The listener function to add.
   * @returns A function that removes the listener when called.
   */
  listen(listener: NotifierListener<Args>): () => void {
    this.#listeners.add(listener);
    return () => this.unListen(listener);
  }
  /**
   * Removes a listener from the notifier.
   * @param listener The listener function to remove.
   */
  unListen(listener: NotifierListener<Args>) {
    this.#listeners.delete(listener);
  }

  /**
   * Clears all listeners from the listener set.
   */
  dispose() {
    this.#listeners.clear();
  }
}
