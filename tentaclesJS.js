var SIZE;

var tentacleA;
var tentacleB;

var colA;
var colB;

var winner;

var checkers;

var pressedLeft;
var pressedRight;

var keyPresses = 0;

function setup() {
  //createCanvas(window.innerHeight, window.innerHeight);
  createCanvas(window.innerWidth, window.innerHeight);
  SIZE = height;
  
  colA = color(0, 153, 204);
  colB = color(204, 153, 0);
  
  reset();
  
  pressedLeft = 0;
  pressedRight = 0;
  
  document.getElementById("wasdf").style.left = '' + ((window.innerWidth - window.innerHeight) / 2) + 'px';
  document.getElementById("arrows").style.right = '' + ((window.innerWidth - window.innerHeight) / 2) + 'px';
  
  pixelDensity(1);
}

function reset() {
  winner = 0;
  checkers = [];
  
  tentacleA = new Tentacle(SIZE / 2, SIZE / 4, SIZE, colA, 1, SIZE / 12.0, SIZE / 2.0, 2);
  tentacleB = new Tentacle(SIZE / 2, 3 * SIZE / 4, SIZE, colB, 1, 11 * SIZE / 12.0, SIZE / 2.0, 1);
  
  tentacleA.collision = tentacleB;
  tentacleB.collision = tentacleA;
}

