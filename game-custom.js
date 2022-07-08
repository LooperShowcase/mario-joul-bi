kaboom({
  global: true,
  fullscreen: true,

  clearColor: [0.7, 0.4, 0.96, 0.6],
  debug: true,
  scale: 2,
});
loadRoot("./sprites/");
loadSprite("player", "mario.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("suprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("mst", "mist_monster.png");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  const symbolmap = {
    width: 20,
    height: 20,

    "=": [sprite("block"), solid()],
  };
  const map = [
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "                                                                    ",
    "         ====                                                       ",
    "                                                                    ",
    "                                                                    ",
    "====================================================================",
    "====================================================================",
  ];
  const gamelevel = addLevel(map, symbolmap);
  //movement
});
start("game");
