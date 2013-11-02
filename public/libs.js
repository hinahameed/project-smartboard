/**
 * Initialises a Canvas and binds event handlers.
 * @param {type} selector
 * @returns {DrawingBoard}
 */
DrawingBoard = function(selector) {

    var canvas = $(selector)[0];
    canvas.width = $(canvas).width();
    canvas.height = $(canvas).height();
    var context = canvas.getContext('2d');
    var renderer = new StrokeRenderer();
    var isDown = false;
	
    //*****************************************************************************
	var gco = context.globalCompositeOperation;
	var color = 'black';
	var width = 8;
	var pen = true;
	context.lineWidth = width;
	context.strokeStyle = color;
	context.lineJoin = 'round';
	context.lineCap = 'round';
	
	this.wholecanvas=function()
	{
		return canvas.toDataURL("image/png");
	}
	// Send button function
	this.sendimage=function(lecture, slide) {
		//var dataUrl = canvas.toDataURL();
		//window.open(dataUrl, "toDataURL() image", "width=1000, height=700");
		// get base64 encoded png data url from Canvas
		var img_dataurl = canvas.toDataURL("image/png");
		var data = [lecture,slide,img_dataurl];
		socket.emit('savelesson', data);
		alert("Image Sent!");
	} 		
		
	// Radio Button Events
	this.check=function(c){		
		if (c==true)
		{
			pen = true;
			context.globalCompositeOperation = gco;
			context.lineWidth = width;
			context.strokeStyle = color;
		}
		else 
		{
			pen = false;
			context.globalCompositeOperation = "destination-out";
			context.strokeStyle = "rgba(0,0,0,1)";
			context.lineWidth = 20;
		}
	}
		
	//Clear Button Function
	this.clr=function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);		
	}
	
	
	this.updateColor = function(data){
		color = data;
		context.strokeStyle = color;
	};
	
	this.updateWidth = function(data){
		width = data;
		context.lineWidth = width;
	};
	
	this.getSettings = function(){
		var settings=[pen,color,width];
		return(settings);
	};
	// *********************************************************************************
	
	this.getStrokeRenderer = function() {
        return renderer;
    }

    this.getData = function() {
        return canvas.toDataURL();
    };

    this.setData = function(dataURI) {
        var imageObj = new Image();
        imageObj.onload = function() {
            context.drawImage(this, 0, 0);
        };
        imageObj.src = dataURI;
    };

    var mousePos = function(e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    $(canvas).on("mousedown", function(e) {
        isDown = true;
        renderer.add(mousePos(e));
    });
    $(canvas).on("mousemove", function(e) {
        if (isDown) {
            renderer.add(mousePos(e));
            renderer.render(context);
        }
    });
    $(canvas).on("mouseup", function(e) {
        isDown = false;
        renderer.reset();
    });
};
/**
 * Initialises a Canvas and binds event handlers.
 * @param {type} selector
 * @returns {DrawingBoard}
 */
StudentBoard = function(selector) {

    var canvas = $(selector)[0];
    canvas.width = $(canvas).width();
    canvas.height = $(canvas).height();
    var context = canvas.getContext('2d');
	var gco = context.globalCompositeOperation;
	context.lineJoin = 'round';
	context.lineCap = 'round';
	var color ;
	var width = 10 ;
    var renderer = new StrokeRenderer();
	
	this.initialSettings = function(data){ //here data is an array with
		updatePen(data[0]);                // index[0] = status of pen
		color = data[1];
		width = data[2];
		context.strokeStyle = color;	       // index[1] = color
		context.lineWidth = width;	   // index[2] = width
	
	};
	this.complete = function(data){
		var img = new Image();
		imageObj.onload = function() {
            context.drawImage(this, 0, 0);
        };
		img.src = data;
		context.drawImage(img);
	};
	this.clr=function()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);		
	}
	
	this.updateColor = function(data){
		color = data;
		context.strokeStyle = color;
	};
	
	this.updatePen = function(data){
		if (data)
		{
			context.globalCompositeOperation = gco;
			context.lineWidth = width;
			context.strokeStyle = color;
		}
		else 
		{
			context.globalCompositeOperation = "destination-out";
			context.strokeStyle = "rgba(0,0,0,1)";
			context.lineWidth = 20;
		}
	};
	
	this.updateWidth = function(data){
		width = data;
		context.lineWidth = width;
	};

    this.getStrokeRenderer = function() {
        return renderer;
    };

    this.getContext = function() {
        return context;
    };

    this.getData = function() {
        return canvas.toDataURL();
    };

    this.setData = function(dataURI) {
        var imageObj = new Image();
        imageObj.onload = function() {
            context.drawImage(this, 0, 0);
        };
        imageObj.src = dataURI;
    };
};
/**
 * Tracks strokes and renders them.
 * @returns {StrokeRenderer}
 */
StrokeRenderer = function() {

    var _data = [];
    
    var that = this;

    this.add = function(point) {
        _data.push(point);
        $(that).trigger("added", [point]);
    };

    this.render = function(context) {

        for (index = 0; index < _data.length - 1; index++) {
            context.beginPath();
            context.moveTo(_data[index].x, _data[index].y);
            context.lineTo(_data[index + 1].x, _data[index + 1].y);
            context.closePath();
            context.stroke();
        }
        //$(that).trigger("rendered"); no need to call this.
    };

    this.reset = function() {
        _data = [];
        // reset is called when stroke is complete.
        $(that).trigger("complete");
    };

};