var picObjArray = new Array();
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
  img = loadImage("./images/"+"file2961261953471.jpg");
  for (var i = 0; i < imgArray.length; i++) {
    allImages[i] = loadImage("./images/"+imgArray[i]);
  }
}

function setup(){
  //console.log(img);
  w = img.width;
  h = img.height;
  var maxW = 2400;
  var maxH = 2400;
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

    for (var j = 0; j < picObjArray.length; j++) {
      var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
      var picLAB = rgb2lab([picObjArray[j].aveRed,picObjArray[j].aveGreen,picObjArray[j].aveBlue]);

      //console.log(deltaE(picLAB,pixLAB));
      if(deltaE(picLAB,pixLAB) < secDiff){
        //console.log("yo");
        secDiff = deltaE(picLAB, pixLAB);
        picWithLowDiff = picObjArray[j].image;
      }
    }
    //console.log(picWithLowDiff);
    pixCount += 1;
    image(picWithLowDiff,imgObjArray[i].x,imgObjArray[i].y,pxSize,pxSize);
  }
}
