import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>");

globalThis.window = dom.window as any;
globalThis.document = dom.window.document as any;
globalThis.navigator = dom.window.navigator as any;