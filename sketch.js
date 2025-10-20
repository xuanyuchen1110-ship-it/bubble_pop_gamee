let circles = [];
let explosions = [];
let popSound;
let score = 0;
let timer = 60; // 倒數計時
let gameStarted = false; // 遊戲是否開始
let gameOver = false; // 遊戲是否結束

function preload() {
  popSound = loadSound('bubble-pop-06-351337.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#ffcad4');
}

function draw() {
  background('#ffcad4');
  noStroke();

  if (!gameStarted) {
    // 顯示開始畫面
    displayStartScreen();
  } else if (gameOver) {
    // 顯示結束畫面
    displayEndScreen();
  } else {
    // 遊戲進行中
    displayGame();
  }
}

function displayStartScreen() {
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("開始遊戲", width / 2, height / 2);

  push();
  translate(width / 2, height / 2 + 100);
  noStroke();
  fill(255);
  triangle(-40, -50, -40, 50, 40, 0);
  pop();
}

function displayEndScreen() {
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("遊戲結束", width / 2, height / 2 - 50);
  textSize(40);
  text("你的分數是：" + score, width / 2, height / 2 + 50);
}

function displayGame() {
  // 左上角顯示倒數計時
  fill(255, 255, 255, 220);
  textSize(36);
  textAlign(LEFT, TOP);
  text("時間：" + timer, 30, 20);

  // 右上角顯示分數
  fill(255, 255, 255, 220);
  textSize(36);
  textAlign(RIGHT, TOP);
  text("分數：" + score, width - 30, 20);

  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    fill(240, 128, 128, c.alpha);
    ellipse(c.x, c.y, c.r, c.r);

    // 高光
    let highlightSize = c.r * 0.15;
    let offset = c.r * 0.22;
    fill(255, 255, 255, 180);
    rectMode(CENTER);
    push();
    translate(c.x, c.y);
    rect(offset, -offset, highlightSize, highlightSize, highlightSize * 0.4);
    pop();

    // 泡泡上升
    c.y -= c.speed;
    if (c.y + c.r / 2 < 0) {
      c.r = random(20, 80);
      c.y = height + c.r / 2;
      c.x = random(width);
      c.alpha = random(50, 255);
      c.speed = random(1, 3);
    }
  }

  // 畫爆破動畫
  for (let i = explosions.length - 1; i >= 0; i--) {
    let e = explosions[i];
    let steps = 18;
    let maxT = 20;
    let alpha = map(e.t, 0, maxT, 180, 0);
    stroke(255, 255, 255, alpha);
    strokeWeight(2);
    noFill();
    let rr = e.r * (1 + e.t / maxT * 0.6);
    for (let j = 0; j < steps; j++) {
      let angle = TWO_PI * j / steps + random(-0.05, 0.05);
      let len = rr * (0.9 + random(0.1));
      let x1 = e.x + cos(angle) * (rr * 0.7);
      let y1 = e.y + sin(angle) * (rr * 0.7);
      let x2 = e.x + cos(angle) * len;
      let y2 = e.y + sin(angle) * len;
      line(x1, y1, x2, y2);
    }
    e.t++;
    if (e.t > maxT) explosions.splice(i, 1);
  }

  // 倒數計時
  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }

  // 檢查遊戲是否結束
  if (timer == 0) {
    gameOver = true;
  }
}

function mousePressed() {
  if (!gameStarted) {
    // 開始遊戲
    let d = dist(mouseX, mouseY, width / 2, height / 2 + 100);
    if (d < 70) {
      startGame();
    }
  } else if (!gameOver) {
    // 遊戲中點擊泡泡
    for (let i = 0; i < circles.length; i++) {
      let c = circles[i];
      let d = dist(mouseX, mouseY, c.x, c.y);
      if (d < c.r / 2) {
        explosions.push({
          x: c.x,
          y: c.y,
          r: c.r,
          t: 0
        });

        if (popSound && !popSound.isPlaying()) {
          popSound.play();
        }

        score++;
        // 泡泡重生
        c.r = random(20, 80);
        c.y = height + c.r / 2;
        c.x = random(width);
        c.alpha = random(50, 255);
        c.speed = random(1, 3);
        break;
      }
    }
  }
}

function startGame() {
  gameStarted = true;
  gameOver = false;
  score = 0;
  timer = 60;

  circles = [];
  for (let i = 0; i < 20; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      r: random(20, 80),
      alpha: random(50, 255),
      speed: random(1, 3)
    });
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    gameOver = true;
  }
}