function draw() {
  background(255);
  translate((window.innerWidth - window.innerHeight) / 2, 0);
  
  var squares = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  var squareCounts = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (var i = 0; i < checkers.length; i++) {
    if (checkers[i].dropped()) {
      var x = Math.floor(((checkers[i].x - SIZE / 4.0) / (SIZE / 6.0) + 1) - 1);  //+1 -1 deals with rounding towards 0
      var y = Math.floor(((checkers[i].y - SIZE / 4.0) / (SIZE / 6.0) + 1) - 1);
      
      if (0 <= x && 3 > x && 0 <= y && 3 > y) {
        if (squares[x][y] != checkers[i].team && squares[x][y] != 0) {
          squareCounts[x][y]--;
          if (squareCounts[x][y] == 0)
            squares[x][y] = 0;
        }
        if (squares[x][y] == 0) {
          squares[x][y] = checkers[i].team;
          squareCounts[x][y] = 1;
        } else if (squares[x][y] == checkers[i].team) {
          squareCounts[x][y]++;
        }
      }
    }
  }
  
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (squares[i][j] != 0) {
        var c = squares[i][j] == 2 ? colA : colB;
        noStroke();
        fill(c, 200);
        rect(SIZE / 4.0 + i * (SIZE / 6.0), SIZE / 4.0 + j * (SIZE / 6.0),
          (SIZE / 6.0), (SIZE / 6.0));
      }
    }
  }
  
  for (var i = 0; i < 3; i++) {
    var t = squares[i][0];
    if (t > 0) {
      var failed = false;
      for (var j = 1; j < 3; j++) {
        if (t != squares[i][j]) {
          failed = true;
          break;
        }
      }
      if (!failed) {
        winner = t;
        console.log("win condition 1!");
      }
    }
  }
  
  if (winner == 0) {
    for (var i = 0; i < 3; i++) {
      var t = squares[0][i];
      if (t > 0) {
        var failed = false;
        for (var j = 1; j < 3; j++) {
          if (t != squares[j][i]) {
            failed = true;
            break;
          }
        }
        if (!failed) {
          winner = t;
        console.log("win condition 2!");
        }
      }
    }
  }
  
  if (winner == 0) {
    var t = squares[0][0];
    if (t > 0) {
      var failed = false;
      for (var j = 1; j < 3; j++) {
        if (t != squares[j][j]) {
          failed = true;
          break;
        }
      }
      if (!failed) {
        winner = t;
        console.log("win condition 3!");
      }
    }
  }
  
  if (winner == 0) {
    var t = squares[2][0];
    if (t > 0) {
      var failed = false;
      for (var j = 1; j < 3; j++) {
        if (t != squares[2 - j][j]) {
          failed = true;
          break;
        }
      }
      if (!failed) {
        winner = t;
        console.log("win condition 4!");
      }
    }
  }
  
  
  if (winner != 0) {
    var c = winner == 2 ? colA : colB;
    noStroke();
    fill(red(c), green(c), blue(c), 100);
    rect(0, 0, SIZE, SIZE);
    document.getElementById("pressAnyKey").style.visibility = 'visible';
  }
  
  fill(colA);
  ellipse(tentacleA.pickupX, tentacleA.pickupY, 150, 150);
  fill(50,50);
  for (var i = 0; i < 150; i += 30) {
    ellipse(tentacleA.pickupX, tentacleA.pickupY, i, i);
  }
  fill(colB);
  ellipse(tentacleB.pickupX, tentacleB.pickupY, 150, 150);
  fill(50,50);
  for (var i = 0; i < 150; i += 30) {
    ellipse(tentacleB.pickupX, tentacleB.pickupY, i, i);
  }
  
  noFill();
  stroke(100, 100, 100);
  strokeWeight(10);
 /* line(SIZE / 4.0, SIZE / 4.0, 3 * SIZE / 4.0, SIZE / 4.0);
  line(SIZE / 4.0, SIZE / 4.0, SIZE / 4.0, 3 * SIZE / 4.0);
  line(SIZE / 4.0, 3 * SIZE / 4.0, 3 * SIZE / 4.0, 3 * SIZE / 4.0);
  line(3 * SIZE / 4.0, SIZE / 4.0, 3 * SIZE / 4.0, 3 * SIZE / 4.0); */
  
  line(SIZE / 4.0, SIZE / 4.0 + SIZE / 6.0, 3 * SIZE / 4.0, SIZE / 4.0 + SIZE / 6.0);
  line(SIZE / 4.0, SIZE / 4.0 + 2 * SIZE / 6.0, 3 * SIZE / 4.0, SIZE / 4.0 + 2 * SIZE / 6.0);
  
  line(SIZE / 4.0 + SIZE / 6.0, SIZE / 4.0, SIZE / 4.0 + SIZE / 6.0, 3 * SIZE / 4.0);
  line(SIZE / 4.0 + 2 * SIZE / 6.0, SIZE / 4.0, SIZE / 4.0 + 2 * SIZE / 6.0, 3 * SIZE / 4.0);
  
  
  var s = millis();
  var st = millis();
  //tentacleA.drawToCanvas();
  //tentacleB.drawToCanvas();
  
  tentacleA.drawShadow();
  tentacleB.drawShadow();
  
  if (winner == 0) {
    for (var i = 0; i < checkers.length; i++) {
      checkers[i].update();
      checkers[i].drawShadow();
    }
  }
  
  if (tentacleA.dropped) {
    tentacleA.draw();
  }
  if (tentacleB.dropped) {
    tentacleB.draw();
  }
  
  for (var i = 0; i < checkers.length; i++) {
    checkers[i].draw();
  }
  
  if (!tentacleA.dropped) {
    tentacleA.draw();
  }
  if (!tentacleB.dropped) {
    tentacleB.draw();
  }
  //println("tentacle draw: " + (millis() - s));
  if (winner == 0) {
    s = millis();
    tentacleA.update();
    tentacleB.update();
  }
  //println("tentacle update: " + (millis() - s));
  s = millis();
  //println("checkers: " + (millis() - s));
  //println("total: " + (millis() - st));
  
  //println(frameRate);
  //exit();
  
  if (pressedLeft != 0) {
    document.getElementById("wasdf").style.opacity = '' + max(0, (1 - (millis() - pressedLeft) / 1000));
  }
  if (pressedRight != 0) {
    document.getElementById("arrows").style.opacity = '' + max(0, (1 - (millis() - pressedLeft) / 1000));
  }
}

