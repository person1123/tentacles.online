function Checker(sx, sy, c, t) {
  this.r = 50;
  
  this.pickedUp = false;
  this.grabbed = false;
  
  this.grabber = undefined;
  this.grabbedT = 0;
  this.grabbedOffset = createVector(0, 0);
  
  this.x = sx;
  this.y = sy;
  this.col = c;
  this.team = t;
  this.collisions = [];
  
  this.addCollision = function(c) {
    this.collisions.push(c);
  }
  
  this.update = function() {
    if (!this.grabbed) {
      for (var i = 0; i < this.collisions.length; i++) {
        var collision = this.collisions[i];
        if (collision.dropped()) {
            var f = collision.force(this.x, this.y);
            this.x += f.x;
            this.y += f.y;
            //x = max(r, min(SIZE - r, x));
            //y = max(r, min(SIZE - r, y));
        }
      }
    } else {
      var newPt = pointOnBezierCurve(this.grabbedT,
        createVector(this.grabber.baseX, this.grabber.baseY), 
        this.grabber.midpoint(),
        createVector(this.grabber.headX, this.grabber.headY)).add(this.grabbedOffset);
        
      this.x = newPt.x;
      this.y = newPt.y;
    }
  }
  
  this.drawShadow = function() {
    noStroke();
    fill(50, 50, 50);
    ellipse(this.x, this.y, 2 * this.r, 2 * this.r);
  }
    
  this.draw = function() {
    noStroke();
    fill(this.col);
    var dist = this.dropped() ? 10 : 50;
    ellipse(this.x - dist / 2, this.y + dist, 2 * this.r, 2 * this.r);
  }
  
  this.grab = function(t) {
    this.grabbed = true;
    this.grabber = t;
    
    this.grabbedT = closestParameterValue(createVector(this.x, this.y),
      createVector(t.baseX, t.baseY), 
      t.midpoint(),
      createVector(t.headX, t.headY));
      
    grabbedOffset = (createVector(this.x, this.y)).sub(pointOnBezierCurve(
      this.grabbedT,
      createVector(t.baseX, t.baseY), 
      t.midpoint(),
      createVector(t.headX, t.headY)));
  }
  
  this.pickUp = function() {
    this.pickedUp = true;
  }
  
  this.drop = function() {
    this.pickedUp = false;
    this.grabbed = false;
  }
  
  this.force = function(ox, oy) {
    return (createVector(ox - this.x, oy - this.y))
      .normalize()
      .mult(max(0, this.r - (createVector(this.x, this.y)).dist(createVector(ox, oy))));
  }
  
  this.dropped = function() {
    return !this.pickedUp;
  }
}