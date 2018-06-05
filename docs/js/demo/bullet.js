function Bullet(world, x, y, v){
  makeGameObject(this, world);

  this.transform.x = x;
  this.transform.y = y;
  this.transform.width = 16;
  this.transform.height = 2;

  new Audio("aud_shoot").play();

  var image = new Image("img_bullet");

  this.solid = false;

  var velocity = v;

  var lifetime = 20;

  this.update = function(){
    this.transform.x += velocity.x;
    this.transform.y += velocity.y;

    var colliders = this.getColliders(this.transform.x, this.transform.y);

    for(var i = 0; i < colliders.length; i ++){
      if(colliders[i].isEnemy){
        colliders[i].health -= 5;
        score += 3;
        world.remove(this);
      }
    }

    lifetime -= 1;
    if(lifetime < 0){
      this.destroy();
    }
  }

  this.render = function(){
    engine.graphics.setColor("orange");
    engine.graphics.drawImage(image,this.transform.x, this.transform.y);
    //engine.graphics.drawTransform(this.transform);
  }

  this.destroy = function(){
    this.world.remove(this);
  }
}
