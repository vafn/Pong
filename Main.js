import {PlayerAI} from './AI.js';
import {Game, World, Wall, Player, Ball, Text} from './Game.js';
import {Display} from './Display.js';
import {Controller} from './Controller.js';

let canvas;
let context;
export let uPx = 1;
let gameRefreshRate = 100;
let pauseGame = false;

let game = new Game();
let controller = new Controller();
let display = null;
let world = null;
let wallTop = null;
let wallBottom = null;
let wallCenter = null;
let wallLeft = null;
let wallLeftTop = null;
let wallLeftBottom = null;
let wallRightTop = null;
let wallRightBottom = null;
let player1 = null;
let player2 = null;
let ball = null;
let p1Score = null;
let p2Score = null;
let maxV = 500;
let acc = 300;
let pW = 5;
let pH = 50;
let selectedGame = 'tennis';

window.addEventListener("load", event => OnLoad());

function OnLoad() {
  //console.clear();
  canvas = document.querySelector("canvas");
  context = canvas.getContext("2d");
  BuildRAFPolyfill();
  display = new Display(canvas);
  CreateWorld(1000, 400);
  AddEvents();
  controller.setup(window);
  ResetDisplay();
}

function CreateWorld(width, height) {
  world = new World(0, 0, width, height);
  wallTop = new Wall(0, 5, world.width, 7, 'white', true);
  wallBottom = new Wall(0, world.height - 30 - 2, world.width, 7, 'white', true);
  wallCenter = new Wall(world.width / 2, wallTop.bottom + 2, 2,  wallBottom.top - wallTop.bottom - 4, 'white', false);
  wallLeft = new Wall(0, 11, 7, wallBottom.top - wallTop.bottom, 'white', true);
  const verWallheight = (wallBottom.top - wallTop.bottom) / 3.5;
  wallLeftTop = new Wall(0, 11, 7, verWallheight, 'white', true);
  wallLeftBottom = new Wall(0, wallBottom.top - verWallheight, 7, verWallheight, 'white', true);
  wallRightTop = new Wall(wallTop.right - 7, 12, 7, verWallheight, 'white', true);
  wallRightBottom = new Wall(wallTop.right - 7, wallBottom.top - verWallheight, 7, verWallheight, 'white', true);

  let plYPos = wallTop.bottom + (wallBottom.top - wallTop.bottom - pH) * Math.random();
  player1 = new Player(9, plYPos, pW, pH, 0, 0, 'white', 'right');
  player2 = new Player(world.right - pW - 9, plYPos, pW, pH, 0, 0, 'white', 'left');
  ball = new Ball(world.width / 2, world.height / 2, 7, 600 - 1200 * Math.floor(Math.random() + 0.5), 200 - 400 * Math.random(), 'white');
  p1Score = new Text(width * 1/4, wallTop.bottom, '0', 'white', true, 72, 'Arial', true);
  p2Score = new Text(width * 3/4,  wallTop.bottom, '0', 'white', true, 72, 'Arial', true);

  player1.wentOut = PlayerWentOutOfWorld;
  player2.wentOut = PlayerWentOutOfWorld;
  ball.wentOut = BallWentOutOfWorld;
  player1.ai = new PlayerAI(player1, ball);
  player1.kickBall = KickBall;

  //player2.ai = new PlayerAI(player2, ball);
  player2.kickBall = KickBall;

  world.objects.push(wallTop);
  world.objects.push(wallBottom);
  world.objects.push(wallCenter);
  world.objects.push(wallLeft);
  world.objects.push(wallLeftTop);
  world.objects.push(wallLeftBottom);
  world.objects.push(wallRightTop);
  world.objects.push(wallRightBottom);
  world.objects.push(player1);
  world.objects.push(player2);
  world.objects.push(ball);
  world.objects.push(p1Score);
  world.objects.push(p2Score);
  game.objects.push(world);

  wallLeftTop.enabled = false;
  wallLeftBottom.enabled = false;
  wallRightTop.enabled = false;
  wallRightBottom.enabled = false;
  wallLeft.enabled = false;
}

function AddEvents() {
  window.addEventListener('resize', () => ResetDisplay());
  document.querySelector('.player2 .computer').addEventListener("click", function(event) {
    player2.ai = new PlayerAI(player2, ball);
    this.classList.add("selected");
    document.querySelector('.player2 .player').classList.remove("selected");
  });
  document.querySelector('.player2 .player').addEventListener("click", function(event) {
    player2.ai = undefined;
    this.classList.add("selected");
    document.querySelector('.player2 .computer').classList.remove("selected");
  });
  document.querySelectorAll('.levels .level').forEach((item, i) => {
    item.addEventListener("click", function(event) {
      player1.ai.difficulty = this.innerText;
      if (typeof player2.ai !== 'undefined')
        player2.ai.difficulty = this.innerText;
      document.querySelectorAll('.levels .level').forEach((item, i) => {
        item.classList.remove("selected");
      });
      this.classList.add("selected");
    });
  });

  document.querySelector('.games .tennis').addEventListener("click", function(event) {
    ResetGame(this);
    pauseGame = false;
  });
  document.querySelector('.games .football').addEventListener("click", function(event) {
    ResetGame(this);
    wallLeftTop.enabled = true;
    wallLeftBottom.enabled = true;
    wallRightTop.enabled = true;
    wallRightBottom.enabled = true;
    pauseGame = false;
  });
  document.querySelector('.games .squash').addEventListener("click", function(event) {
    ResetGame(this);
    wallCenter.enabled = false;
    wallLeft.enabled = true;
    player1.enabled = false;
    p1Score.enabled = false;
    pauseGame = false;
  });
}
function ResetGame(div) {
  pauseGame = true;

  document.querySelectorAll('.games div').forEach((item, i) => item.classList.remove("selected"));
  selectedGame = div.classList[0];
  div.classList.add("selected");

  ball.x = world.width / 2;
  ball.y = world.height / 2;
  ball.xV = 600 - 1200 * Math.floor(Math.random() + 0.5);
  ball.yV = 200 - 400 * Math.random();

  let plYPos = wallTop.bottom + (wallBottom.top - wallTop.bottom - pH) * Math.random();

  player1.y = plYPos;
  player1.actions = [];
  player1.action = null;
  player1.hasBall = false;
  player1.conceded = false;
  player1.lastUpdate = new Date();

  player2.y = plYPos;
  player2.actions = [];
  player2.action = null;
  player2.hasBall = false;
  player2.conceded = false;
  player2.lastUpdate = new Date();

  UpdatePlayerDimensions(player1);
  UpdatePlayerDimensions(player2);
  UpdateBallDimensions();

  wallLeftTop.enabled = false;
  wallLeftBottom.enabled = false;
  wallRightTop.enabled = false;
  wallRightBottom.enabled = false;

  wallCenter.enabled = true;
  wallLeft.enabled = false;
  player1.enabled = true;
  p1Score.enabled = true;

  player1.score = 0;
  player2.score = 0;
  ShowScores();
}

