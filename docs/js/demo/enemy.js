function Enemy(world, x, y){
  makeGameObject(this,world);

  var type = Math.random() < 0.25 ? 1 : 0;

  this.transform.x = x;
  this.transform.y = y;
  if(type == 0){
    this.transform.width = 8;
    this.transform.height = 8;
  }

  this.solid = false;
  this.isEnemy = true;

  this.health = 5;
  if(type == 1)
    this.health = 20;

  var image = 0;
  if(type == 1)
    image = new Image("img_auber");
  if(type == 0)
    image = new Image("img_tomato");

  var color = "blue";
  var gravity = 0.25;
  var speed = 1;
  var dir = Math.random() < 0.5 ? speed : -speed;
  var velocity = new Vector2(dir, 0);
  var removed = false;
  var dead = false;

  var previousHealth = this.health;

  this.render = function(){
    engine.graphics.setColor(color);
    //engine.graphics.drawTransform(this.transform);
    engine.graphics.drawImage(image,this.transform.x, this.transform.y);
  }

  this.update = function(){
    applyGravity();

    if(!dead){
      if(!this.moveContactY(velocity.y)){
        velocity.y = 0;
      }
      if(!this.moveContactX(velocity.x)){
        velocity.x = -velocity.x;
      }
    }else{
      this.transform.y += velocity.y;
      this.transform.x += velocity.x;
    }

    if(this.transform.y > engine.graphics.viewHeight){
      if(dead){
        world.remove(this);
      }else{
        this.transform.x = Math.random() > 0.5 ? 48 : 320 - 48;
        this.transform.y = -16;
      }
    }

    if(this.health < 0){
      if(!dead){
        if(Math.random() < 0.5){
          //explode
          world.add(new Explosion(world, this.transform.x, this.transform.y));
          world.remove(this);
        }else{
          velocity.y = -2;
        }
      }
      dead = true;
    }

    if(this.health != previousHealth){
      color = "red";
    }else{
      color = "blue";
    }

    previousHealth = this.health;
  }

  function applyGravity(){
    velocity.y += gravity;
  }
}
