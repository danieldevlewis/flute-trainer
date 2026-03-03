// Reference: https://www.wfg.woodwind.org/flute/fl_alt_1.html
// Reference: https://diymidicontroller.com/midi-note-chart/
const notes: string[][][] = [
  // c-4 (60)
  [["b-thumb", "c", "a", "g", "f", "e", "d", "c♯-touch", "c-roller"]],
  // c#-4
  [["b-thumb", "c", "a", "g", "f", "e", "d", "c♯-touch"]],
  // d-4
  [["b-thumb", "c", "a", "g", "f", "e", "d"]],
  // d#-4
  [["b-thumb", "c", "a", "g", "f", "e", "d", "d♯-touch"]],
  // e-4
  [["b-thumb", "c", "a", "g", "f", "e", "d♯-touch"]],
  // f-4
  [["b-thumb", "c", "a", "g", "f", "d♯-touch"]],
  // f#-4
  [["b-thumb", "c", "a", "g", "d", "d♯-touch"]],
  // g-4
  [["b-thumb", "c", "a", "g", "d♯-touch"]],
  // g#-4
  [["b-thumb", "c", "a", "g", "g♯", "d♯-touch"]],
  // a-4
  [["b-thumb", "c", "a", "d♯-touch"]],
  // a#-4
  [
    ["b♭-thumb", "c", "d♯-touch"],
    ["b-thumb", "c", "b♭-shake", "d♯-touch"],
    ["b-thumb", "c", "f", "d♯-touch"],
  ],
  // b-4
  [["b-thumb", "c", "d♯-touch"]],
  // c-5
  [["c", "d♯-touch"]],
  // c#-5
  [["d♯-touch"]],
  // d-5
  [["b-thumb", "a", "g", "f", "e", "d"]],
  // d#-5
  [["b-thumb", "a", "g", "f", "e", "d", "d♯-touch"]],
  // e-5
  [["b-thumb", "a", "g", "f", "e", "d♯-touch"]],
  // f-5
  [["b-thumb", "a", "g", "f", "d♯-touch"]],
  // f#-5
  [["b-thumb", "c", "a", "g", "d", "d♯-touch"]],
  // g-5
  [["b-thumb", "c", "a", "g", "d♯-touch"]],
  // g#-5
  [["b-thumb", "c", "a", "g", "g♯", "d♯-touch"]],
  // a-5
  [["b-thumb", "c", "a", "d♯-touch"]],
  // a#-5
  [
    ["b♭-thumb", "c", "d♯-touch"],
    ["b-thumb", "c", "b♭-shake", "d♯-touch"],
    ["b-thumb", "c", "f", "d♯-touch"],
  ],
  // b-5
  [["b-thumb", "c", "d♯-touch"]],
  // c-6
  [["c", "d♯-touch"]],
  // c#-6
  [["d♯-touch"]],
  // d-6
  [["b-thumb", "a", "g", "d♯-touch"]],
  // d#-6
  [["b-thumb", "c", "a", "g", "g♯", "f", "e", "d", "d♯-touch"]],
  // e-6
  [["b-thumb", "c", "a", "f", "e", "d♯-touch"]],
  // f-6
  [["b-thumb", "c", "g", "f", "d♯-touch"]],
  // f#-6
  [["b-thumb", "c", "g", "d", "d♯-touch"]],
  // g-6
  [["b-thumb", "c", "a", "g", "d♯-touch"]],
  // g#-6
  [["a", "g", "g♯", "d♯-touch"]],
  // a-6
  [["a", "g", "f", "d♯-touch"]],
  // a#-6
  [
    ["b-thumb", "f", "d-trill"],
    ["b-thumb", "c", "f", "d-trill"],
  ],
  // b-6
  [["b-thumb", "c", "g", "d♯-trill"]],
  // c-7
  [["c", "a", "g", "g♯", "f"]],
];

const mapEquivalent = new Map<string, string>([
  ["c♭", "b"],
  ["d♭", "c♯"],
  ["e♭", "d♯"],
  ["e#", "f"],
  ["f♭", "e"],
  ["g♭", "f♯"],
  ["a♭", "g♯"],
  ["b♭", "a♯"],
  ["b♯", "c"],
]);

const tones = ["c", "c♯", "d", "d♯", "e", "f", "f♯", "g", "g♯", "a", "a♯", "b"];

function noteToMidi(note: string): number | null {
  const m = note
    .toLowerCase()
    .replace(/#/g, "♯")
    .match(/^([a-g][♯♭]?)-(\d)$/iu);
  if (!m) {
    return null;
  }
  const octave = parseInt(m[2], 10);
  let tone = m[1];
  tone = mapEquivalent.get(tone) ?? tone;
  return 12 + octave * 12 + tones.indexOf(tone);
}

function midiToNote(midi: number): string {
  return `${tones[midi % 12]}-${Math.floor(midi / 12) - 1}`;
}

const keys = [
  "b♭-thumb",
  "b-thumb",
  "c",
  "a",
  "g",
  "g♯",
  "b♭-shake",
  "f",
  "d-trill",
  "d♯-trill",
  "e",
  "d",
  "d♯-touch",
  "c♯-touch",
  "c-roller",
];

class HTMLFlute extends HTMLElement {
  static observedAttributes = ["note"];

  get note() {
    return this.getAttribute("note");
  }

  set note(value) {
    if (value) {
      this.setAttribute("note", value);
    } else {
      this.removeAttribute("note");
    }
  }

  connectedCallback() {
    const templateElement = document.getElementById(
      "flute",
    ) as HTMLTemplateElement;
    const flute = document
      .importNode(templateElement.content, true)
      .querySelector("svg");
    if (flute) {
      this.appendChild(flute);
      if (this.note) {
        this.#setNote(this.note);
      }
    }
  }

  attributeChangedCallback(name: string, _?: string, newValue?: string) {
    if (name === "note" && newValue) {
      this.#setNote(newValue);
    }
  }

  #setNote(note: string, variation: number = 0) {
    this.querySelectorAll(keys.map((k) => `.key-${k}`).join(",")).forEach(
      (e: Element) => e.classList.remove("pressed"),
    );

    const fingering = this.#noteFingering(note, variation);
    if (!fingering) {
      return;
    }

    this.querySelectorAll(fingering.map((k) => `.key-${k}`).join(",")).forEach(
      (e: Element) => e.classList.add("pressed"),
    );
  }

  #noteFingering(note: string, variation: number = 0) {
    const midi = noteToMidi(note);
    if (midi === null) {
      return null;
    }
    return notes[midi - 60]?.[variation];
  }
}

customElements.define("c-flute", HTMLFlute);
