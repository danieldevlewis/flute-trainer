import { Listener } from "./frequency.ts";
import { Game } from "./game.ts";
import "./flute.ts";

document.getElementById("start").addEventListener("click", async () => {
  const game = new Game();
  game.play();

  const listener = new Listener();
  await listener.start();
  listener.listen((note: string) => {
    document.getElementById("freq").innerText = note;
    return false;
  });
});