function ResetDisplay() {
  let docWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let docHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  docHeight -= 74;
  uPx = docWidth / 1000;
  canvas.width = docWidth;
  canvas.height = docHeight;
  display.bufferCanvas = null;
  display = new Display(canvas);
  display.uPx = uPx;
  Render();
}

function Render() {
  //console.time('Render');
  window.requestAnimationFrame(Render);

  if (typeof player2.ai === 'undefined') {
    if (controller.isPressed('ArrowUp'))
      player2.moveUp();
    if (controller.isPressed('ArrowDown'))
      player2.moveDown();
    if (player2.hasBall && (controller.isPressed(' ') || controller.isPressed('Enter')))
      KickBall();
  }
  /*
  if (player1.top < wallTop.bottom)
    player1.y = wallTop.bottom;
  if (player1.bottom > wallBottom.top)
    player1.y = wallBottom.top - player1.height;
  player1.top = player1.y;
  player1.bottom = player1.y + player1.height;

  if (player2.top < wallTop.bottom)
    player2.y = wallTop.bottom;
  if (player2.bottom > wallBottom.top)
    player2.y = wallBottom.top - player2.height;
  player2.top = player2.y;
  player2.bottom = player2.y + player2.height;
  */

  if(!pauseGame)
    game.Update();

  if (player1.hasBall) {
    ball.x = player1.right - ball.radius + 20;
    ball.y = player1.y + player1.height / 2;
  }
  if (player2.hasBall) {
    ball.x = player2.left - ball.radius - 5;
    ball.y = player2.y + player2.height / 2;
  }
  UpdateBallDimensions();

  display.clear();
  world.objects.forEach(gObj => {
    if(gObj.enabled) {
    if (gObj instanceof Wall)
      display.drawBox(gObj);
    else if (gObj instanceof Ball && gObj.visible)
      display.drawDisk(gObj);
    else if (gObj instanceof Player)
      display.drawBox(gObj);
    else if (gObj instanceof Text)
      display.drawText(gObj);
    }
  });
  display.render();
  //console.log(player1.y, player1.x, player1.xV, player1.yV)
  //console.timeEnd('Render');
}

function UpdateBallDimensions(){
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;
}
function UpdatePlayerDimensions(player) {
  player.top = player.y;
  player.bottom = player.y + player.height;
  player.left = player.x;
  player.right = player.x + player.width;
}

function BallWentOutOfWorld(side) {
  if (side === 'Left') {
    player2.score++;
    ShowScores();
    player1.hasBall = true;
    player1.concededAPoint();
    ball.Set({
      x: player1.x + 20,
      y: player1.y + player1.height / 2,
      xV: 0,
      yV: 0,
      zzcolor: 'red'
    });
  } else if (side === 'Right') {
    if (selectedGame !== 'squash')
      player1.score++;
    else
      player2.score++;
    ShowScores();
    player2.hasBall = true;
    player2.concededAPoint();
    ball.Set({
      x: player2.x + player2.width - 20,
      y: player2.y + player2.height / 2,
      xV: 0,
      yV: 0,
      zzcolor: 'blue'
    });
  } else if (side === 'Top') {
    ball.top = world.bottom - (world.top - ball.top);
    ball.y = ball.top + ball.radius;
  } else if (side === 'Bottom') {
    ball.top = world.top + (ball.top - world.bottom);
    ball.y = ball.top + ball.radius;
  }
}

function PlayerWentOutOfWorld(side) {
  if (side === 'Top') {
    //this.top = world.bottom; // - (world.top - player1.top);
    //this.y = this.top;
  } else if (side === 'Bottom') {
    //this.top = world.top - this.height;
    //this.y = this.top;
  }
}

function ShowScores() {
  p1Score.text = player1.score;
  p2Score.text = player2.score;
}

function BuildRAFPolyfill() {
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(cb, elt) {
      window.setTimeout(function() {
        cb(+new Date());
      }, 1000 / 60);
    };
}

function KickBall() {
  if (player1.hasBall || player2.hasBall) {
    if (player1.hasBall)
      ball.xV = ball.xVDefault;
    if (player2.hasBall)
      ball.xV = -ball.xVDefault;
    ball.yV = 200 - 400 * Math.random()
    player1.hasBall = false;
    player2.hasBall = false;
  }
}
