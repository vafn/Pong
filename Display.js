export const Display = function(canvas) {
  this.uPx = 1;
  this.bufferCanvas = document.createElement("canvas");
  this.bufferCanvas.width = canvas.width;
  this.bufferCanvas.height = canvas.height;
  this.buffer = this.bufferCanvas.getContext("2d");
  this.buffer.imageSmoothingEnabled = false;

  /*
  this.buffer.shadowOffsetX = 15;
  this.buffer.shadowOffsetY = 5;
  this.buffer.shadowBlur = 15;
  this.buffer.shadowColor = 'rgba(255, 255, 255, 0.5)';
  */

  this.context = canvas.getContext("2d");
  this.context.imageSmoothingEnabled = false;

  this.clear = function() {
    this.buffer.fillStyle = 'black';
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    //this.context.imageSmoothingEnabled = false;
  }

  this.drawObject = function(image, source_x, source_y, destination_x, destination_y, width, height) {
    this.buffer.drawImage(image, source_x, source_y, width * this.uPx, height * this.uPx, Math.round(destination_x) * this.uPx, Math.round(destination_y) * this.uPx, width * this.uPx, height * this.uPx);
  };

  this.drawDisk = function(disk) {
    this.buffer.beginPath();
    this.buffer.arc(disk.x * this.uPx, disk.y * this.uPx, disk.radius * this.uPx, 0, 2 * Math.PI, true);
    this.buffer.closePath();
    this.buffer.lineWidth = 1;
    this.buffer.fillStyle = disk.color;
    this.buffer.fill();
  };

  this.drawBox = function(box) {
    this.buffer.fillStyle = box.color;
    this.buffer.fillRect(Math.floor(0.5 + box.x * this.uPx), Math.floor(0.5 + box.y * this.uPx), Math.floor(0.5 + box.width * this.uPx), Math.floor(0.5 + box.height * this.uPx));
  };

  this.drawText = function(text) {
    this.buffer.fillStyle = text.fillStyle;
    this.buffer.font = (text.bold ? 'bold ' : '') + text.size * this.uPx + 'px ' + text.font;
    const width = this.buffer.measureText(text.text).width;
    //this.buffer.fillText(text.text, (text.x - (text.centerAligned ? width / 2 : 0)) * this.uPx, (text.y + text.size) * this.uPx);
    this.buffer.textBaseline = 'top';
    this.buffer.fillText(text.text, (text.x - (text.centerAligned ? width / 2 : 0)) * this.uPx, text.y * this.uPx);

    /* Java
    paint = new Paint();
    paint.setColor(Color.RED);
    int fontSize = 20;
    paint.setTextSize(fontSize);
    Typeface tf = Typeface.create("FONT_NAME", Typeface.BOLD);
    paint.setTypeface(tf);
    paint.setTextAlign(Align.LEFT);
    canvas.drawText("your_text", 0, (0+paint.getTextSize()), paint);
    */
  };
};

Display.prototype = {
  constructor: Display,
  render: function() {
    this.bufferCanvas.style.imageRendering = false;
    this.context.imageSmoothingEnabled = false;
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
  }
};
