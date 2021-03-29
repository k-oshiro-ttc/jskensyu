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

    getCanvas() {
        return this.#canvas;
    }
    getCtx() {
        return this.#ctx;
    }
    getX() {
        return this.#x;
    }
    setX(x) {
        this.#x = x;
    }
    getY() {
        return this.#y;
    }
    setY(y) {
        this.#y = y;
    }
    getScore() {
        return this.#score;
    }
    setScore(score) {
        this.#score = score;
    }
    getLives() {
        return this.#lives;
    }
    setLives(lives) {
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

    getBallRadius() {
        return this.#ballRadius;
    }
    getDx() {
        return this.#dx;
    }
    setDx(dx) {
        this.#dx = dx;
    }
    getDy() {
        return this.#dy;
    }
    setDy(dy) {
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

    getPaddleHeight() {
        return this.#paddleHeight;
    }
    getPaddleWidth() {
        return this.#paddleWidth;
    }
    getPaddleX() {
        return this.#paddleX;
    }
    setPaddleX(paddleX) {
        this.#paddleX = paddleX;
    }
    getRightPressed() {
        return this.#rightPressed;
    }
    setRightPressed(rightPressed) {
        this.#rightPressed = rightPressed;
    }
    getLeftPressed() {
        return this.#leftPressed;
    }
    setLeftPressed(leftPressed) {
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

    getBrickRowCount() {
        return this.#brickRowCount;
    }
    getBrickColumnCount() {
        return this.#brickColumnCount;
    }
    getBrickWidth() {
        return this.#brickWidth;
    }
    getBrickHeight() {
        return this.#brickHeight;
    }
    getBrickPadding() {
        return this.#brickPadding;
    }
    getBrickOffsetTop() {
        return this.#brickOffsetTop;
    }
    getBrickOffsetLeft() {
        return this.#brickOffsetLeft;
    }
    getBricks(column, row) {
        return this.#bricks[column][row];
    }
    setBricksClear(column) {
        this.#bricks[column] = [];
    }
    setBricks(column, row, x, y, status) {
        this.#bricks[column][row] = { x: x, y: y, status: status };
    }
}

// brickの数を設定
function setBricks(brick) {
    for(var c = 0; c < brick.getBrickColumnCount(); c++) {
        brick.setBricksClear(c);
        for(var r = 0; r < brick.getBrickRowCount(); r++) {
            brick.setBricks(c, r, 0, 0, 1);
        }
    }
}

// EventListenerの追加
function addEventListeners(canvas, paddle) {
    document.addEventListener("keydown", keyDownHandler, paddle, false);
    document.addEventListener("keyup", keyUpHandler, paddle, false);
    document.addEventListener("mousemove", mouseMoveHandler, canvas, paddle, false);
}

// キーが押された時の処理
function keyDownHandler(paddle, e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        paddle.setRightPressed(true);
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        paddle.setLeftPressed(true);
    }
}

// キーが離された時の処理
function keyUpHandler(paddle, e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        paddle.setRightPressed(false);
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        paddle.setLeftPressed(false);
    }
}

// マウスを動かしたときの処理
function mouseMoveHandler(canvas, paddle, e) {
    var relativeX = e.clientX - canvas.getCanvas().offsetLeft;
    if(relativeX > 0 && relativeX < canvas.getCanvas().width) {
        paddle.setPaddleX() = relativeX - paddle.getPaddleWidth() / 2;
    }
}

