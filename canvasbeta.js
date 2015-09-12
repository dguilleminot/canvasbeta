// CANVAS
  //INITATION
  $(window).on("load", function(){
    canvas = document.getElementById("canvasFirst");
      contextFirst = canvas.getContext("2d"),
      canvasBis = document.getElementById("canvasBis"),
      contextBis = canvasBis.getContext("2d");
      initCanvas()
  });

  var  requestAnimationFrame =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          window.oRequestAnimationFrame,
        cancelAnimationFrame =
          window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.msCancelAnimationFrame ||
          window.oCancelAnimationFrame;
          window.onresize = function() {
             window.cancelAnimationFrame(animationFrame)
             initCanvas();
          },
          triArray = [],
          plusArray = [],
          colorGray = ["#A2A2A2", "#D1D1D1", "#F1F1F1"],
          globalValue = {},
          mainColor = {},
          circle = {},
          rad  = 0;

  var animationFrame, canvas,ww, wh;



  function GlobalValue(){
    this.rad = ww * 7/100;
    this.maxW = ww - this.rad - 1;
    this.maxH = wh - this.rad - 1;
    this.maxTriH = wh * 14 / 100;
    this.centerX = ww/2;
    this.centerY = wh/2;
    this.isDraw = true;
  };

  var util = {
    randomBtw : randomBtw,
    posNeg : posNeg,
    removeItem : removeItem,
  };
  function randomBtw(max, min){
    var min = (min===undefined)? 0 : min;
    result = Math.round( Math.random() * max + min );
    return result;
  }
  function posNeg(){
    var rndm = Math.round(Math.random());
    result = (rndm)? -1 : 1;
    return result;
  };
  function removeItem(array, item) {
    array.forEach(function(el, index){
      if(el === item){
        array.splice(index, 1);
      }
    })
  }

  function initCanvas(){
        ww = $(window).width(),
        wh = $(window).height();
      wwOnTwo = ww /2;

    globalValue = new GlobalValue();
    canvas.width = ww,
    canvas.height = wh;
    canvasBis.width = ww,
    canvasBis.height = wh;
    rad = ww * 7/100;
    mainColor = new Color();
    circle = new Circle();
    animationFrame = requestAnimationFrame(draw);
  };

  function Color(){
    this.blue = 128;
    this.green = 159;
    this.rgb = "rgb(60,"+this.green+","+this.blue+")";
    this.counter = 0;
    this.pitchB = 1;
    this.pitchG = -1;
    this.elementBackColor = $(".main-color-background");
    this.elementColor = $(".main-color");
  }

  Color.prototype.update = updateColor;
  
  function updateColor() {
    this.counter++;
    if(this.counter === 10){
      this.counter = 0;
      this.green+=(this.pitchG);
      this.blue+=(this.pitchB);
      if(this.green >= 160 || this.green <= 60){
        this.pitchG = this.pitchG * -1;
      }
      if(this.blue >= 200 || this.blue <= 100){
        this.pitchB = this.pitchB * -1;
      }
      this.rgb = "rgb(60,"+this.green+","+this.blue+")";
    }
  };

  function Circle(){
    this.x = util.randomBtw(globalValue.maxW, globalValue.rad);
    this.y = util.randomBtw(globalValue.maxH, globalValue.rad);
    this.rad = globalValue.rad;
    this.varX = Math.round(130 / 60);
    this.varY = Math.round(350 / 60);
  }

  Circle.prototype.update = updateCircle;
  Circle.prototype.draw = drawCircle;

  function updateCircle(){
    var maxW = globalValue.maxW,
        maxH = globalValue.maxH;
    this.x += this.varX;
    this.y += this.varY;
        if(this.x <= rad){
          this.varX = Math.abs(this.varX);
        }
        if(this.x >= maxW){
          this.varX = Math.abs(this.varX) * -1;
        }
        if(this.y >= maxH){
          this.varY = Math.abs(this.varY) * -1;
        }
        if(this.y <= rad){
          this.varY = Math.abs(this.varY);
          var tri = new triangle(this.x),
            tri2 = new triangle(this.x),
            tri3 = new triangle(this.x);

          triArray.push(tri, tri2, tri3);
          initPlus(this.x);
        }
        this.draw();
  }
  function drawCircle(){
    contextBis.beginPath();
    contextBis.fillStyle = mainColor.rgb;
    contextBis.arc(circle.x, circle.y, rad, 0, Math.PI * 2, 0);
    contextBis.fill();
    contextBis.closePath();
  }

  function triangle(x){
    var rndm = util.randomBtw(rad,rad -10),
        maxTriH = globalValue.maxTriH;
    this.cordo = [ x -rndm , 0, rndm + x, 0, x, 0];
    this.maxH = util.randomBtw(maxTriH, maxTriH - 60);
    this.maxW = util.randomBtw(this.maxH, 0) * util.posNeg() / 100;
    this.color = Math.round(util.randomBtw(6,2))/10;
  }

  triangle.prototype.update = updateTri;
  triangle.prototype.drawTri = drawTri;
  triangle.prototype.end = endTri;

  function updateTri(){
    this.pitch = (this.pitch) ? this.pitch : this.maxH / (60 * 2);
    if(this.cordo[5] >= this.maxH){
      this.drawTri();
      return;
    }
    var maxW = this.maxW;
    this.cordo[0]+= maxW;
    this.cordo[2]+= maxW;
    this.cordo[4]+= maxW;
    this.cordo[5]+= this.pitch;
    this.drawTri();
  }

  function drawTri(){
    contextBis.beginPath();
    contextBis.moveTo(this.cordo[0],this.cordo[1]);
    contextBis.lineTo(this.cordo[2],this.cordo[3]);
    contextBis.lineTo(this.cordo[4],this.cordo[5]);
    contextBis.closePath();
    contextBis.fillStyle = 'rgba(255,255,255,'+ this.color+')';
    contextBis.fill();
  }

  function endTri(){
    this.color -=.01;
    if(this.color <= 0){
      util.removeItem(triArray, this);
    }
  }

  function drawBackground(){
    contextBis.clearRect(0, 0, ww, wh);
    var centerX = globalValue.centerX,
      centerY = globalValue.centerY,
      grd = contextFirst.createRadialGradient(centerX,centerY, 3,centerX,centerY, wh*3);
    grd.addColorStop(0, mainColor.rgb);
    grd.addColorStop(1,"rgba(0,0,0,.01)");
    contextFirst.globalAlpha = 1;
    contextFirst.fillStyle = grd;
    contextFirst.rect(0,0,ww, wh);
    contextFirst.fill();
  }

  function initPlus(x){
    for(i=0; i<20;i++){
      var plus = new Plus(x);
      plusArray.push(plus);
    }
  };


  function Plus(x){
    this.w = util.randomBtw(rad - rad *2/3 , 4);
    this.h = util.randomBtw((rad - rad *2/3)/3, 4);
    this.alpha = util.randomBtw(8,4);
    this.color = colorGray[Math.round(Math.random()* 2)];
    this.x = x - rad/2 + util.randomBtw(rad);
    this.y = util.randomBtw(rad) - rad/2;
    this.align = this.w/2 - this.h/2;
    this.varX = util.randomBtw(rad*1.5) / 60 * util.posNeg();
    this.varY = util.randomBtw(rad*1.5) / 60;
  };

    Plus.prototype.update = updatePlus;
    Plus.prototype.draw = drawPlus;

    function updatePlus() {
       this.x += this.varX;
       this.y += this.varY;
       if(this.alpha > .07){
         this.alpha -= .07;
         this.draw(this);
       }else{
         this.alpha = 0;
         this.draw(this);
         util.removeItem(plusArray, this);
       }
   };

  function drawPlus(plus){
    contextBis.beginPath();
    contextBis.globalAlpha = plus.alpha;
    contextBis.fillStyle = plus.color;
    contextBis.rect(plus.x, plus.y, plus.w, plus.h);
    contextBis.rect(plus.x + plus.align , plus.y - plus.align, plus.h, plus.w);
    contextBis.fill();
    contextBis.closePath();
    contextBis.globalAlpha = 1;
  }


  function draw(){
    animationFrame = requestAnimationFrame(draw);
    mainColor.update();
    drawBackground();
    triArray.forEach(function(el){
      el.update();
    });
    plusArray.forEach(function(el){
      el.update();
    });
    circle.update();
    if(triArray.length > 15){
      for(i=0; i<3; i++){
        triArray[i].end();
      }
    }
  }
