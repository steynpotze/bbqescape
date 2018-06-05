function Explosion(world, x, y){
  makeGameObject(this,world);
  this.transform.x = x;
  this.transform.y = y;


  new Audio("aud_expl").play();

  if(screenshake < 12){
    screenshake += 12;
    if(screenshake > 12)
      screenshake = 12;
  }

  var lifetime = 6;

  this.update = function(){
    lifetime--;
    if(lifetime < 0){
      world.remove(this);
    }
  }

  this.render = function(){
    engine.graphics.setColor("red");
    engine.graphics.drawCircle(this.transform.x, this.transform.y, 24);
    engine.graphics.setColor("yellow");
    engine.graphics.drawCircle(this.transform.x, this.transform.y, 16);
    engine.graphics.setColor("white");
    engine.graphics.drawCircle(this.transform.x, this.transform.y, 8);
  }
}
