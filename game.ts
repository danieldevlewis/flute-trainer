import { notes, Listener } from "./frequency.ts";

export class Game {
  #listener: Listener;
  #events = new Map<string, Array<(event: CustomEvent) => void>>();

  constructor() {
    this.#listener = new Listener();
  }

  async play(signal = new AbortController().signal) {
    await this.#listener.start();

    do {
      await this.#round(signal);
      if (signal.aborted) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (true);
  }

  addEventListener(name: string, listener: (event: CustomEvent) => void) {
    let events = this.#events.get(name);
    if (!events) {
      events = [];
      this.#events.set(name, events);
    }
    events.push(listener);
  }

  removeEventListener(name: string, listener: (event: CustomEvent) => void) {
    const events = this.#events.get(name);
    if (!events) {
      return;
    }
    const index = events.indexOf(listener);
    if (index > -1) {
      events.splice(index, 1);
    }
  }

  dispatchEvent(event: CustomEvent) {
    this.#events.get(event.type)?.forEach((listener) => listener(event));
  }

  async #round(gameSignal: AbortSignal) {
    const note = this.#randomNote();
    const controller = new AbortController();
    this.#showNote(note, controller.signal);
    this.#showFingering(note, controller.signal);
    const event = new CustomEvent("start-round", { detail: note });
    this.dispatchEvent(event);

    let recievedNote: string;
    do {
      try {
        recievedNote = await this.#listener.waitForNote(gameSignal);
      } catch (e) {
        if (gameSignal.aborted) {
          return;
        }
        throw e;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
      console.log(recievedNote, note);
    } while (recievedNote !== note);
    controller.abort();
  }

  #randomNote(): string {
    return `${notes[this.#randomInt(11)]}-${[4, 5][this.#randomInt(2)]}`;
  }

  #showNote(note: string, signal: AbortSignal) {
    const timeout = window.setTimeout(() => {
      if (!signal.aborted) {
        const event = new CustomEvent("show-note", { detail: note });
        this.dispatchEvent(event);
      }
    }, 2000);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timeout);
    });
  }

  #showFingering(note: string, signal: AbortSignal) {
    const timeout = window.setTimeout(() => {
      if (!signal.aborted) {
        const event = new CustomEvent("show-fingering", { detail: note });
        this.dispatchEvent(event);
      }
    }, 4000);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timeout);
    });
  }

  #randomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
