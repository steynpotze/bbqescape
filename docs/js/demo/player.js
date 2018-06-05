function Player(world){
  makeGameObject(this, world);

  this.transform.x = 160-8;
  this.transform.y = 48;
  this.transform.width = 9;
  this.transform.height = 15;
  this.solid = false;
  this.isPlayer = true;

  var key_right = 68;
  var key_left = 65;
  var key_jump = 32;
  var key_shoot_right = 39;
  var key_shoot_left = 37;

  var gravity = 0.25;
  var friction = 0.5;
  var airFriction = 0.25;
  var facingRight = true;
  var acceleration = 1;
  var velocity = new Vector2(0,0);
  var jumpspeed = -4;
  var movespeed = 2;
  var grounded = false;
  var airTicks = 0;
  var maxAirTicks = 8;

  var dead = false;

  var lastShotLeft = 0;
  var lastShotRight = 0;

  var doubleJump = false;

  var image = new Image("img_player");

  var sound_jump = new Audio("aud_jump");
  var sound_jump_double = new Audio("aud_jump_double");

  this.update = function(){

    if(this.transform.y > engine.graphics.viewHeight){
      gameOver();
    }

    if(dead){
      velocity.y += gravity;

      this.transform.y += velocity.y;

      return;
    }


    grounded = !this.placeFree(this.transform.x, this.transform.y + 1);


    if(grounded){
      airTicks = 0;
      doubleJump = true;
    }else{
      airTicks++;
    }

    applyGravity();
    applyFriction();

    if(engine.input.isKeyPressed(key_jump) && (grounded || airTicks < maxAirTicks)){
      velocity.y = jumpspeed;
      airTicks = maxAirTicks;
      sound_jump.play();
    }
    else if(engine.input.isKeyPressed(key_jump) && doubleJump){
      doubleJump = false;
      velocity.y = jumpspeed;
      sound_jump_double.play();
    }

    if(engine.input.isKeyDown(key_right)){
      facingRight = true;
      accelerate(movespeed);
    }
    if(engine.input.isKeyDown(key_left)){
      facingRight = false;
      accelerate(-movespeed);
    }

    lastShotLeft -= 1;
    lastShotRight -= 1;

    if(engine.input.isKeyDown(key_shoot_right)){
      facingRight = true;
    }
    if(engine.input.isKeyDown(key_shoot_left)){
      facingRight = false;
    }

    if(engine.input.isKeyDown(key_shoot_right) && facingRight && lastShotRight <= 0){
      world.add(new Bullet(world, this.transform.x, this.transform.y + 10, new Vector2(8,0)));
      lastShotRight = 12;
      screenshake += 4;
    }
    if(engine.input.isKeyDown(key_shoot_left) && !facingRight && lastShotLeft <= 0){
      world.add(new Bullet(world, this.transform.x, this.transform.y + 10, new Vector2(-8,0)));
      lastShotLeft = 12;
      screenshake += 4;
    }

    this.moveContactX(velocity.x);

    if(!this.moveContactY(velocity.y)){
      velocity.y = 0;
    }


    this.checkDeath();

  }

  this.checkDeath = function(){
    if(!grounded)
      return;
    
    var colliders = this.getColliders(this.transform.x, this.transform.y);

    for(var i = 0; i < colliders.length; i ++){
      if(colliders[i].isEnemy == true){
        if(colliders[i].health > 0){
          velocity.y = -2;
          dead = true;
        }
      }
    }

  }

  function applyGravity(){
    velocity.y += gravity;
  }

  function applyFriction(){
    var f = grounded ? friction : airFriction;
    if(velocity.x > 0){
      velocity.x -= f;
      if(velocity.x < 0)
        velocity.x = 0;
    }else if(velocity.x < 0){
      velocity.x += f;
      if(velocity.x > 0)
        velocity.x = 0;
    }
  }

  function accelerate(xMotion){
    if(xMotion > 0){
      if(velocity.x < xMotion){
        velocity.x += acceleration;
        if(velocity.x > xMotion)
          velocity.x = xMotion;
      }
    }else if(xMotion < 0){
      if(velocity.x > xMotion){
        velocity.x -= acceleration;
        if(velocity.x < xMotion)
          velocity.x = xMotion;
      }
    }
  }

  this.render = function(){
    engine.graphics.setColor("white");
    //engine.graphics.drawTransform(this.transform);
    if(facingRight){
      engine.graphics.drawImage(image,this.transform.x - 1, this.transform.y)
    }else{
      engine.graphics.drawSprite(image,this.transform.x - 5 + image.width, this.transform.y, -image.width, image.height);
    }
  }
}
