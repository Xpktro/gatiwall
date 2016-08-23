paper.install(window);
window.onload = function() {
  paper.setup('paper');

  var images = [
    {image: 'img/tricolaw.png',  prob: 1.},
    {image: 'img/tricolaw2.png', prob: .6},
    {image: 'img/tricolaw3.png', prob: .9},
    {image: 'img/gataza.png',    prob: 1.},
    {image: 'img/gataza2.png',   prob: .05}
    // {image: 'img/gataza3.png',   prob: .5}
  ];
  var finished = [];
  for(var i = 0; i < images.length; i++) {
    var imageToDraw = new Image();
    imageToDraw.crossOrigin = 'Anonymous';
    imageToDraw.src = images[i].image;
    imageToDraw.prob = images[i].prob;
    imageToDraw.onload = function() {
      finished.push({image: this, prob: this.prob});
      if(finished.length === images.length) {
        draw(finished);
      }
    }
  }
}

function draw(images) {
  images = images.map(function(img, i) {
    img.image = imageWithOutline(img.image, 'white', 15);
    img.image = imageWithOutline(img.image, 'black', 3);
    return img;
  });

  // project.clear();

  var width = view.size.width;
  var height = view.size.height;

  var background = new Path.Rectangle({
    point: [0, 0],
    size: [view.size.width, view.size.height],
    fillColor: {
      gradient: {
        stops: ['#383229', '#342B1E']
      },
      origin: [0, 0],
      destination: [0, view.size.height]
    },
  });
  background.sendToBack();

  var separation = 100;

  for (var x = 0; x <= width + separation; x += separation) {
    for (var y = 0; y <= height + separation; y += separation) {
      var raster = new Raster(randomWithProb(images).image);
      raster.position = new Point(x + random(0, 30) * random(-1, 1), y + random(0, 30) * random(-1, 1));
      raster.scale(random(0.1, 0.22));
      raster.rotate(random(0, 360));
    }
  }
}

function imageWithOutline(img, color, thickness) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d'),
      offsetArray = [
        -1, -1,
         0, -1,
         1, -1,
        -1,  0,
         1,  0,
        -1,  1,
         0,  1,
         1,  1
        ], // offset array
      x = thickness,  // final position
      y = thickness;

  canvas.width = img.width + thickness * 2;
  canvas.height = img.height + thickness * 2;

  // draw images at offsets from the array scaled by s
  for(var i = 0; i < offsetArray.length; i += 2)
    ctx.drawImage(img, x + offsetArray[i]*thickness, y + offsetArray[i+1]*thickness);

  // fill with color
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0,0,canvas.width, canvas.height);

  // draw original image in normal mode
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(img, x, y);
  return canvas;
}

function imageWithOutline2(img, color, thickness) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var deltaX = (img.width * thickness / 100);
  var deltaY = (img.height * thickness / 100);
  canvas.width = img.width + deltaX * 2;
  canvas.height = img.height + deltaY * 2;
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = 'source-in';
  context.fillStyle = color;
  context.fillRect(0,0,canvas.width, canvas.height);
  context.globalCompositeOperation = 'source-over';
  context.drawImage(img, deltaX, deltaY);
  return canvas;
}

function random(min, max) {
  return Math.random()*(max-min)+min;
}

function randomWithProb(elements) {
  // Given an array of objects with a 'prob' float will return a random element
  // for which it's prob is greater or equal than a random number (0.00 - 1.00 based).
  var limit = Math.random();
  var elements_limited = elements.filter(function(element, index) {
    return element.prob >= limit;
  });
  return elements_limited[Math.floor(Math.random() * elements_limited.length)];
}
