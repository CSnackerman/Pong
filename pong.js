// precalculations
const DEGREES360 = Math.PI * 2;

// get canvas and context
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// set the canvas size
var C_WIDTH = window.innerWidth / 2;
var C_HEIGHT = window.innerHeight / 2;

ctx.canvas.width = C_WIDTH;
ctx.canvas.height = C_HEIGHT;

// paddle size and position
var P_HEIGHT = C_HEIGHT / 5;
var P_WIDTH = C_WIDTH / 30;

var P_START_X = 10;
var P_START_Y = C_HEIGHT / 2 - P_HEIGHT / 2;

// ball configuration
const B_SIZE = 15;


// event handler - RESIZE
addEventListener ("resize", () => {
    // set the canvas size
    C_WIDTH = window.innerWidth / 2;
    C_HEIGHT = window.innerHeight / 2;

    ctx.canvas.width = C_WIDTH;
    ctx.canvas.height = C_HEIGHT;

    // paddle size and position
    P_HEIGHT = C_HEIGHT / 5;
    P_WIDTH = C_WIDTH / 30;

    P_START_X = 10;
    P_START_Y = C_HEIGHT / 2 - P_HEIGHT / 2;

    ball = new Ball(B_SIZE);
    paddle_l = new Paddle ("left");
    paddle_r = new Paddle ("right");

});


class Paddle {

    // fields
    #width = 0;
    #height = 0;
    #position = {
        x: 0,
        y: 0
    }

    #velocity = 0;

    constructor (side) {

        this.#width = P_WIDTH;
        this.#height = P_HEIGHT;

        this.#velocity = 0;

        if (side === "left") {
            this.#position.x = P_START_X;
            this.#position.y = P_START_Y;
        }

        else if (side === "right") {
            this.#position.x = C_WIDTH - P_START_X - this.#width - 1;
            this.#position.y = P_START_Y;
        }

        else {
            this.#position.x = 0;
            this.#position.y = 0;
            console.log ("[error] invalid paddle");
        }
    }

    draw () {
        ctx.beginPath();
        ctx.rect(this.#position.x, this.#position.y, this.#width, this.#height);
        ctx.fillStyle = "lime";
        ctx.fill();
    }

    accelerate() {
        this.#velocity = -5;
    }

    decelerate() {
        this.#velocity = 5;
    }

    stop () {
        this.#velocity = 0;
    }

    move (direction) {
        this.#position.y += this.#velocity;
    }
}

class Ball {

    // fields
    #color = "#FFFFFF";
    #radius = 0;
    #position = {
        x : 0,
        y : 0
    }

    constructor (radius) {
        this.#radius = radius;
        this.#position.x = C_WIDTH / 2 - radius;
        this.#position.y = C_HEIGHT / 2 - radius;
    }

    draw () {
        ctx.beginPath();
        ctx.arc(this.#position.x, this.#position.y, this.#radius, 0, DEGREES360);
        ctx.fillStyle = this.#color;
        ctx.fill();
    }
}

// Game objects
var ball = new Ball(7);
var paddle_l = new Paddle ("left");
var paddle_r = new Paddle ("right");

// controls
var upIsDown = false;
var downIsDown = false;
addEventListener('keydown', (event) => {

    if (upIsDown == true || downIsDown == true) {
        return;
    }

    console.log (`pressed ${event.key} (${event.code})`);

    let key = event.key;

    switch (key) {
        case ",":
            upIsDown = true;
            paddle_l.accelerate();
            break;

        case ".":
            downIsDown = true;
            paddle_l.decelerate();
            break;
    };
});


addEventListener('keyup', (event) => {

    console.log (`released ${event.key} (${event.code})`);

    let key = event.key;

    switch (key) {
        case ",":
            upIsDown = false;
            paddle_l.stop();
            break;

        case ".":
            downIsDown = false;
            paddle_l.stop();
            break;
    };
});

// -----

function primary_loop() {

    ctx.clearRect (0, 0, C_WIDTH, C_HEIGHT);

    ball.draw();
    paddle_l.draw();
    paddle_r.draw();

    paddle_l.move();

    requestAnimationFrame (primary_loop);

    return;
}

primary_loop();