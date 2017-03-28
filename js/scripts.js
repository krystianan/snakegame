var newGameBtn = document.getElementById("js-newGameButton");
var canv = document.getElementById("canvas");
var headline = document.getElementById("head");

newGameBtn.addEventListener('click', newGame);

var gameState = ['notStarted', 'started'];

function setGameElements () {
    switch(gameState) {
        case 'started':
            newGameBtn.style.display =  "none";
            canv.style.display = "block"; 
        break;    
        case 'notStarted':
        default:
            newGameBtn.style.display =  "block";
            canv.style.display = "none";  
    }
}

function newGame()  {
    gameState = 'started';
    setGameElements();
    init();
    headline.innerText = "Good luck!";
}

function endGame (){
    alert("Game over!");
    newGameBtn.innerText = "Try again";
    newGameBtn.style.display =  "block";
    canv.style.display = "none"; 
    headline.innerText = "Your score: " +score;
}  

setGameElements();

var canvas = $("#canvas")[0];
var ctx = canvas.getContext("2d");
var w = $("#canvas").width();
var h = $("#canvas").height();
    
var cw = 10;
var nd;
var d;
var food;
var score;
    
//snake create
var snake_array; 

function init() {
    d = "right"; //direction at start
    nd = [];
    create_snake();
    create_food(); 
    score = 0;
        
    //move snake
    if(typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, 60);
}

    
function create_snake() {
    var length = 5; //Length of snake at start
    snake_array = [];

    for(var i = length-1; i>=0; i--) {
            //create snae top
            snake_array.push({x: i, y:0});
    }
}
    
//food
function create_food(){
    food = {
        x: Math.round(Math.random()*(w-cw)/cw), 
        y: Math.round(Math.random()*(h-cw)/cw), 
    };
}
    
//paint snake
function paint(){

    if (nd.length) {
        d = nd.shift();
    }

    //canvas paint
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    var nx = snake_array[0].x;
    var ny = snake_array[0].y;

    if(d == "right") nx++;
    else if(d == "left") nx--;
    else if(d == "up") ny--;
    else if(d == "down") ny++;    

    //execution
    if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)) {
        endGame();
    }
        
    //eat part
    if(nx == food.x && ny == food.y) {
        var tail = {x: nx, y: ny};
        score++;
        create_food();
    }
    else {
        var tail = snake_array.pop(); //pops out the last cell
        tail.x = nx; tail.y = ny;
    }
        
    snake_array.unshift(tail); //puts back the tail as the first cell

    for(var i = 0; i < snake_array.length; i++) {
        var c = snake_array[i];
        //paint new tail
        paint_cell(c.x, c.y);
    }
        
    paint_cell(food.x, food.y);
     //score paint
    var score_text = "Score: " + score;
    ctx.fillText(score_text, 5, h-5);
}
    
//paint cell
function paint_cell(x, y) {
    ctx.fillStyle = "red";
    ctx.fillRect(x*cw, y*cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x*cw, y*cw, cw, cw);
}
    
function check_collision(x, y, array) {
    for(var i = 0; i < array.length; i++) {
        if(array[i].x == x && array[i].y == y)
        return true;
    }
        return false;
}
    
//keyboard
$(document).keydown(function(e){
    var key = e.which;
    var td;
    if (nd.length) {
        var td = nd[nd.length - 1];
    } else {
        td = d;
    }

    if(key == "37" && td != "right") nd.push("left");
    else if(key == "38" && td != "down") nd.push("up");
    else if(key == "39" && td != "left") nd.push("right");
    else if(key == "40" && td != "up") nd.push("down");
})
    
