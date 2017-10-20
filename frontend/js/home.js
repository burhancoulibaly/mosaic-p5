var picObjArray = new Array();
var imgObjArray = new Array();
var allImages = new Array();
var imgArray;


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
  img = loadImage("./images/"+"file000555007525.jpg");
  for (var i = 0; i < imgArray.length; i++) {
    allImages[i] = loadImage("./images/"+imgArray[i]);
  }
}

function setup(){
  console.log(img);
  w = img.width;
  h = img.height;
  pxSize = (Math.round(w/h))*20;
  canvas = createCanvas(w, h);
  canvas.position(0,0);

  for (var i = 0; i < allImages.length; i++) {
    var red = 0;
    var green = 0;
    var blue = 0;
    var alpha = 0;
    allImages[i].loadPixels();

    for (var j = 0; j < allImages[i].pixels.length; j+=4) {
      red += allImages[i].pixels[j];
      green += allImages[i].pixels[j+1];
      blue += allImages[i].pixels[j+2];
      alpha += allImages[i].pixels[j+3];
    }

    picObjArray.push(picObj = {
      image:allImages[i],
      aveRed:Math.round(red/(allImages[i].pixels.length/4)),
      aveBlue:Math.round(green/(allImages[i].pixels.length/4)),
      aveGreen:Math.round(blue/(allImages[i].pixels.length/4)),
      aveAlpha:Math.round(alpha/(allImages[i].pixels.length/4)),
    })
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

    for (var j = 0; j < picObjArray.length; j++) {
      var pixRed = imgObjArray[i].red;
      var pixGreen = imgObjArray[i].green;
      var pixBlue = imgObjArray[i].blue;
      var pixAlpha = imgObjArray[i].alpha;

      var picRed = picObjArray[j].aveRed;
      var picGreen = picObjArray[j].aveGreen;
      var picBlue = picObjArray[j].aveBlue;
      var picAlpha =  picObjArray[j].aveAlpha;

      if(pixRed > pixGreen && pixRed > pixBlue){
        if(abs(pixRed - picRed) < redDiff){
          //console.log("red1");
          if(abs(pixBlue + pixGreen - picBlue + picGreen)<secDiff){
            //console.log("red2");
            redDiff = abs(pixRed - picRed);
            secDiff = abs(pixBlue + pixGreen - picBlue + picGreen);
            picWithLowDiff = picObjArray[j].image;
          }
        }
      }else if(pixGreen > pixRed && pixGreen > pixBlue){
        if(abs(pixGreen - picGreen) < greenDiff){
          //console.log("g1");
          if(abs(pixRed + pixBlue - picBlue + picRed)<secDiff){
            //console.log("g2");
            greenDiff = abs(pixGreen - picGreen);
            secDiff = abs(pixRed + pixBlue - picBlue + picRed);
            picWithLowDiff = picObjArray[j].image;
          }
        }
      }else if(pixBlue > pixRed && pixBlue > pixGreen){
        if(abs(pixBlue - picBlue) < blueDiff){
          //console.log("b1");
          //console.log();
          if(abs(pixRed + pixGreen - picRed + picGreen)<secDiff){
            //console.log("b2");
            blueDiff = abs(pixBlue - picBlue);
            secDiff = abs(pixRed + pixGreen - picRed + picGreen);
            picWithLowDiff = picObjArray[j].image;
          }
        }
      }else if(Math.sqrt(Math.pow((pixRed - picRed),2) + Math.pow((pixGreen - picGreen),2) + Math.pow((pixBlue - picBlue),2) + Math.pow((pixAlpha - picAlpha),2)) < secDiff){
        console.log(pixRed,pixGreen,pixBlue);
        secDiff = abs(pixRed - picRed) + abs(pixGreen - picGreen) + abs(pixBlue - picBlue) + (pixAlpha - picAlpha);
        picWithLowDiff = picObjArray[j].image;
      }
    }
    //console.log(picWithLowDiff);
    image(picWithLowDiff,imgObjArray[i].x,imgObjArray[i].y,pxSize,pxSize);
  }
}
