export type NotifierListener<Args extends unknown[] = []> = (
  ...args: Args
) => void;

/**
 * A notifier class that allows listeners to be added and removed,
 * and notifies them when an event occurs.
 */
export class Notifier<Args extends unknown[] = []> {
  /**
   * An array of listener functions that will be called when the notify method is invoked.
   * @private
   */
  private _listeners: NotifierListener<Args>[] = [];

  /**
   * Notifies all listeners by calling their respective callback functions.
   * @protected
   */
  protected notify(...args: Args) {
    if (!this._listeners.length) return;
    this._listeners.slice(0).forEach((listener) => listener.apply(this, args));
  }

  /**
   * Adds a new listener to the notifier and returns a function that can be used to remove the listener later.
   * @param listener The listener function to add.
   * @returns A function that removes the listener when called.
   */
  listen(listener: NotifierListener<Args>): () => void {
    this._listeners.push(listener);
    return () => this.unListen(listener);
  }
  /**
   * Removes a listener from the notifier.
   * @param listener The listener function to remove.
   */
  unListen(listener: NotifierListener<Args>) {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }

  /**
   * Clears all listeners from the listener array.
   */
  dispose() {
    this._listeners.length = 0;
  }
}
