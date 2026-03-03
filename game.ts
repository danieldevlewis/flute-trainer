import { notes, Listener } from "./frequency.ts";

export class Game {
  #listener: Listener;

  constructor() {
    this.#listener = new Listener();
  }

  async play() {
    await this.#listener.start();

    do {
      await this.#round();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (true);

    // Select random note

    // Wait for note

    // If no note show name

    // If still no note show name
  }

  async #round() {
    const note = this.#randomNote();
    console.log(`wait for note ${note}`);
    const controller = new AbortController();
    this.#showNote(controller.signal);
    this.#showFingering(controller.signal);

    let recievedNote: string;
    do {
      recievedNote = await this.#listener.waitForNote();
      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log("resolved note", recievedNote, note);
    } while (recievedNote !== note);
    console.log("round won");
    controller.abort();
  }

  #randomNote(): string {
    return `${notes[this.#randomInt(11)]}-${[4, 5][this.#randomInt(1)]}`;
  }

  #showNote(signal: AbortSignal) {
    const timeout = window.setTimeout(() => {
      if (!signal.aborted) {
        console.log("note");
        // Show note
      }
    }, 2000);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timeout);
    });
  }

  #showFingering(signal: AbortSignal) {
    const timeout = window.setTimeout(() => {
      if (!signal.aborted) {
        console.log("finguring");
        // Show fingering
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
