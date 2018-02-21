var bluePixArray = new Array();
var redPixArray = new Array();
var greenPixArray = new Array();
var greyPixArray = new Array();
var lbPixArray = new Array();
var yelPixArray = new Array();
var violPixArray = new Array();
var imgObjArray = new Array();
var allImages = new Array();
var imgArray;
var pixCount = 0;


window.onload = function(){
  $.ajax({
    type: 'GET',
    async:false,
    url:"http://localhost:3000/getimages",
    success:function(data){
      imgArray = data;
      console.log('success',data);
    }
  });
}

function preload() {
  img = loadImage("./images/"+"jorja_smith_js_241016.jpg");
  for (var i = 0; i < imgArray.length; i++) {
    allImages[i] = loadImage("./images/"+imgArray[i]);
  }
}

function setup(){
  //console.log(img);
  w = img.width;
  h = img.height;
  var maxW = 1340;
  var maxH = 1340;
  var ratio;

  if(w > maxW){
    console.log("resizing");
    ratio = maxW/w;
    img.resize(w * ratio, h * ratio);
    w = img.width;
    h = img.height;
    console.log(img.width, img.height);
  }

  if(h > maxH){
    console.log("resizing");
    ratio = maxH/h;
    img.resize(w * ratio, h * ratio);
    w = img.width;
    h = img.height;
    console.log(img.width, img.height);
  }

  pxSize = (Math.round(w/h))*10;
  canvas = createCanvas(w,h);
  canvas.position(0,0);

  for (var i = 0; i < allImages.length; i++) {
    var red = 0;
    var green = 0;
    var blue = 0;
    var alpha = 0;
    allImages[i].resize(250,250);
    allImages[i].loadPixels();

    for (var j = 0; j < allImages[i].pixels.length; j+=4) {
      red += allImages[i].pixels[j];
      green += allImages[i].pixels[j+1];
      blue += allImages[i].pixels[j+2];
      alpha += allImages[i].pixels[j+3];
    }

    var aveRedC = red/(allImages[i].pixels.length/4);
    var aveBlueC = blue/(allImages[i].pixels.length/4);
    var aveGreenC = green/(allImages[i].pixels.length/4);
    var aveAlphaC = alpha/(allImages[i].pixels.length/4)

    if(aveRedC > aveBlueC && aveRedC > aveGreenC){
      redPixArray.push(picObj = {
        image:allImages[i],
        aveRed:Math.round(aveRedC),
        aveBlue:Math.round(aveBlueC),
        aveGreen:Math.round(aveGreenC),
        aveAlpha:Math.round(aveAlphaC),
      })
    }else if(aveGreenC > aveRedC && aveGreenC > aveBlueC){
      greenPixArray.push(picObj = {
        image:allImages[i],
        aveRed:Math.round(aveRedC),
        aveBlue:Math.round(aveBlueC),
        aveGreen:Math.round(aveGreenC),
        aveAlpha:Math.round(aveAlphaC),
      })
    }else if(aveBlueC > aveRedC && aveBlueC > aveGreenC){
      bluePixArray.push(picObj = {
        image:allImages[i],
        aveRed:Math.round(aveRedC),
        aveBlue:Math.round(aveBlueC),
        aveGreen:Math.round(aveGreenC),
        aveAlpha:Math.round(aveAlphaC),
      })
    }else if(aveRedC == aveGreenC && aveRedC == aveBlueC){
      greyPixArray.push(picObj = {
        image:allImages[i],
        aveRed:Math.round(aveRedC),
        aveBlue:Math.round(aveBlueC),
        aveGreen:Math.round(aveGreenC),
        aveAlpha:Math.round(aveAlphaC),
      })
    }else if(aveRedC >= Math.round(aveGreenC - (aveGreenC*0.08)) || aveRedC <= Math.round(aveGreenC + (aveGreenC*0.08))){
      yelPixArray.push(picObj = {
        image:allImages[i],
        aveRed:Math.round(aveRedC),
        aveBlue:Math.round(aveBlueC),
        aveGreen:Math.round(aveGreenC),
        aveAlpha:Math.round(aveAlphaC),
      })
    }else if(aveRedC >= Math.round(aveBlueC - (aveBlueC*0.08)) || aveRedC <= Math.round(aveBlueC + (aveBlueC*0.08))){
      violPixArray.push(picObj = {
        image:allImages[i],
        aveRed:Math.round(aveRedC),
        aveBlue:Math.round(aveBlueC),
        aveGreen:Math.round(aveGreenC),
        aveAlpha:Math.round(aveAlphaC),
      })
    }else if(aveGreenC >= Math.round(aveBlueC - (aveBlueC*0.08)) || aveGreenC <= Math.round(aveBlueC + (aveBlueC*0.08))){
      violPixArray.push(picObj = {
        image:allImages[i],
        aveRed:Math.round(aveRedC),
        aveBlue:Math.round(aveBlueC),
        aveGreen:Math.round(aveGreenC),
        aveAlpha:Math.round(aveAlphaC),
      })
    }
    
  }
}

function draw(){
  noStroke();
  img.loadPixels();
  for (var i = 0; i < w; i+=pxSize) {
    for (var j = 0; j < h; j+=pxSize) {
      var index = 4 * (i + (j * w));

      imgObjArray.push(imgPix = {
        x:i,
        y:j,
        red:img.pixels[index],
        green:img.pixels[index + 1],
        blue:img.pixels[index + 2],
        alpha:img.pixels[index + 3]
      })
    }
    drawMosaic();
  }
  console.log(img);
  console.log(pixCount);
  noLoop();
}