function keyPressed() {
  if (winner == 0) {
    if (key == 'w' || key == 'W') {
      tentacleA.pressUp();
    } else if (key == 'a' || key == 'A') {
      tentacleA.pressLeft();
    } else if (key == 's' || key == 'S') {
      tentacleA.pressDown();
    } else if (key == 'd' || key == 'D') {
      tentacleA.pressRight();
    } else if (key == 'f' || key == 'F') {
      tentacleA.pressDrop();
    }
    
    if (pressedLeft == 0 &&
      (key == 'w' || key == 'W' ||
      key == 'a' || key == 'A' ||
      key == 's' || key == 'S' ||
      key == 'd' || key == 'D' ||
      key == 'f' || key == 'F')) {
      pressedLeft = millis();
    }
    
    if (keyCode == UP_ARROW) {
      tentacleB.pressUp();
    } else if (keyCode == LEFT_ARROW) {
      tentacleB.pressLeft();
    } else if (keyCode == RIGHT_ARROW) {
      tentacleB.pressRight();
    } else if (keyCode == DOWN_ARROW) {
      tentacleB.pressDown();
    } else if (keyCode == 191) {
      tentacleB.pressDrop();
    }
    
    if (pressedRight == 0 &&
      (keyCode == UP_ARROW ||
      keyCode == LEFT_ARROW ||
      keyCode == RIGHT_ARROW ||
      keyCode == DOWN_ARROW ||
      keyCode == 191)) {
      pressedRight = millis();
    }
  } else {
    if (keyPresses == 5)  {
      keyPresses = 0;
      document.getElementById("pressAnyKey").style.width = '' + (400 + 50 * keyPresses) + 'px';
      document.getElementById("pressAnyKey").style.left = 'calc(50% - ' + (400 + 50 * keyPresses)/2 + 'px)';
    document.getElementById("pressAnyKey").style.visibility = 'hidden';
      
      reset();
    } else {
      keyPresses++;
      
      document.getElementById("pressAnyKey").style.width = '' + (400 + 50 * keyPresses) + 'px';
      document.getElementById("pressAnyKey").style.left = 'calc(50% - ' + (400 + 50 * keyPresses)/2 + 'px)';
    }
  }
}

function keyReleased() {
  if (winner == 0) {
    if (key == 'w' || key == 'W') {
      tentacleA.releaseUp();
    } else if (key == 'a' || key == 'A') {
      tentacleA.releaseLeft();
    } else if (key == 's' || key == 'S') {
      tentacleA.releaseDown();
    } else if (key == 'd' || key == 'D') {
      tentacleA.releaseRight();
    } else if (key == 'f' || key == 'F') {
      tentacleA.releaseDrop();
    }
    
    if (keyCode == UP_ARROW) {
      tentacleB.releaseUp();
    } else if (keyCode == LEFT_ARROW) {
      tentacleB.releaseLeft();
    } else if (keyCode == RIGHT_ARROW) {
      tentacleB.releaseRight();
    } else if (keyCode == DOWN_ARROW) {
      tentacleB.releaseDown();
    } else if (keyCode == 191) {
      tentacleB.releaseDrop();
    }
  }
}

function spawnChecker(team) {
  var t = team == 2 ? tentacleA : tentacleB;
  checkers.push(new Checker(t.pickupX, t.pickupY, team == 2 ? colA : colB, team));
  var teamCheckers = 0;
  var firstTC = -1;
  for (var i = 0; i < checkers.length; i++) {
    if (checkers[i].team == team) {
      teamCheckers++;
      if (firstTC == -1) {
        firstTC = i;
      }
    }
  }
  console.log(teamCheckers);
  if (teamCheckers > 7) {
    checkers.splice(firstTC, 1);
  }
  checkers[checkers.length - 1].addCollision(tentacleA);
  checkers[checkers.length - 1].addCollision(tentacleB);
  for (var i = 0; i < checkers.length - 1; i++) {
     checkers[i].addCollision(checkers[checkers.length - 1]);
     checkers[checkers.length - 1].addCollision(checkers[i]);
  }
  return checkers[checkers.length - 1];
}