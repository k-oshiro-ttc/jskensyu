class Breakout {
    #canvas;
    #ball;
    #paddle;
    #brick;
    constructor(canvas, score, lives, ballRadius, dx, dy, paddleHeight, paddleWidth, paddleX) {
        this.canvas = new Canvas(canvas, score, lives);
        this.ball = new Ball(ballRadius, dx, dy);
        this.paddle = new Paddle(paddleHeight, paddleWidth, paddleX);
        this.brick = new Brick(brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft);
    }

    get getCanvas() {
        return this.#canvas;
    }
    get getBall() {
        return this.#ball;
    }
    get getPaddle() {
        return this.#paddle;
    }
    get getBrick() {
        return this.#brick;
    }
}

// canvasの設定
class Canvas {
    #canvas;
    #ctx;
    #x;
    #y;
    #score;
    #lives;
    constructor(canvas, score, lives) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        this.#x = canvas.width / 2;
        this.#y = canvas.height - 30;
        this.#score = score;
        this.#lives = lives;
    }
}

// ballの設定
class Ball {
    #ballRadius;
    #dx;
    #dy;
    constructor(ballRadius, dx, dy) {
        this.#ballRadius = ballRadius;
        this.#dx = dx;
        this.#dy = dy;
    }
}

// paddleの設定
class Paddle {
    #paddleHeight;
    #paddleWidth;
    #paddleX;
    #rightPressed;
    #leftPressed;
    constructor(paddleHeight, paddleWidth, paddleX) {
        this.#paddleHeight = paddleHeight;
        this.#paddleWidth = paddleWidth;
        this.#paddleX = paddleX;
        this.#rightPressed = false;
        this.#leftPressed = false;
    }

    set setRightPressed(rightPressed) {
        this.#rightPressed = rightPressed;
    }
    set setLeftPressed(leftPressed) {
        this.#leftPressed = leftPressed;
    }
}

// brickの設定
class Brick {
    #brickRowCount;
    #brickColumnCount;
    #brickWidth;
    #brickHeight;
    #brickPadding;
    #brickOffsetTop;
    #brickOffsetLeft;
    #bricks;
    constructor(brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft) {
        this.#brickRowCount = brickRowCount;
        this.#brickColumnCount = brickColumnCount;
        this.#brickWidth = brickWidth;
        this.#brickHeight = brickHeight;
        this.#brickPadding = brickPadding;
        this.#brickOffsetTop = brickOffsetTop;
        this.#brickOffsetLeft = brickOffsetLeft;
        this.#bricks = [];
    }

    get getBrickRowCount() {
        return this.#brickRowCount;
    }
    get getBrickColumnCount() {
        return this.#brickColumnCount;
    }
    setBricks(column) {
        this.#bricks[column] = [];
    }
    setBricks(column, row, x, y, status) {
        this.#bricks[column][row] = { x: x, y: y, status: status};
    }
}

// brickの数を設定
function setBricks(brick) {
    for(var c = 0; c < brick.getBrickColumnCount(); c++) {
        brick.setBricks(c);
        for(var r = 0; r < brick.getBrickRowCount(); r++) {
            brick.setBricks(c, r, 0, 0, 1);
        }
    }
}

// EventListenerの追加
function addEventListeners(breakout) {
    document.addEventListener("keydown", keyDownHandler, breakout.getPaddle(), false);
    document.addEventListener("keyup", keyUpHandler, breakout.getPaddle(), false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
}

// キーが押された時の処理
function keyDownHandler(paddle, e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        paddle.setRightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        paddle.setLeftPressed = true;
    }
}

// キーが離された時の処理
function keyUpHandler(paddle, e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        paddle.setRightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        paddle.setLeftPressed = false;
    }
}

// マウスを動かしたときの処理
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.canvas.width) {
        paddle.paddleX = relativeX - paddle.paddleWidth/2;
    }
}

// 描画処理
function draw() {
    canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(canvas.x + ball.dx > canvas.canvas.width - ball.ballRadius || canvas.x + ball.dx < ball.ballRadius) {
        ball.dx = -ball.dx;
    }
    if(canvas.y + ball.dy < ball.ballRadius) {
        ball.dy = -ball.dy;
    }
    else if(canvas.y + ball.dy > canvas.canvas.height - ball.ballRadius) {
        if(canvas.x > paddle.paddleX && canvas.x < paddle.paddleX + paddle.paddleWidth) {
            ball.dy = -ball.dy;
        }
        else {
            canvas.lives--;
            if(!canvas.lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                canvas.x = canvas.canvas.width / 2;
                canvas.y = canvas.canvas.height - 30;
                ball.dx = 3;
                ball.dy = -3;
                paddle.paddleX = (canvas.canvas.width - paddle.paddleWidth) / 2;
            }
        }
    }

    if(paddle.rightPressed && paddle.paddleX < canvas.canvas.width - paddle.paddleWidth) {
        paddle.paddleX += 7;
    }
    else if(paddle.leftPressed && paddle.paddleX > 0) {
        paddle.paddleX -= 7;
    }

    canvas.x += ball.dx;
    canvas.y += ball.dy;
    requestAnimationFrame(draw);
}

// brickの描画処理
function drawBricks() {
    for(var c = 0; c < brick.brickColumnCount; c++) {
        for(var r = 0; r < brick.brickRowCount; r++) {
            if(brick.bricks[c][r].status == 1) {
                var brickX = (r * (brick.brickWidth + brick.brickPadding)) + brick.brickOffsetLeft;
                var brickY = (c * (brick.brickHeight + brick.brickPadding)) + brick.brickOffsetTop;
                brick.bricks[c][r].x = brickX;
                brick.bricks[c][r].y = brickY;
                canvas.ctx.beginPath();
                canvas.ctx.rect(brickX, brickY, brick.brickWidth, brick.brickHeight);
                canvas.ctx.fillStyle = "#0095DD";
                canvas.ctx.fill();
                canvas.ctx.closePath();
            }
        }
    }
}

// ballの描画処理
function drawBall() {
    canvas.ctx.beginPath();
    canvas.ctx.arc(canvas.x, canvas.y, ball.ballRadius, 0, Math.PI*2);
    canvas.ctx.fillStyle = "#0095DD";
    canvas.ctx.fill();
    canvas.ctx.closePath();
}

// paddleの描画処理
function drawPaddle() {
    canvas.ctx.beginPath();
    canvas.ctx.rect(paddle.paddleX, canvas.canvas.height - paddle.paddleHeight, paddle.paddleWidth, paddle.paddleHeight);
    canvas.ctx.fillStyle = "#0095DD";
    canvas.ctx.fill();
    canvas.ctx.closePath();
}

// scoreの描画処理
function drawScore() {
    canvas.ctx.font = "16px Arial";
    canvas.ctx.fillStyle = "#0095DD";
    canvas.ctx.fillText("Score: " + canvas.score, 8, 20);
}

// livesの描画処理
function drawLives() {
    canvas.ctx.font = "16px Arial";
    canvas.ctx.fillStyle = "#0095DD";
    canvas.ctx.fillText("Lives: " + canvas.lives, canvas.canvas.width - 65, 20);
}

// brickとballが衝突したときの処理
function collisionDetection() {
    for(var c = 0; c < brick.brickColumnCount; c++) {
        for(var r = 0; r < brick.brickRowCount; r++) {
            var b = brick.bricks[c][r];
            if(b.status == 1) {
                if(canvas.x > b.x && canvas.x < b.x + brick.brickWidth && canvas.y > b.y && canvas.y < b.y + brick.brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    canvas.score++;
                    if(canvas.score == brick.brickRowCount * brick.brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}