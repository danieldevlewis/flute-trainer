import { Listener } from "./frequency.ts";

document.getElementById("start").addEventListener("click", async () => {
  const listener = new Listener();
  await listener.start();
  listener.listen((note: string) => {
    document.getElementById("freq").innerText = note;
    return false;
  });
});
