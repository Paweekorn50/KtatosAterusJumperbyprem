// Default, Player
let board;
let boardWidth = 1200;
let boardHeight = 300;
let context;
let playerWidth = 100;
let playerHeight = 125;
let playerX = 50;
let playerY = 175;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};
let gameOver = false;
let godMode = false;
let score = 0;
let time = 0;
let live = 3;

// Object
// Box images
let box1Img, box2Img , box3Img;

// Load box images
box1Img = new Image();
box1Img.src = "box1.png"; // box1 image

box2Img = new Image();
box2Img.src = "box2.jpg"; // Replace with another box image link

box3Img = new Image();
box3Img.src = "box3.png";

let boxWidth = 40;
let boxHeight = 80;
let boxX = 1300;
let boxY = 215;

// Setting Object
let boxesArray = [];
let boxSpeed = -8;

// Gravity, Velocity
let VelocityY = 0;
let Gravity = 0.25;

let Retry = document.getElementById("RetryButton");

//Item
let itemImg = new Image();
itemImg.src = "item.png";
let ItemSpawn = [];
let itemWidth = 80;
let itemHeight = 80;
let itemX = 1000;
let itemY = 80;
let itemSpeed = -3;

//Cloud

let cloudImg;
let cloudWidth = 160;
let cloudHeight = 160;
let cloudX = 1300;
let cloudY = 10;
let cloudArray = [];
let cloudSpeed = -8



console.log(player);
window.onload = function () {
    // Display
    board = document.getElementById("Board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Player
    playerImg = new Image();
    playerImg.src = "kid.png";
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    // Request animation frame
    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    Retry.addEventListener("click", gameReset);
    setInterval(createCloud,1000);

    cloudImg = new Image();
    cloudImg.src = "cloud1.png";
    
    createBoxWithRandomInterval();
};

// Function to create a box at a random time interval
function createBoxWithRandomInterval() {

    if (gameOver) {
        return;
    }

    createBox(); // Create a box

    // Generate a random time between 1 and 3 seconds (1000 to 3000 milliseconds)
    let randomTime = rnd(1200, 2500);

    // Use setTimeout instead of setInterval to create boxes at random times
    setTimeout(createBoxWithRandomInterval, randomTime);
}

function rnd(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

// Update Function
function update() {
    requestAnimationFrame(update); // Always update animation

    if (gameOver) {
        return;
    }
    if (ItemSpawn.length == 0){
        spawnItem();
    }

    context.clearRect(0, 0, board.width, board.height);
    VelocityY += Gravity;

    player.y = Math.min(player.y + VelocityY, playerY);
    if(godMode){
        playerImg.src = "god.png"
    }else{
        playerImg.src = "kid.png";
    }
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let index = 0; index < boxesArray.length; index++) {
        let box = boxesArray[index];
        if(godMode){
            box.x += boxSpeed*1.5;
        }else{
            box.x += boxSpeed;
        }
        context.drawImage(box.img, box.x, box.y, box.width, box.height);
        let Item = ItemSpawn[0];
        Item.x += itemSpeed
        context.drawImage(Item.img,Item.x,Item.y,Item.width,Item.height)

        if(godMode){
            if (onCollision(player,box)){
                
                boxesArray.splice(box, 1);  // Remove box if parried
               
            }
            }else{
            if (onCollision(player,Item)){
                godMode = true;
                let audio = new Audio('GokuScream.mp3'); // Replace with the path to your audio file
                audio.play(); // Play the audio
                
                setTimeout(() => {
                    godMode = false
                    audio.pause()
                }, 5000);
            }
            
            
            if (onCollision(player, box)) {
                gameOver = true;
                live -= 1;

                context.font = "normal bold 40px Arial";
                context.textAlign = "center";
                context.fillText("GameOver!", boardWidth / 2, boardHeight / 2);
                context.font = "normal bold 20px Arial";
                context.fillText("Your Score : "+score, boardWidth / 2, (boardHeight / 2)+40);

                setTimeout(() => {
                    Retry.style.display = "block";
                }, 500);
            }
        }
    }
    for (let index = 0; index < cloudArray.length; index++) {
        let clouds = cloudArray[index];
        clouds.x += cloudSpeed;
        context.drawImage(clouds.img, clouds.x, clouds.y, clouds.width, clouds.height);
    }

    score++;
    time += 0.01;
    context.font = "normal bold 25px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 0 , 30);
    context.fillText("Time : " + time.toFixed(0), 0, 60);
    context.fillText("Live : " + live, 0, 90);
    if (time >= 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("You Won!",boardWidth / 2, boardHeight / 2);
        context.font = "normal bold 20px Arial";
        context.fillText("With Score :" + score, boardWidth / 2, (boardHeight / 2 )+40)

        setTimeout(() => {
            Retry.style.display = "block";
        }, 500);
    }
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        VelocityY = -10;
    }
}

function createBox(e) {
    if (gameOver) {
        return;
    }

    let randomType = rnd(1, 3); // Randomly choose between 1 and 2
    let boxImg, boxWidth, boxHeight, boxSpeed;

    if (randomType === 1) {
        boxImg = box1Img;
        boxWidth = 40;
        boxHeight = 80;
        boxSpeed = -3; // Default speed
    } else if (randomType === 2) {
        boxImg = box2Img;
        boxWidth = 80; // Different size for box2
        boxHeight = 80;
        boxSpeed = -4; // Faster speed for box2
    } else {
        boxImg = box3Img;
        boxWidth = 80; // Different size for box2
        boxHeight = 120;
        boxSpeed = -3; // Faster speed for box2
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
        speed: boxSpeed
    };

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) && (obj1.x + obj1.width) > obj2.x // Crash in X move
        && obj1.y < (obj2.y + obj2.height) && (obj1.y + obj1.height) > obj2.y; // Crash in Y move
}

function gameReset() {
    if (!gameOver) {
        return;
    }

    if (live > 0) {
        gameOver = false;
        Retry.style.display = "none"; // Hide the Retry button
        

        score = 0;
        time = 0;
        boxesArray = [];
        VelocityY = 0; // Reset gravity effect
        player.y = playerY; // Reset player position

        createBoxWithRandomInterval(); // Restart creating boxes
    }
}

function spawnItem(){
    let item = {
        img: itemImg,
        x: itemX,
        y: itemY,
        width: itemWidth,
        height: itemHeight,
        speed: itemSpeed
    };
    ItemSpawn.push(item)
    setTimeout(() => {
       ItemSpawn = [] 
    }, 15000);
}


function createCloud(){
    if (gameOver) {
        return;
    }

    let cloud = {
        img: cloudImg,
        x: cloudX,
        y: cloudY,
        width: cloudWidth,
        height: cloudHeight
    };

    cloudArray.push(cloud);

    if (cloudArray.length > 5) {
        cloudArray.shift();
    }
}