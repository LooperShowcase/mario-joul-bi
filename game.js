kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0.1, 0.7, 0.9, 0.9],
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("player", "mario.png");
loadSprite("block", "ground.png");
loadSprite("coin", "coin.png");
loadSprite("suprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("mist", "mist_monster.png");
loadSprite("cloud", "cloud.png");
loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpsound.mp3");
loadSprite("mush", "mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSound("bye", "gameover.mp3");
loadSprite("gomba", "evil_mushroom.png");
loadSprite("castle", "castle.png");

scene("over", (score) => {
  add([
    text("game over!!\nscore:" + score, 64),
    pos(width() / 2, height() / 2),
    origin("center"),
    color(1, 0.3, 0.1, 0),
  ]);
  play("bye");
  keyPress("enter", () => {
    go("game");
  });
});
scene("win", () => {});
scene("game", () => {
  const SPEED = 120;
  const JUMP = 10;
  let Mspeed = 45;
  let Gspeed = 45;
  let isjumping = false;
  let falldown = 400;
  const player = add([
    sprite("player"),
    solid(),
    pos(10, 100),
    body(),
    big(JUMP),
  ]);
  let score = 0;
  const scorelabel = add([
    text("score", score),
    color(0, 0, 0, 1),
    pos(50, 10),
    layer("ui"),
    {
      value: score,
    },
  ]);
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");
  const symbolmap = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), scale(1.3)],
    "@": [sprite("cloud"), scale(2), layer("bg")],
    "?": [sprite("suprise"), solid(), "suprise_mushroom"],
    "!": [sprite("suprise"), solid(), "suprise_coin"],
    "^": [sprite("gomba"), solid(), "goomba"],
    c: [sprite("castle"), "cas"],
    m: [sprite("mush"), scale(0.8), body(), "mush"],
    x: [sprite("unboxed"), solid()],
    $: [sprite("coin"), "money"],
    p: [sprite("pipe"), solid()],
  };
  const map = [
    "  @                                                                             @                                                               @                 ",
    "                @                       @                     @                                                                                                   ",
    "                                                                        @                                           @                                             ",
    "    @                       @                      @                                           @                                                                  ",
    "                                                                                                                                                @                 ",
    "                                                               @                                   @                                                              ",
    "            @                           @                                  @                                                                                      ",
    "                                                        @                                                                     @                                   ",
    "         @                                                                                                       @                                                ",
    "   ==?==                 @                @                                                                                                                       ",
    "                                                                 @                    @                                                    @                      ",
    "   @             =!=====                                                                                                                                          ",
    "                                                                                        ===!====?===                                                              ",
    "                                        ==?==                      ==!==                                                                                    c     ",
    "p                                            p           p                                                                                                        ",
    "                                                                                                       =^           ^=^          ^ =                              ",
    "==================================================================================================================================================================",
  ];

  const gamelevel = addLevel(map, symbolmap);
  const mist = add([sprite("mist"), solid(), pos(1000, 50), body(), "mist"]);
  loop(6, () => {
    const more_mist = add([
      sprite("mist"),
      solid(),
      pos(rand(200, 2000), 200),
      body(),
      "more_mist",
    ]);
    more_mist.action(() => {
      more_mist.move(-Mspeed, 0);
    });
  });

  keyDown("left", () => {
    if (player.pos.x > 0) player.move(-SPEED, 0);
  });
  keyDown("right", () => {
    player.move(SPEED, 0);
  });
  keyPress("up", () => {
    if (player.grounded()) {
      play("jumpSound");
      player.jump(0, JUMP);
      isjumping = true;
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("suprise_coin")) {
      gamelevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("x", obj.gridPos.sub(0, 0));
    }
    if (obj.is("suprise_mushroom")) {
      gamelevel.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("x", obj.gridPos.sub(0, 0));
    }
  });

  player.collides("money", (x) => {
    destroy(x);
    scorelabel.value += 5;
    scorelabel.text = "score:" + scorelabel.value;
  });

  player.collides("mush", (x) => {
    destroy(x);
    player.biggify(5);
  });

  player.collides("mist", (x) => {
    if (isjumping) {
      destroy(x);
    } else {
      destroy(player);
      go("over", scorelabel.value);
    }
    if (player.isBig()) {
      destroy(x);
      player.smallify();
    } else {
      destroy(player);
      go("over", scorelabel.value);
    }
  });
  player.collides("more_mist", (x) => {
    if (isjumping) {
      destroy(x);
    } else {
      // destroy(player);
      // player.pos.y = 1000;
      const last = add([
        text("game over", 64),
        pos(player.pos.x - 160, 80),
        color(1, 0.3, 0.1, 0.3),
      ]);
      debug.paused = true;
      play("bye");
      keyPress("enter", () => {
        player.pos.y = 100;
        player.pos.x = 10;
        debug.paused = false;
        destroy(last);
      });
    }
  });
  action("mush", (mush) => {
    mush.move(70, 0);
  });
  mist.action(() => {
    mist.move(-Mspeed, 0);
  });

  player.action(() => {
    camPos(player.pos.x, 150);
    scorelabel.pos.x = player.pos.x - 350;
    scorelabel.pos.y = 1;
    if (player.grounded()) {
      isjumping = false;
    } else {
      isjumping = true;
    }
    if (player.pos.y >= falldown) {
      destroy(player);
      go("over", scorelabel.value);
    }
    //console.log("position: ", player.pos.x, player.pos.y);
  });
  const interval = setInterval(() => {
    Mspeed = Mspeed * -1;
  }, rand(5000, 4000));
});
start("game");

// yo its maig
// ayyyyy hey man its kireto
