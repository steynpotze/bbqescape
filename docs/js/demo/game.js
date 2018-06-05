var engine;

var world;

var score = 0;

var bestScore = 0;

var screenshake = 0;

function startGame(canvasName){
  var canvas = document.getElementById(canvasName);
  var style = window.getComputedStyle(canvas, null);
  if (style.display == "none") {
    return;
  }
  var overlay = new Image("img_overlay");
  var vintage = new Image("img_vintage");

  var b = localStorage.getItem("highscore");
  if(b != undefined)
    bestScore = b;

  var background = new Audio("aud_background");

  engine = new Engine(canvas);
  engine.graphics.setFont("10px font");
  world = createMenuWorld();


  background.setLoop(true);
  background.play();

  var hz = 80;
  var intensity = 0.04;
  var standard = 0.2;

  engine.onUpdate = function(){
    if(screenshake > 0){
      screenshake -= 1;
    }
    engine.graphics.viewX = Math.random() * screenshake - screenshake / 2;
    engine.graphics.viewY = Math.random() * screenshake - screenshake / 2;

    world.update();
  };
  engine.onRender = function(){

    engine.graphics.setViewPort(320, undefined);

    engine.graphics.clear();
    engine.graphics.identity();

    world.render();

    //draw gui
    //engine.graphics.setFont("8px 'Orbitron'");
    //engine.graphics.drawText("Score: " + score, 16,8);

    //draw the overlay
    engine.graphics.setBlendMode("multiply");
    engine.graphics.setAlpha(((Math.sin(engine.runTime * hz) + 1) / 2) * intensity + standard);
    engine.graphics.drawImage(overlay,0,0, overlay.width, overlay.height);
    engine.graphics.setAlpha(1);
    engine.graphics.drawImage(vintage,0,0, engine.graphics.viewWidth, engine.graphics.viewHeight);
    engine.graphics.setBlendMode("source-over");

  };

  engine.start();

}

function Spawner(world){
  makeGameObject(this, world);

  var time = 0;
  var totalTime = 1;

  this.update = function(){
    totalTime += 0.0001;
    time --;
    if(time < 0){
      time = Math.random() * (30/totalTime + 30);
      //spawn new enemy
      world.add(new Enemy(world, Math.random() > 0.5 ? 48 : 320 - 48, 0));
    }
  }
}

function ScoreObject(){
  makeGameObject(this, world);

  this.render = function(){
    engine.graphics.setColor("white");
    engine.graphics.drawText("score: " + score, 16,16);
  }
}

function Block(world, x, y, w, h){
  makeGameObject(this, world);

  this.transform = new Rect(x,y,w,h);
  this.solid = true;

  this.render = function(){
    engine.graphics.setAlpha(1);
    engine.graphics.setColor("hsl("+Math.round(engine.runTime * 10)+", 100%, 50%)");
    var temp = new Rect(this.transform.x - 1, this.transform.y - 1, this.transform.width + 2, this.transform.height + 2);
    engine.graphics.drawTransform(temp);
    engine.graphics.setColor("gray");
    engine.graphics.drawTransform(this.transform);
  }
}

function StartGameObject(w){
  makeGameObject(this, w);

  this.update = function(){
    if(engine.input.isKeyPressed(32)){
      world = createGameWorld();
    }
  }

  this.render = function(){
    engine.graphics.setFont("16px font");
    engine.graphics.context.textAlign = "center";

    engine.graphics.setColor("gray");
    engine.graphics.drawText("SUPER BBQ ESCAPE", engine.graphics.viewWidth / 2 + 1,engine.graphics.viewHeight/2 - 32 + 1);
    engine.graphics.setColor("white");
    engine.graphics.drawText("SUPER BBQ ESCAPE", engine.graphics.viewWidth / 2,engine.graphics.viewHeight/2 - 32);

    engine.graphics.setFont("10px font");
    engine.graphics.drawText("Press <space> to start the game", engine.graphics.viewWidth / 2,engine.graphics.viewHeight/2);
    engine.graphics.setColor("gray");
    engine.graphics.drawText("Best Score: " + bestScore, engine.graphics.viewWidth / 2,engine.graphics.viewHeight/2 + 16);
    engine.graphics.context.textAlign = "left";
  }
}

function gameOver(){
  if(score > bestScore){
    localStorage.setItem("highscore", score);
    bestScore = score;
  }
  world = createMenuWorld();
}

function createGameWorld(){
  var world = new World();

  score = 0;

  world.add(new Spawner(world));

  var player = new Player(world);
  //world.add(new Block(world,160-16,128,32,32));
  world.add(new Block(world,0,160,120,2));
  world.add(new Block(world,200,160,120,2));

  world.add(new Block(world,200,20,120,2));
  world.add(new Block(world,0,20,120,2));


  world.add(new Block(world,100,100,120,2));

  world.add(new Block(world,0,0,2,240));
  world.add(new Block(world,318,0,2,240));

  world.add(new ScoreObject(world));

  world.add(player);

  return world;
}

function createMenuWorld(){
  var world = new World();

  world.add(new StartGameObject(world));

  return world;
}
