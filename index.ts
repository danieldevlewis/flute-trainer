import { Listener } from "./frequency.ts";
import { Game } from "./game.ts";
import "./flute.ts";
import "./staff.ts";

document.getElementById("start")?.addEventListener("click", async () => {
  const game = new Game();
  game.addEventListener("start-round", (e) => {
    console.log("start-round", e.detail);
    const staff = document.createElement("c-staff") as HTMLStaff;
    staff.notes = e.detail;
    document.getElementById("staff")?.replaceChildren(staff);
    document.getElementById("note")?.replaceChildren();
    document.getElementById("fingering")?.replaceChildren();
  });
  game.addEventListener("show-note", (e) => {
    document.getElementById("note")?.replaceChildren(e.detail);
  });
  game.addEventListener("show-fingering", (e) => {
    const flute = document.createElement("c-flute") as HTMLFlute;
    flute.note = e.detail;
    document.getElementById("fingering")?.replaceChildren(flute);
    console.log(`fingering ${e.detail}`);
  });
  game.play();

  const listener = new Listener();
  await listener.start();
  listener.listen((note: string) => {
    document.getElementById("freq").innerText = note;
    return false;
  });
});
