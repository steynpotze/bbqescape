function Engine(canvas){
  this.onUpdate = undefined;
  this.onRender = undefined;

  this.canvas = canvas;

  this.width = canvas.width;
  this.height = canvas.height;

  this.graphics = new Graphics(this.canvas);
  this.input = new Input();

  this.lastTime = Date.now();
  this.runTime = 0;
}

Engine.prototype.start = function(){
  if(requestAnimationFrame){
    var engine = this;
    requestAnimationFrame(function(){engine.step();});
  }else{
    var engine = this;
    setInterval(function(){engine.step();}, 16);
  }
}

Engine.prototype.step = function(){
  var currentTime = Date.now();
  this.deltaTime = (currentTime - this.lastTime) / 1000.0;
  this.runTime += this.deltaTime;

  this.input.poll();

  if(this.onUpdate)
    this.onUpdate();
  if(this.onRender)
    this.onRender();

  this.lastTime = currentTime;

  if(requestAnimationFrame){
    var engine = this;
    requestAnimationFrame(function(){engine.step();});
  }
}

function Graphics(canvas){
  this.canvas = canvas;
  this.context = canvas.getContext('2d');

  //disable smooth scaling for pixel art games!
  this.context.imageSmoothingEnabled = false;
  this.context.mozImageSmoothingEnabled = false;
  this.context.oImageSmoothingEnabled = false;
  this.context.msImageSmoothingEnabled = false;

  this.viewX = 0;
  this.viewY = 0;
  this.viewWidth = canvas.width;
  this.viewHeight = canvas.height;
}

Graphics.prototype.setViewPort = function(width, height){
  if(width == undefined && height == undefined)
    return;
  var aspect = canvas.width / canvas.height;
  if(width == undefined){
    //set width from height
    width = height * aspect;
  }
  if(height == undefined){
    //set height from width
    height = width / aspect;
  }

  this.viewWidth = width;
  this.viewHeight = height;
}

Graphics.prototype.identity = function(){
  var xScale = this.canvas.width / this.viewWidth;
  var yScale = this.canvas.height / this.viewHeight;

  this.context.setTransform(xScale, 0, 0, yScale, 0, this.viewY * yScale);
  this.context.translate(this.viewX, this.viewY);
}

Graphics.prototype.clear = function(){
  this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
}

Graphics.prototype.setColor = function(color){
  this.context.fillStyle = color;
}

Graphics.prototype.drawRect = function(x,y,width,height){
  this.context.fillRect(x,y,width,height);
}

Graphics.prototype.drawTransform = function(transform){
  this.context.fillRect(transform.x, transform.y, transform.width, transform.height);
}

Graphics.prototype.drawImage = function(img, x, y, width, height){
  if(!width)
    width = img.width;
  if(!height)
    height = img.height;

  this.context.drawImage(img.raw, x, y, width, height);
}

Graphics.prototype.setBlendMode = function(mode){
  this.context.globalCompositeOperation = mode;
}

Graphics.prototype.setAlpha = function(alpha){
  this.context.globalAlpha = alpha;
}

Graphics.prototype.drawSprite = function(sprite, x, y, width, height){
  var xScale = width / sprite.width;
  var yScale = height / sprite.height;

  this.context.translate(x,y);
  this.context.scale(xScale, yScale);
  this.context.drawImage(sprite.raw, 0, 0);
  this.context.scale(1/xScale, 1/yScale);
  this.context.translate(-x,-y);
}

Graphics.prototype.drawText = function(text, x, y){
  this.context.fillText(text,x,y);
}

Graphics.prototype.setFont = function(font){
  this.context.font = font;
}


Graphics.prototype.drawCircle = function(x,y,radius){
  this.context.beginPath();
  this.context.arc(x,y,radius, 0, Math.PI * 2, false);
  this.context.fill();
}

function Input(){
  //why be efficient with memory anyway right?
  this.keydown = new Array(400);

  this.justPressed = [];
  this.justReleased = [];
  this.eventStack = [];

  var input = this;

  //for those wondering :
  //javascript is singlethreaded, therefor the input event CANNOT fire while the game logic is running.
  //so i added an eventQue (eventStack) to capture all events between two poll calls, and when poll
  //is called, updated the justPressed, and justReleased (and keydown).
  //this way you won't miss any keypress.
  document.addEventListener("keydown", function(event){
    if(!event.repeat)
      input.eventStack.push({keyCode:event.keyCode, pressed:true});
  });
  document.addEventListener("keyup", function(event){
    if(!event.repeat)
      input.eventStack.push({keyCode:event.keyCode, pressed:false});
  });

  this.isKeyDown = function(key){
    return this.keydown[key];
  }

  this.isKeyPressed = function(key){
    return this.justPressed.indexOf(key) >= 0;
  }

  this.isKeyReleased = function(key){
    return this.justReleased.indexOf(key) >= 0;
  }

  //poll function exchanges the eventStack with justPressed and justReleased.
  this.poll = function(){
    this.justPressed = [];
    this.justReleased = [];

    for(var i = 0; i < this.eventStack.length; i++){
      this.keydown[this.eventStack[i].keyCode] = this.eventStack[i].pressed;

      if(this.eventStack[i].pressed){
        this.justPressed.push(this.eventStack[i].keyCode);
      }else{
        this.justReleased.push(this.eventStack[i].keyCode);
      }
    }
    this.eventStack = [];
  }
}

function Vector2(x,y){
  this.x = x;
  this.y = y;
}

Vector2.prototype.add = function(other){
  this.x += other.x;
  this.y += other.y;
  return this;
}

