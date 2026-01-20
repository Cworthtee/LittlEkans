var Snake = (function () {

  const INITIAL_TAIL = 4;
  var fixedTail = false;

  var intervalID;

  var tileCount = 40;
  var gridSize = 800 / tileCount;

  const INITIAL_PLAYER = { x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) };

  var velocity = { x: 0, y: 0 };
  var player = { x: INITIAL_PLAYER.x, y: INITIAL_PLAYER.y };

  var walls = true;

  var fruit = { x: 1, y: 1 };

  // Lista de imÃ¡genes posibles
  var fruitImages = [
    "sticker01.webp",
    "sticker02.webp",
    "sticker03.webp",
    "sticker04.webp",
    "sticker05.webp",
    "sticker06.webp",
    "sticker07.webp",
    "sticker08.webp",
    "sticker09.webp",
    "sticker10.webp",
    "sticker11.webp",
    "sticker12.webp",
    "sticker13.webp",
    "sticker14.webp",
    "sticker15.webp",
    "sticker16.webp",
    "sticker17.webp",
    "sticker18.webp",
    "sticker19.webp"
    "sticker20.webp
    ];

  // Imagen actual
  var fruitImage = new Image();
  fruitImage.src = fruitImages[0];

  // TamaÃ±o de la fruta en casillas
  var fruitWidth = 6;
  var fruitHeight = 6;

  var trail = [];
  var tail = INITIAL_TAIL;

  var reward = 0;
  var points = 0;
  var pointsMax = 0;

  var ActionEnum = { 'none': 0, 'up': 1, 'down': 2, 'left': 3, 'right': 4 };
  Object.freeze(ActionEnum);
  var lastAction = ActionEnum.none;

  function setup() {
    canv = document.getElementById('gc');
    ctx = canv.getContext('2d');
    game.reset();
  }

  var game = {

    reset: function () {
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, canv.width, canv.height);

      tail = INITIAL_TAIL;
      points = 0;
      velocity.x = 0;
      velocity.y = 0;
      player.x = INITIAL_PLAYER.x;
      player.y = INITIAL_PLAYER.y;
      reward = -1;

      lastAction = ActionEnum.none;

      trail = [];
      trail.push({ x: player.x, y: player.y });
    },

    action: {
      up: function () {
        if (lastAction != ActionEnum.down) {
          velocity.x = 0;
          velocity.y = -1;
        }
      },
      down: function () {
        if (lastAction != ActionEnum.up) {
          velocity.x = 0;
          velocity.y = 1;
        }
      },
      left: function () {
        if (lastAction != ActionEnum.right) {
          velocity.x = -1;
          velocity.y = 0;
        }
      },
      right: function () {
        if (lastAction != ActionEnum.left) {
          velocity.x = 1;
          velocity.y = 0;
        }
      }
    },

    RandomFruit: function () {
      if (walls) {
        fruit.x = 1 + Math.floor(Math.random() * (tileCount - 2));
        fruit.y = 1 + Math.floor(Math.random() * (tileCount - 2));
      } else {
        fruit.x = Math.floor(Math.random() * tileCount);
        fruit.y = Math.floor(Math.random() * tileCount);
      }

      // Validar que no se salga del tablero
      if (fruit.x > tileCount - fruitWidth) fruit.x = tileCount - fruitWidth;
      if (fruit.y > tileCount - fruitHeight) fruit.y = tileCount - fruitHeight;
    },

    loop: function () {

      reward = -0.1;

      function DontHitWall() {
        if (player.x < 0) player.x = tileCount - 1;
        if (player.x >= tileCount) player.x = 0;
        if (player.y < 0) player.y = tileCount - 1;
        if (player.y >= tileCount) player.y = 0;
      }
      function HitWall() {
        if (player.x < 1) game.reset();
        if (player.x > tileCount - 2) game.reset();
        if (player.y < 1) game.reset();
        if (player.y > tileCount - 2) game.reset();

        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, gridSize * 0, canv.height);
        ctx.fillRect(0, 0, canv.width, gridSize * 0);
        ctx.fillRect(canv.width - gridSize + 10, 0, gridSize * 0, canv.height);
        ctx.fillRect(0, canv.height - gridSize + 10, canv.width, gridSize * 0);
      }

      var stopped = velocity.x == 0 && velocity.y == 0;

      player.x += velocity.x;
      player.y += velocity.y;

      if (velocity.x == 0 && velocity.y == -1) lastAction = ActionEnum.up;
      if (velocity.x == 0 && velocity.y == 1) lastAction = ActionEnum.down;
      if (velocity.x == -1 && velocity.y == 0) lastAction = ActionEnum.left;
      if (velocity.x == 1 && velocity.y == 0) lastAction = ActionEnum.right;

      ctx.fillStyle = 'rgba(40,40,40,0.8)';
      ctx.fillRect(0, 0, canv.width, canv.height);

      if (walls) HitWall();
      else DontHitWall();

      if (!stopped) {
        trail.push({ x: player.x, y: player.y });
        while (trail.length > tail) trail.shift();
      }

      ctx.fillStyle = 'green';
      for (var i = 0; i < trail.length - 1; i++) {
        ctx.fillRect(trail[i].x * gridSize + 1, trail[i].y * gridSize + 1, gridSize - 2, gridSize - 2);

        if (!stopped && trail[i].x == player.x && trail[i].y == player.y) {
          game.reset();
        }
        ctx.fillStyle = 'lime';
      }
      ctx.fillRect(trail[trail.length - 1].x * gridSize + 1, trail[trail.length - 1].y * gridSize + 1, gridSize - 2, gridSize - 2);

      // ColisiÃ³n con fruta grande
      if (
        player.x >= fruit.x &&
        player.x < fruit.x + fruitWidth &&
        player.y >= fruit.y &&
        player.y < fruit.y + fruitHeight
      ) {
        if (!fixedTail) tail++;
        points++;
        if (points > pointsMax) pointsMax = points;
        reward = 1;
        game.RandomFruit();

        // ðŸ‘‰ Cambiar la imagen a otra aleatoria
        var randomIndex = Math.floor(Math.random() * fruitImages.length);
        fruitImage.src = fruitImages[randomIndex];

        // Evitar que aparezca dentro de la serpiente
        while ((function () {
          for (var i = 0; i < trail.length; i++) {
            if (trail[i].x == fruit.x && trail[i].y == fruit.y) {
              game.RandomFruit();
              return true;
            }
          }
          return false;
        })());
      }

      // Dibujar fruta como imagen
      ctx.drawImage(
        fruitImage,
        fruit.x * gridSize + 1,
        fruit.y * gridSize + 1,
        fruitWidth * gridSize - 2,
        fruitHeight * gridSize - 2
      );

      if (stopped) {
        ctx.fillStyle = 'rgba(250,250,250,0.8)';
        ctx.font = "small-caps bold 14px Helvetica";
        ctx.fillText("Toca para Empezar", 24, 750);
      }

      ctx.fillStyle = 'white';
      ctx.font = "bold small-caps 16px Helvetica";
      ctx.fillText("points: " + points, 380, 40);
      ctx.fillText("top: " + pointsMax, 380, 60);

      return reward;
    }
  }

  function keyPush(evt) {
    switch (evt.keyCode) {
      case 37: game.action.left(); evt.preventDefault(); break;
      case 38: game.action.up(); evt.preventDefault(); break;
      case 39: game.action.right(); evt.preventDefault(); break;
      case 40: game.action.down(); evt.preventDefault(); break;
      case 32: Snake.pause(); evt.preventDefault(); break;
      case 27: game.reset(); evt.preventDefault(); break;
    }
  }

  return {
    start: function (fps = 15) {
      window.onload = setup;
      intervalID = setInterval(game.loop, 1000 / fps);
    },
    loop: game.loop,
    reset: game.reset,
    stop: function () { clearInterval(intervalID); },
    setup: {
      keyboard: function (state) {
        if (state) document.addEventListener('keydown', keyPush);
        else document.removeEventListener('keydown', keyPush);
      },
      wall: function (state) { walls = state; },
      tileCount: function (size) {
        tileCount = size;
        gridSize = 400 / tileCount;
      },
      fixedTail: function (state) { fixedTail = state; }
    },
    action: function (act) {
      switch (act) {
        case 'left': game.action.left(); break;
        case 'up': game.action.up(); break;
        case 'right': game.action.right(); break;
        case 'down': game.action.down(); break;
      }
    },
    pause: function () { velocity.x = 0; velocity.y = 0; },

    clearTopScore: function () {
      pointsMax = 0;
    },

    data: {
      player: player,
      fruit: fruit,
      trail: function () {
        return trail;
      }
    },

    info: {
      tileCount: tileCount
    }
  };

})();

Snake.start(8);
Snake.setup.keyboard(true);