// 描画処理
function draw(canvas, ball, paddle, brick) {
    canvas.getCtx().clearRect(0, 0, canvas.getCanvas().width, canvas.getCanvas().height);
    drawBricks(canvas, brick);
    drawBall(canvas, ball);
    drawPaddle(canvas, paddle);
    drawScore(canvas);
    drawLives(canvas);
    collisionDetection(canvas, ball, brick);

    if(canvas.getX() + ball.getDx() > canvas.getCanvas().width - ball.getBallRadius() || canvas.getX() + ball.getDx() < ball.getBallRadius()) {
        ball.setDx(-ball.getDx());
    }
    if(canvas.getY() + ball.getDy() < ball.getBallRadius()) {
        ball.setDy(-ball.getDy());
    }
    else if(canvas.getY() + ball.getDy() > canvas.getCanvas().height - ball.getBallRadius()) {
        if(canvas.getX() > paddle.getPaddleX() && canvas.getX() < paddle.getPaddleX() + paddle.getPaddleWidth()) {
            ball.setDy(-ball.getDy());
        }
        else {
            canvas.setLives(canvas.getLives() - 1);
            if(!canvas.getLives()) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                canvas.setX(canvas.getCanvas().width / 2);
                canvas.setY(canvas.getCanvas().height - 30);
                ball.setDx(3);
                ball.setDy(-3);
                paddle.setPaddleX((canvas.getCanvas().width - paddle.getPaddleWidth()) / 2);
            }
        }
    }

    if(paddle.getRightPressed() && paddle.getPaddleX() < canvas.getCanvas().width - paddle.getPaddleWidth()) {
        paddle.setPaddleX(paddle.getPaddleX() + 7);
    }
    else if(paddle.getLeftPressed() && paddle.getPaddleX() > 0) {
        paddle.setPaddleX(paddle.getPaddleX() - 7);
    }

    canvas.setX(canvas.getX() + ball.getDx());
    canvas.setY(canvas.getY() + ball.getDy());
    requestAnimationFrame(draw);
}

// brickの描画処理
function drawBricks(canvas, brick) {
    for(var c = 0; c < brick.getBrickColumnCount(); c++) {
        for(var r = 0; r < brick.getBrickRowCount(); r++) {
            if(brick.getBricks(c, r).status == 1) {
                var brickX = (r * (brick.getBrickWidth() + brick.getBrickPadding())) + brick.getBrickOffsetLeft();
                var brickY = (c * (brick.getBrickHeight() + brick.getBrickPadding())) + brick.getBrickOffsetTop();
                brick.getBricks(c, r).x = brickX;
                brick.getBricks(c, r).y = brickY;
                canvas.getCtx().beginPath();
                canvas.getCtx().rect(brickX, brickY, brick.getBrickWidth(), brick.getBrickHeight());
                canvas.getCtx().fillStyle = "#0095DD";
                canvas.getCtx().fill();
                canvas.getCtx().closePath();
            }
        }
    }
}

// ballの描画処理
function drawBall(canvas, ball) {
    canvas.getCtx().beginPath();
    canvas.getCtx().arc(canvas.getX(), canvas.getY(), ball.getBallRadius(), 0, Math.PI*2);
    canvas.getCtx().fillStyle = "#0095DD";
    canvas.getCtx().fill();
    canvas.getCtx().closePath();
}

// paddleの描画処理
function drawPaddle(canvas, paddle) {
    canvas.getCtx().beginPath();
    canvas.getCtx().rect(paddle.getPaddleX(), canvas.getCanvas().height - paddle.getPaddleHeight(), paddle.getPaddleWidth(), paddle.getPaddleHeight());
    canvas.getCtx().fillStyle = "#0095DD";
    canvas.getCtx().fill();
    canvas.getCtx().closePath();
}

// scoreの描画処理
function drawScore(canvas) {
    canvas.getCtx().font = "16px Arial";
    canvas.getCtx().fillStyle = "#0095DD";
    canvas.getCtx().fillText("Score: " + canvas.getScore(), 8, 20);
}

// livesの描画処理
function drawLives(canvas) {
    canvas.getCtx().font = "16px Arial";
    canvas.getCtx().fillStyle = "#0095DD";
    canvas.getCtx().fillText("Lives: " + canvas.getLives(), canvas.getCanvas().width - 65, 20);
}

// brickとballが衝突したときの処理
function collisionDetection(canvas, ball, brick) {
    for(var c = 0; c < brick.getBrickColumnCount(); c++) {
        for(var r = 0; r < brick.getBrickRowCount(); r++) {
            var b = brick.getBricks(c, r);
            if(b.status == 1) {
                if(canvas.getX() > b.x && canvas.getX() < b.x + brick.getBrickWidth() && canvas.getY() > b.y && canvas.getY() < b.y + brick.getBrickHeight()) {
                    ball.setDy(-ball.getDy());
                    b.status = 0;
                    canvas.setScore(canvas.getScore() + 1);
                    if(canvas.getScore() == brick.getBrickRowCount() * brick.getBrickColumnCount()) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}