Vector2.prototype.clone = function(){
  return new Vector2(this.x,this.y);
}

Vector2.prototype.mul = function(scaler){
  this.x *= scaler;
  this.y *= scaler;
  return this;
}

function Rect(x,y,w,h){
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
}

Rect.prototype.getLeft = function(){
  return this.x;
}

Rect.prototype.getRight = function(){
  return this.x + this.width;
}

Rect.prototype.getTop = function(){
  return this.y;
}

Rect.prototype.getBottom = function(){
  return this.y + this.height;
}

Rect.prototype.overlaps = function(other){

  if(this.getLeft() >= other.getRight()){
    return false;
  }
  if(other.getLeft() >= this.getRight()){
    return false;
  }
  if(this.getTop() >= other.getBottom()){
    return false;
  }
  if(other.getTop() >= this.getBottom()){
    return false;
  }

  return true;
}

function Image(source){
  this.raw = document.getElementById(source);
  this.width = this.raw.width;
  this.height = this.raw.height;
}

function Audio(source){
  this.raw = document.getElementById(source).cloneNode(true);
}

Audio.prototype.stop = function(){
  this.raw.pause();
  this.raw.currentTime = 0;
}

Audio.prototype.replay = function(){
  this.stop();
  this.play();
}

Audio.prototype.play = function(){
  this.raw.play();
}

Audio.prototype.pause = function(){
  this.raw.pause();
}

Audio.prototype.setLoop = function(loop){
  this.raw.loop = loop;
}

function World(){
  this.gameObjects = [];
}

World.prototype.add = function(gameObject){
  this.gameObjects.push(gameObject);
}

World.prototype.remove = function(gameObject){
  var index = this.gameObjects.indexOf(gameObject);

  if(index >= 0)
    this.gameObjects.splice(index, 1);
}

World.prototype.update = function(){
  for(var i = 0; i < this.gameObjects.length; i++){
    this.gameObjects[i].update();
  }
}

World.prototype.render = function(){
  for(var i = 0; i < this.gameObjects.length; i++){
    this.gameObjects[i].render();
  }
}

World.prototype.getColliders = function(transform, exclude){
  var colliders = [];
  for(var i = 0; i < this.gameObjects.length; i++){
    if(this.gameObjects[i].transform.overlaps(transform)){
      if(this.gameObjects[i] != exclude)
        colliders.push(this.gameObjects[i]);
    }
  }
  return colliders;
}

function GameObject(){
  makeGameObject(this);
}

function makeGameObject(object, world){
  object.transform = new Rect(0,0,16,16);

  object.world = world;
  object.solid = false;

  var tinyOffset = 0.0;

  object.update = function(){};
  object.render = function(){};

  //returns if place is free (no solid objects)
  object.placeFree = function(x, y){
    var colliders = object.getColliders(x,y);

    for(var i = 0; i < colliders.length; i++){
      if(colliders[i].solid)
        return false;
    }

    return true;
  };

  //returns if place is empty
  object.placeEmpty = function(x, y){
    var colliders = object.getColliders(x, y);

    for(var i = 0; i < colliders.length; i++){
      return false;
    }

    return true;
  };

  object.getColliders = function(x, y){
    var tempTransform = new Rect(x,y,object.transform.width, object.transform.height);

    return object.world.getColliders(tempTransform, object);
  }

  object.getSolidColliders = function(x, y){
    var tempTransform = new Rect(x,y,object.transform.width, object.transform.height);

    var c = object.world.getColliders(tempTransform, object);
    var colliders = [];

    for(var i = 0; i < c.length; i++){
      if(c[i].solid == true){
        colliders.push(c[i]);
      }
    }



    return colliders;
  }

  //moves this game object by x and y until it hits something.
  //return true if something has been hit
  object.moveContactX = function(motionX){
    var colliders = object.getSolidColliders(object.transform.x + motionX, object.transform.y);

    if(colliders.length <= 0){
      object.transform.x += motionX;
      return true;
    }
    //going right!
    if(motionX > 0){
      var lowestX = undefined;
      for(var i = 0; i < colliders.length; i++){
        if(colliders[i].transform.getLeft() < lowestX || lowestX == undefined){
          lowestX = colliders[i].transform.getLeft();
        }
      }
      if(lowestX != undefined){
        object.transform.x = lowestX - object.transform.width - tinyOffset;
      }
    }
    //going left!
    if(motionX < 0){
      var highestX = undefined;
      for(var i = 0; i < colliders.length; i++){
        if(colliders[i].transform.getRight() > highestX || highestX == undefined){
          highestX = colliders[i].transform.getRight();
        }
      }
      if(highestX != undefined){
        object.transform.x = highestX + tinyOffset;
      }
    }

    return false;

  }
  object.moveContactY = function(motionY){
    var colliders = object.getSolidColliders(object.transform.x, object.transform.y + motionY);

    if(colliders.length <= 0){
      object.transform.y += motionY;
      return true;
    }
    //going up!
    if(motionY > 0){
      var highest = undefined;
      for(var i = 0; i < colliders.length; i++){
        if(colliders[i].transform.getTop() < highest || highest == undefined){
          highest = colliders[i].transform.getTop();
        }
      }
      if(highest != undefined){
        object.transform.y = highest - object.transform.height - tinyOffset;
      }
    }
    //going up!
    else{
      var lowest = undefined;
      for(var i = 0; i < colliders.length; i++){
        if(colliders[i].transform.getBottom() > lowest || lowest == undefined){
          lowest = colliders[i].transform.getBottom();
        }
      }
      if(lowest != undefined){
        object.transform.y = lowest + tinyOffset;
      }
    }

    return false;
  }
}
