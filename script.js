let direction = 'right'; // default direction
let gameInterval;
let gameSpeed = 150;
let points = 0;

// Snake's position in grid coordinates
let snake = [
    { x: 5, y: 5, index: 1 },
    { x: 4, y: 5, index: 2 },
    { x: 3, y: 5, index: 3 },
    { x: 2, y: 5, index: 4 },
    { x: 1, y: 5, index: 5 }
];

// Example fuel position
let fuel = { x: 10, y: 5, relativeX: 0, relativeY: 0 };

$(document).on('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    else if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    else if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    else if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

function moveSnake() {
    let head = { ...snake[0] };

    if (direction === 'up') head.y -= 1;
    else if (direction === 'down') head.y += 1;
    else if (direction === 'left') head.x -= 1;
    else if (direction === 'right') head.x += 1;

    snake.unshift(head);

    // Check collision with fuel
    var headPosition = $("#snake-0").offset();
    if (head.x === fuel.relativeX && head.y === fuel.relativeY) {
        points += 10;
        spawnFuel();
        adjustSpeed();
    } else {
        snake.pop(); // remove tail if no food eaten
    }

    draw();
}

function checkCollision(player, fuel) {
    return (
        player.x < fuel.x + 20 &&
        player.x + player.width > fuel.x &&
        player.y < fuel.y + 20 &&
        player.y + player.height > fuel.y
    );
}

function draw() {
    let container = $("#snakeBodyContainer");
    container.empty();
    snake.forEach((segment, index) => {
        $("<div></div>")
            .addClass("snake-cell")
            .attr('id', "snake-"+index)
            .css({
                position: "absolute",
                width: "10px",
                height: "10px",
                backgroundColor: "#000",
                left: segment.x * 10 + "px",
                top: segment.y * 10 + "px"
            })
            .appendTo(container);
    });

    let head = { ...snake[0] };
    let gameContainerWidth = $(".game-container").width();
    let gameContainerHeight = $(".game-container").height();
    let gameWindowMinTop = $(".game-container").offset().top/10;
    let gameWindowMinLeft =  $(".game-container").offset().left/10;
    let gameWindowMaxTop = gameContainerHeight + gameWindowMinTop;
    let gameWindowMaxLeft = gameContainerWidth + gameWindowMinLeft

    if(head.x < gameWindowMinLeft || (head.x * 10) > gameWindowMaxLeft) {
        resetSnake();
    }
    if(head.y < gameWindowMinTop || (head.y * 10) > gameWindowMaxTop) {
        resetSnake();
    }
}

function spawnFuel() {
    let containerWidth = $(".game-container").width();
    let containerHeight = $(".game-container").height();
    let fuelSize = 20; // match the actual fuel element size

    let randonWidth = Math.random();
    let randomHeight = Math.random();

    fuel = {
        x: Math.floor(randonWidth * (containerWidth - fuelSize)),
        y: Math.floor(randomHeight * (containerHeight - fuelSize)),
        relativeX: Math.floor((randonWidth * (containerWidth - fuelSize)) / 10),
        relativeY: Math.floor((randomHeight * (containerHeight - fuelSize)) / 10)
    };

    let fuelContainer = $("#fuelContainer");
    fuelContainer.empty();

    $("<div></div>")
        .addClass("fuel")
        .css({
            position: "absolute",
            width: fuelSize + "px",
            height: fuelSize + "px",
            backgroundColor: "green",
            left: fuel.x + "px", // X is left
            top: fuel.y + "px"   // Y is top
        })
        .appendTo(fuelContainer);
}

function startGame() {
    gameInterval = setInterval(moveSnake, gameSpeed);
}

function adjustSpeed() {
    clearInterval(gameInterval);
    gameSpeed = Math.max(50, 150 - Math.floor(points / 20) * 10);
    gameInterval = setInterval(moveSnake, gameSpeed);
}

function resetSnake(){
    alert("Game Over!");
    clearInterval(gameInterval);
    direction = 'right';
    snake = [
        { x: 5, y: 5, index: 1 },
        { x: 4, y: 5, index: 2 },
        { x: 3, y: 5, index: 3 },
        { x: 2, y: 5, index: 4 },
        { x: 1, y: 5, index: 5 }
    ];
    draw();
    startGame();
    spawnFuel();
}

draw();
startGame();
spawnFuel();