class HTMLStaff extends HTMLElement {
  static observedAttributes = ["note"];

  get notes(): string | null {
    return this.getAttribute("notes");
  }

  set notes(value) {
    if (value) {
      this.setAttribute("notes", value);
    } else {
      this.removeAttribute("notes");
    }
  }

  connectedCallback() {
    const templateElement = document.getElementById(
      "staff-template",
    ) as HTMLTemplateElement;
    const staff = document
      .importNode(templateElement.content, true)
      .querySelector("div");
    if (staff) {
      this.appendChild(staff);
      this.#setNotes();
    }
  }

  attributeChangedCallback(name: string, _?: string, newValue?: string) {
    if (name === "notes" && newValue) {
      this.#setNotes();
    }
  }

  #setNotes() {
    const notes = (this.notes || "")
      .split(" ")
      .map((note) => {
        const match = note.match(/^([a-g])([#♯♭♮]?)-(\d)$/iu);
        if (!match) {
          return null;
        }

        const [, tone, modifier, octave] = match;
        const noteElement = document.createElement("span");
        noteElement.classList.add(`${tone.toLowerCase()}${octave}`);
        if (modifier) {
          noteElement.appendChild(new Text(modifier === "#" ? "♯" : modifier));
        }
        noteElement.appendChild(new Text("\u{1d15f}"));
        return noteElement;
      })
      .filter((n) => n !== null);
    this.querySelector(".notes")?.replaceChildren(...notes);
    this.#setStaff(notes.length);
  }

  #setStaff(count: number) {
    const line = this.querySelector(".lines");
    if (!line) {
      return;
    }
    line.textContent = Array(count + 2)
      .fill("\u{1D11A}")
      .join("");
  }
}

customElements.define("c-staff", HTMLStaff);
