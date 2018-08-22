function distanceToBezierCurve(M, P0, P1, P2) {
  // http://blog.gludion.com/2009/08/distance-to-quadratic-bezier-curve.html
  //println("M: " + M + " P0: " + P0 + " P1: " + P1 + " P2: " + P2);
  var t = closestParameterValue(M, P0, P1, P2);
  fill(255, 0, 0);
  if (t < 0) {
    t = 0;
    fill(0, 255, 0);
  } else if (t > 1) {
    t = 1;
  }
  //t = 0;
  //println("t: " + t);
  var pt = pointOnBezierCurve(t, P0, P1, P2);
  
  return pt.dist(M);
}

function closestParameterValue(M, P0, P1, P2) {
  // http://blog.gludion.com/2009/08/distance-to-quadratic-bezier-curve.html
  //println("M: " + M + " P0: " + P0 + " P1: " + P1 + " P2: " + P2);
  var scale = M.mag();
  M = M.copy().normalize();
  P0 = P0.copy().div(scale);
  P1 = P1.copy().div(scale);
  P2 = P2.copy().div(scale);
  //println("M: " + M + " P0: " + P0 + " P1: " + P1 + " P2: " + P2);
  //println("scale: " + scale);
  var A = P1.copy().sub(P0);
  var B = P2.copy().sub(P1).sub(A);
  var Mp = P0.copy().sub(M);
  var t = cubicFormula(B.dot(B), 3 * A.dot(B), 2 * A.dot(A) + Mp.dot(B), Mp.dot(A));
  return t;
}

function pointOnBezierCurve(t, P0, P1, P2) {
  return P0.copy().mult((1 - t) * (1 - t)).add(P1.copy().mult(2 * t * (1 - t))).add(P2.copy().mult(t * t));
}

function parallelAtPointOnBezierCurve(t, P0, P1, P2) {
  var parallel = P0.copy().mult(2 * t - 2).add(P1.copy().mult(2 - 4 * t)).add(P2.copy().mult(2 * t));
  return parallel.normalize();
}

function perpendicularAtPointOnBezierCurve(t, P0, P1, P2) {
  var parallel = P0.copy().mult(2 * t - 2).add(P1.copy().mult(2 - 4 * t)).add(P2.copy().mult(2 * t));
  var perp = parallel.x == 0 ? createVector(1, 0) : (parallel.y == 0 ? createVector(0, 1) : (createVector(-1/parallel.x, 1/parallel.y)).normalize());
  return perp;
}

function cubicFormula(a, b, c, d) {
  // https://en.wikipedia.org/wiki/Cubic_function#General_formula
  var del0 = b * b - 3 * a * c;
  var del1 = 2 * b * b * b - 9 * a * b * c + 27 * a * a * d;
  var C;
  if (del1 * del1 - 4 * del0 * del0 * del0 > 0) {
    if (del1 <  0) {
      var inside = (del1 - Math.sqrt(del1 * del1 - 4 * del0 * del0 * del0)) / 2;
      C = new Complex(Math.sign(inside) * Math.pow(Math.abs(inside), 1.0/3), 0);
    } else {
      var inside = (del1 + Math.sqrt(del1 * del1 - 4 * del0 * del0 * del0)) / 2;
      C = new Complex(Math.sign(inside) * Math.pow(Math.abs(inside), 1.0/3), 0);
    }
  } else {
    C = new Complex(Math.sign(del1) * Math.pow(Math.abs((del1 / 2)), 1.0/3), Math.pow(Math.sqrt(-(del1 * del1 - 4 * del0 * del0 * del0)) / 2, 1.0/3));
  }
  
  var C2 = (new Complex(-.5, .5 * sqrt(3))).mult(C);
  var C3 = (new Complex(-.5, -.5 * sqrt(3))).mult(C);
  
  var x1 = (new Complex(del0, 0)).div(C).add(C).add(new Complex(b, 0)).mult(new Complex(-1.0 / (3 * a), 0));
  var x2 = (new Complex(del0, 0)).div(C2).add(C2).add(new Complex(b, 0)).mult(new Complex(-1.0 / (3 * a), 0));
  var x3 = (new Complex(del0, 0)).div(C3).add(C3).add(new Complex(b, 0)).mult(new Complex(-1.0 / (3 * a), 0));
  
  if (Math.abs(x1.i) <= 0.001 && x1.r >= -0.001 && x1.r <= 1.001)
    return x1.r;
  if (Math.abs(x2.i) <= 0.001 && x2.r >= -0.001 && x2.r <= 1.001)
    return x2.r;
  if (Math.abs(x3.i) <= 0.001 && x3.r >= -0.001 && x3.r <= 1.001)
    return x3.r;
  
  if (Math.abs(x1.i) <= 0.001)
    return x1.r;
  if (Math.abs(x2.i) <= 0.001)
    return x2.r;
  if (Math.abs(x3.i) <= 0.001)
    return x3.r;
  
  /*println("a: " + a + " b: " + b + " c: " + c + " d: " + d);
  println("d0: " + del0);
  println("d1: " + del1);
  println("C1: " + C);
  println("C2: " + C2);
  println("C3: " + C3);
  println("x1: " + x1);
  println("x2: " + x2);
  println("x3: " + x3);*/
  return -1;
}

function Complex(r,  i) {
  this.r = r;
  this.i = i;
  
  this.add = function(o) {
    return new Complex(this.r + o.r, this.i + o.i);
  }
  
  this.sub = function(o) {
    return new Complex(this.r - o.r, this.i - o.i);
  }
  
  this.mult = function(o) {
    return new Complex(o.r * this.r - o.i * this.i, o.i * this.r  + o.r * this.i);
  }
  
  this.div = function(o) {
    var n = this.mult(new Complex(o.r,  -o.i));
    var d = o.mult(new Complex(o.r, -o.i)).r;
    n.r /= d;
    n.i /= d;
    return n;
  }
  
  this.toString = function() {
    return "" + r + " + " + i + "i";
  }
}