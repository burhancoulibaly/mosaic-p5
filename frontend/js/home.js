var picObjArray = new Array();
var imgObjArray = new Object;
var allImgColArr = new Array();
var imgColArr = new Array();
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
  img = loadImage("./images/"+"CIMG0017.JPG");
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
    colArray = null;
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

      r = Math.round(red/(allImages[i].pixels.length/4));
      b = Math.round(green/(allImages[i].pixels.length/4));
      g = Math.round(blue/(allImages[i].pixels.length/4));

      
    }
    var rgbInt = getRGBInt(r,g,b);

    allImgColArr.push(rgbInt);

    if(imgObjArray[rgbInt] != undefined){
      imgObjArray[rgbInt].push(r,g,b,allImages[i]);
    }else{
      imgObjArray[rgbInt] = new Array(r,g,b,allImages[i]);
    }
    

  }
  allImgColArr.sort(function(a,b){return a-b});
  console.log(allImgColArr);
  console.log(imgObjArray);
}

function draw(){
  noStroke();
  img.loadPixels();
  for (var i = 0; i < w; i+=pxSize) {
    for (var j = 0; j < h; j+=pxSize) {
      var index = 4 * (i + (j * w));
      x = i;
      y = j;
      r = img.pixels[index];
      g = img.pixels[index + 1];
      b = img.pixels[index + 2];
      
      var rgbInt = getRGBInt(r,g,b);

      imgColArr.push(new Array(rgbInt,r,g,b,i,j));

    }
  }
  console.log(imgColArr);
  drawMosaic();
  // console.log(img);
  // console.log(pixCount);
  noLoop();
}

function getRGBInt(r,g,b){
  return ((65536 * r)+(256*g)+b)
  
}

function binaryIndexOf(searchElement) {
  

  var minIndex = 0;
  var maxIndex = allImgColArr.length - 1;
  var currentIndex;
  var currentElement;

  while (minIndex <= maxIndex) {
    currentIndex = (minIndex + maxIndex) / 2 | 0;
    currentElement = allImgColArr[currentIndex];

    if(minIndex == currentIndex){
      return currentElement;
    }else if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
    }else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
    }else {
        return currentElement;
    }
  }

  return -1;
}

function drawMosaic(){
  //console.log(picObjArray);
  //console.log(imgObjArray);

  for (var i = 0; i < imgColArr.length; i++) {
    // var redDiff = 255;
    // var greenDiff = 255;
    // var blueDiff = 255;
    // var secDiff = 255;
    // var picWithLowDiff;
       var picLowDiff;
       var lowDiff = 255;

    // for (var j = 0; j < allImgColArr.length; j++) {
      // var pixLAB = rgb2lab([imgObjArray[i].red,imgObjArray[i].green,imgObjArray[i].blue]);
      // var picLAB = rgb2lab([picObjArray[j].aveRed,picObjArray[j].aveGreen,picObjArray[j].aveBlue]);
      
      // console.log(deltaE(picLAB,pixLAB));
      // if(deltaE(picLAB,pixLAB) < secDiff){
      //   //console.log("yo");
      //   secDiff = deltaE(picLAB, pixLAB);
      //   picWithLowDiff = picObjArray[j].image;
      // }
      console.log(i);
      console.log(imgColArr[i][0]);
      var rgbIntMatch = binaryIndexOf(imgColArr[i][0]);
      console.log(rgbIntMatch);
      var color = imgObjArray[rgbIntMatch];
  
      if(color.length > 4){

        for(var match = 0; match <color.length; match+=4){
          var imgsLAB = rgb2lab([color[match],color[match+2],color[match+3]]);
          var imgLAB = rgb2lab([imgColArr[i][1],imgColArr[i][2],imgColArr[i][3]]);

          if(deltaE(imgLAB,imgsLAB) < lowDiff){
            lowDiff = deltaE(picLAB, pixLAB);
            picLowDiff = color[3];
            console.log(picLowDiff);
          }
        }
      }else{
        picLowDiff = color[3];
      }
    // }
    //   //console.log(picWithLowDiff);
  //   pixCount += 1;
   image(picLowDiff,imgColArr[i][4],imgColArr[i][5],pxSize,pxSize);
  }
}
