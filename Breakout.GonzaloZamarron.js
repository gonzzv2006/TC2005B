/*
 * Simple implementation of the BREAKOUT game
 *
 * Based on the Pong example seen in class
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// Variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime = 0;

// Game settings
let ballSpeed = 0.5;
let paddleSpeed = 0.7;
let barrierSpeed = 0.3;


// Ball class
class Ball extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "ball");

        this.velocity = new Vector(1, -1).normalize();
        this.waiting = true;
    }

    update(deltaTime) {
        if (this.waiting) return;

        this.position = this.position.plus(
            this.velocity.times(ballSpeed).times(deltaTime)
        );

        this.updateCollider();
    }

    reset() {
        this.position = new Vector(canvasWidth / 2, canvasHeight - 80);
        this.velocity = new Vector(1, -1).normalize();
        this.waiting = true;
    }
}


// Paddle class
class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");

        this.velocity = new Vector(0, 0);

        this.motion = {
            left: {
                axis: "x",
                sign: -1,
            },

            right: {
                axis: "x",
                sign: 1,
            },
        }

        this.keys = [];
    }

    update(deltaTime) {
        this.velocity.x = 0;

        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;

            this.velocity[axis] += sign;
        }

        this.velocity = this.velocity.normalize().times(paddleSpeed);

        this.position = this.position.plus(
            this.velocity.times(deltaTime)
        );

        this.clampWithinCanvas();

        this.updateCollider();
    }

    clampWithinCanvas() {
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
        }

        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;
        }
    }
}


// Brick class
class Brick extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "brick");

        this.active = true;
    }
}


// Barrier class (moving horizontal bar that blocks the ball)
class Barrier extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "barrier");

        this.direction = 1; // 1 = right, -1 = left
    }

    update(deltaTime) {
        this.position.x += this.direction * barrierSpeed * deltaTime;

        // Bounce off walls
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;
            this.direction *= -1;
        }

        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
            this.direction *= -1;
        }

        this.updateCollider();
    }
}


// Game class
class Game {
    constructor() {

        this.createEventListeners();

        this.level = 1;

        this.score = 0;

        this.lives = 3;

        this.gameOver = false;

        this.win = false;

        this.scoreLabel = new TextLabel(
            30,
            40,
            "30px Arial",
            "white"
        );

        this.levelLabel = new TextLabel(
            320,
            40,
            "30px Arial",
            "white"
        );

        this.livesLabel = new TextLabel(
            650,
            40,
            "30px Arial",
            "white"
        );

        this.messageLabel = new TextLabel(
            260,
            300,
            "50px Arial",
            "yellow"
        );

        this.initObjects();
    }

    initObjects() {

        this.paddle = new Paddle(
            new Vector(canvasWidth / 2, canvasHeight - 40),
            120,
            20,
            "white"
        );

        this.ball = new Ball(
            new Vector(canvasWidth / 2, canvasHeight - 80),
            20,
            20,
            "yellow"
        );

        this.createBricks();

        this.createBarriers();

        this.actors = [
            this.paddle,
            this.ball,
            ...this.bricks,
            ...this.barriers
        ];
    }

    createBricks() {

        this.bricks = [];

        const rows = this.level + 2;

        const cols = 6;

        const brickWidth = 100;
        const brickHeight = 30;

        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < cols; col++) {

                let brick = new Brick(
                    new Vector(
                        100 + col * 110,
                        80 + row * 40
                    ),
                    brickWidth,
                    brickHeight,
                    "red"
                );

                this.bricks.push(brick);
            }
        }
    }

    createBarriers() {

        this.barriers = [];

        // Level 2: one barrier below the last row of bricks
        if (this.level === 2) {

            const rows = this.level + 2; // 4 rows
            const lastRowY = 80 + (rows - 1) * 40;

            let barrier = new Barrier(
                new Vector(canvasWidth / 2, lastRowY + 50),
                120,
                15,
                "white"
            );

            this.barriers.push(barrier);
        }

        // Level 3: one barrier between each row of bricks
        if (this.level === 3) {

            const rows = this.level + 2;

            for (let i = 0; i < rows - 1; i++) {

                // Midpoint between row i and row i+1
                const yPos = 80 + i * 40 + 20;

                let barrier = new Barrier(
                    new Vector(canvasWidth / 4 + (i % 2) * (canvasWidth / 2), yPos),
                    120,
                    15,
                    "white"
                );

                barrier.direction = i % 2 === 0 ? 1 : -1;

                this.barriers.push(barrier);
            }
        }
    }

    draw(ctx) {

        this.scoreLabel.draw(
            ctx,
            `Blocks: ${this.score}`
        );

        this.levelLabel.draw(
            ctx,
            `Level: ${this.level}`
        );

        this.livesLabel.draw(
            ctx,
            `Lives: ${this.lives}`
        );

        for (let actor of this.actors) {

            if (actor.type == "brick") {

                if (actor.active) {
                    actor.draw(ctx);
                }

            } else {
                actor.draw(ctx);
            }
        }

        if (this.gameOver) {
            this.messageLabel.draw(ctx, "GAME OVER");
        }

        if (this.win) {
            this.messageLabel.draw(ctx, "YOU WIN");
        }
    }

    update(deltaTime) {

        if (this.gameOver || this.win) {
            return;
        }

        this.paddle.update(deltaTime);

        this.ball.update(deltaTime);

        // Update barriers
        for (let barrier of this.barriers) {
            barrier.update(deltaTime);
        }

        // Left wall
        if (this.ball.position.x - this.ball.halfSize.x < 0) {
            this.ball.velocity.x *= -1;
        }

        // Right wall
        if (this.ball.position.x + this.ball.halfSize.x > canvasWidth) {
            this.ball.velocity.x *= -1;
        }

        // Top wall
        if (this.ball.position.y - this.ball.halfSize.y < 0) {
            this.ball.velocity.y *= -1;
        }

        // Bottom wall
        if (this.ball.position.y > canvasHeight) {

            this.lives--;

            this.ball.reset();

            if (this.lives <= 0) {
                this.gameOver = true;
            }
        }

        // Paddle collision
        if (boxOverlap(this.paddle, this.ball)) {
            this.ball.velocity.y *= -1;
        }

        // Barrier collisions
        for (let barrier of this.barriers) {
            if (boxOverlap(barrier, this.ball)) {
                this.ball.velocity.y *= -1;
            }
        }

        // Brick collisions
        for (let brick of this.bricks) {

            if (brick.active &&
                boxOverlap(brick, this.ball)) {

                brick.active = false;

                this.ball.velocity.y *= -1;

                this.score++;
            }
        }

        // Check if level completed
        let remaining = this.bricks.filter(
            brick => brick.active
        );

        if (remaining.length == 0) {

            this.level++;

            if (this.level > 3) {
                this.win = true;
            } else {

                this.ball.reset();

                this.createBricks();

                this.createBarriers();

                this.actors = [
                    this.paddle,
                    this.ball,
                    ...this.bricks,
                    ...this.barriers
                ];
            }
        }
    }

    createEventListeners() {

        window.addEventListener('keydown', (event) => {

            if (event.key == ' ' && this.ball.waiting) {
                this.ball.waiting = false;
            }

            if (event.key == 'a') {
                this.addKey('left', this.paddle);
            }

            if (event.key == 'd') {
                this.addKey('right', this.paddle);
            }
        });

        window.addEventListener('keyup', (event) => {

            if (event.key == 'a') {
                this.delKey('left', this.paddle);
            }

            if (event.key == 'd') {
                this.delKey('right', this.paddle);
            }
        });
    }

    addKey(direction, object) {

        if (!object.keys.includes(direction)) {
            object.keys.push(direction);
        }
    }

    delKey(direction, object) {

        if (object.keys.includes(direction)) {

            object.keys.splice(
                object.keys.indexOf(direction),
                1
            );
        }
    }
}


// Starting function
function main() {

    const canvas = document.getElementById('canvas');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext('2d');

    game = new Game();

    drawScene(0);
}


// Main loop
function drawScene(newTime) {

    let deltaTime = newTime - oldTime;

    ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;

    requestAnimationFrame(drawScene);
}