function drawMosaic(){
  //console.log(picObjArray);
  //console.log(imgObjArray);

  for (var i = 0; i < imgObjArray.length; i++) {
    var redDiff = 255;
    var greenDiff = 255;
    var blueDiff = 255;
    var secDiff = 255;
    var picWithLowDiff;

    

    

      if(imgObjArray[i].red > imgObjArray[i].green && imgObjArray[i].red > imgObjArray[i].blue){
        for (var j = 0; j < redPixArray.length; j++) {
          var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
          var picLAB = rgb2lab([redPixArray[j].aveRed,redPixArray[j].aveGreen,redPixArray[j].aveBlue]);

            //console.log(deltaE(picLAB,pixLAB));
          if(deltaE(picLAB,pixLAB) < secDiff){
            //console.log("yo");
            secDiff = deltaE(picLAB, pixLAB);
            picWithLowDiff = redPixArray[j].image;
          }
        }
      }else if(imgObjArray[i].green > imgObjArray[i].red && imgObjArray[i].green > imgObjArray[i].blue){
        for (var j = 0; j < greenPixArray.length; j++) {
          var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
          var picLAB = rgb2lab([greenPixArray[j].aveRed,greenPixArray[j].aveGreen,greenPixArray[j].aveBlue]);

            //console.log(deltaE(picLAB,pixLAB));
          if(deltaE(picLAB,pixLAB) < secDiff){
            //console.log("yo");
            secDiff = deltaE(picLAB, pixLAB);
            picWithLowDiff = greenPixArray[j].image;
          }
        }
      }else if(imgObjArray[i].blue > imgObjArray[i].red && imgObjArray[i].blue > imgObjArray[i].green){
        for (var j = 0; j < bluePixArray.length; j++) {
          var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
          var picLAB = rgb2lab([bluePixArray[j].aveRed,bluePixArray[j].aveGreen,bluePixArray[j].aveBlue]);

            //console.log(deltaE(picLAB,pixLAB));
          if(deltaE(picLAB,pixLAB) < secDiff){
            //console.log("yo");
            secDiff = deltaE(picLAB, pixLAB);
            picWithLowDiff = bluePixArray[j].image;
          }
        }
      }else if(imgObjArray[i].red == imgObjArray[i].green && imgObjArray[i].red == imgObjArray[i].blue){
        for (var j = 0; j < greyPixArray.length; j++) {
          var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
          var picLAB = rgb2lab([greyPixArray[j].aveRed,greyPixArray[j].aveGreen,greyPixArray[j].aveBlue]);

            //console.log(deltaE(picLAB,pixLAB));
          if(deltaE(picLAB,pixLAB) < secDiff){
            //console.log("yo");
            secDiff = deltaE(picLAB, pixLAB);
            picWithLowDiff = greyPixArray[j].image;
          }
        }
      }else if(imgObjArray[i].red >= Math.round(imgObjArray[i].green - (imgObjArray[i].green*0.08)) || imgObjArray[i].red <= Math.round(imgObjArray[i].green + (imgObjArray[i].green*0.08))){
        for (var j = 0; j < yelPixArray.length; j++) {
          var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
          var picLAB = rgb2lab([yelPixArray[j].aveRed,yelPixArray[j].aveGreen,yelPixArray[j].aveBlue]);

            //console.log(deltaE(picLAB,pixLAB));
          if(deltaE(picLAB,pixLAB) < secDiff){
            //console.log("yo");
            secDiff = deltaE(picLAB, pixLAB);
            picWithLowDiff = yelPixArray[j].image;
          }
        }
      }else if(imgObjArray[i].red >= Math.round(imgObjArray[i].blue - (imgObjArray[i].blue*0.08)) || imgObjArray[i].red <= Math.round(imgObjArray[i].blue + (imgObjArray[i].blue*0.08))){
        for (var j = 0; j < lbPixArray.length; j++) {
          var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
          var picLAB = rgb2lab([lbPixArray[j].aveRed,lbPixArray[j].aveGreen,lbPixArray[j].aveBlue]);

            //console.log(deltaE(picLAB,pixLAB));
          if(deltaE(picLAB,pixLAB) < secDiff){
            //console.log("yo");
            secDiff = deltaE(picLAB, pixLAB);
            picWithLowDiff = lbPixArray[j].image;
          }
        }
      }else if(imgObjArray[i].green >= Math.round(imgObjArray[i].blue - (imgObjArray[i].blue*0.08)) || imgObjArray[i].green <= Math.round(imgObjArray[i].blue + (imgObjArray[i].blue*0.08))){
        for (var j = 0; j < violPixArray.length; j++) {
          var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
          var picLAB = rgb2lab([violPixArray[j].aveRed,violPixArray[j].aveGreen,violPixArray[j].aveBlue]);

            //console.log(deltaE(picLAB,pixLAB));
          if(deltaE(picLAB,pixLAB) < secDiff){
            //console.log("yo");
            secDiff = deltaE(picLAB, pixLAB);
            picWithLowDiff = violPixArray[j].image;
          }
        }
      }

      
    //console.log(picWithLowDiff);
    pixCount += 1;
    image(picWithLowDiff,imgObjArray[i].x,imgObjArray[i].y,pxSize,pxSize);
  }
}
