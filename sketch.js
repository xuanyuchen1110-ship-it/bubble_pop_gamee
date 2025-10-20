let circles = [];
let explosions = [];
let popSound;
let palette = [
  [176, 66, 66, 204],
  [224, 207, 186, 204],
  [149, 45, 36, 204],
  [168, 131, 122, 204]
];
let score = 0;
let timer = 60; // 倒數計時
let gameStarted = false; // 遊戲是否開始
let gameOver = false; // 遊戲是否結束
let restartButton;
let restartImage;

function preload() {
  popSound = loadSound('bubble-pop-06-351337.mp3');
  restartImage = loadImage('tryagain.png'); // 載入重新開始圖片
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(115, 87, 81);
}

function draw() {
  background(115, 87, 81);
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

  // ▶️ 播放按鈕（正三角形朝右）
  push();
  translate(width / 2, height / 2 + 100);
  noStroke();
  fill(255);
  // 三角形頂點：左下、左上、右中（形成朝右的箭頭）
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

  // 重新開始按鈕
  textAlign(CENTER);
  textSize(24);
  text("重新開始", width / 2, height / 2 + 150);
  imageMode(CENTER);
  image(restartImage, width / 2, height / 2 + 200, 100, 100); // 顯示重新開始圖片
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
    fill(c.color[0], c.color[1], c.color[2], c.color[3]);
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

    c.y -= c.speed;
    if (c.y + c.r / 2 < 0) {
      c.r = random(50, 140);
      c.speed = map(c.r, 120, 260, 2, 6);
      c.y = height + c.r / 2;
      c.x = random(width);
      c.color = random(palette);
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
    let d = dist(mouseX, mouseY, width / 2, height / 2 + 100); // 檢查是否點擊了三角形
    if (d < 70) { // 70是三角形外接圓的半徑近似值
      startGame();
    }
  } else if (gameOver) {
    // 重新開始遊戲
    let d = dist(mouseX, mouseY, width / 2, height / 2 + 200); // 檢查是否點擊了重新開始按鈕
    if (d < 25) { // 25是圓圈按鈕的半徑
      startGame();
    }
  } else {
    // 遊戲中點擊泡泡
    for (let i = 0; i < circles.length; i++) {
      let c = circles[i];
      let d = dist(mouseX, mouseY, c.x, c.y);
      if (d < c.r / 2) {
        explosions.push({
          x: c.x,
          y: c.y,
          r: c.r,
          color: c.color.slice(0, 3),
          t: 0
        });

        if (popSound && !popSound.isPlaying()) {
          popSound.play();
        }

        // 分數判斷
        if (isGoodColor(c.color)) {
          score++;
        } else {
          score--;
        }

        c.r = random(50, 140);
        c.speed = map(c.r, 120, 260, 2, 6);
        c.y = height + c.r / 2;
        c.x = random(width);
        c.color = random(palette);
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

  // 產生60個圓
  circles = []; // 清空現有圓
  for (let i = 0; i < 60; i++) {
    let radius = random(50, 140);
    let c = random(palette);
    let speed = map(radius, 120, 260, 2, 6);
    circles.push({
      x: random(width),
      y: random(height),
      r: radius,
      color: c,
      speed: speed
    });
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    gameOver = true;
  }
}

function isGoodColor(color) {
  // 檢查是否為指定的顏色
  let color1 = color[0] === 176 && color[1] === 66 && color[2] === 66 && color[3] === 204;
  let color2 = color[0] === 224 && color[1] === 207 && color[2] === 186 && color[3] === 204;
  return color1 || color2;
}
