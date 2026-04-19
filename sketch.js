/**
 * 程式描述：這是一個結合 p5.js 與 p5.sound 的程式，
 * 載入音樂並循環播放，畫面上會有多個隨機生成的多邊形在視窗內移動反彈，
 * 且其大小會跟隨音樂的振幅（音量）即時縮放。
 */

// 全域變數
let shapes = []; // 用來儲存畫面上所有多邊形物件的陣列。
let song; // 儲存載入的音樂檔案。
let amplitude; // p5.Amplitude 物件，用來解析音樂的音量振幅。

// 外部定義的二維陣列，做為多邊形頂點的基礎座標。
// 您可以自行修改這個陣列來改變多邊形的基礎形狀。
const points = [
  [-3, 5], [3, 7], [1, 5], [2, 4], [4, 3], [5, 2], [6, 2], [8, 4], [8, -1], [6, 0], [0, -3], [2, -6], [-2, -3], [-4, -2], [-5, -1], [-6, 1], [-6, 2]
];

/**
 * preload()：在程式開始前預載入外部音樂資源。
 */
function preload() {
  // 使用 loadSound() 載入音檔並將其賦值給全域變數 song。
  // 請確認您的音樂檔案路徑正確。
  song = loadSound('midnight-quirk-255361.mp3');
}

/**
 * setup()：初始化畫布、音樂播放狀態與生成多邊形物件。
 */
function setup() {
  // 使用 createCanvas() 建立符合視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 將變數 amplitude 初始化為 new p5.Amplitude()。
  amplitude = new p5.Amplitude();

  // 使用 for 迴圈產生 10 個形狀物件，並 push 到 shapes 陣列中。
  for (let i = 0; i < 10; i++) {
    const randomMultiplier = random(10, 30);
    shapes.push({
      x: random(windowWidth), // 初始 X 座標
      y: random(windowHeight), // 初始 Y 座標
      dx: random(-3, 3), // X 軸水平移動速度
      dy: random(-3, 3), // Y 軸垂直移動速度
      scale: random(1, 10), // 縮放比例 (根據 JSON 描述加入)
      color: color(random(255), random(255), random(255)), // 隨機生成的 RGB 顏色
      // 透過 map() 讀取全域陣列 points，將每個頂點的 x 與 y 分別乘上隨機倍率來產生變形。
      points: points.map(p => {
        return [p[0] * randomMultiplier, p[1] * randomMultiplier];
      })
    });
  }
}

/**
 * draw()：每幀重複執行，處理背景更新、抓取音量與繪製動態圖形。
 */
function draw() {
  // 設定背景顏色
  background('#ffcdb2');
  // 設定邊框粗細
  strokeWeight(2);

  // 透過 amplitude.getLevel() 取得當前音量大小（數值介於 0 到 1）
  let level = amplitude.getLevel();
  // 使用 map() 函式將 level 從 (0, 1) 的範圍映射到 (0.5, 2) 的範圍
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 使用 for...of 迴圈走訪 shapes 陣列中的每個 shape 進行更新與繪製。
  for (const shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y);
    scale(sizeFactor);

    // 繪製多邊形
    beginShape();
    for (const p of shape.points) {
      vertex(p[0], p[1]);
    }
    endShape(CLOSE);

    // 狀態還原
    pop();
  }
}

/**
 * mousePressed()：處理音訊播放。
 * 由於瀏覽器政策，多數情況下需要使用者互動才能開始播放音訊。
 */
function mousePressed() {
  if (song.isPlaying()) {
    // 如果音樂正在播放，則暫停
    song.pause();
  } else {
    // 如果音樂已暫停或尚未開始，則循環播放
    song.loop();
  }
}

/**
 * windowResized()：當視窗大小改變時，自動重新調整畫布大小。
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
