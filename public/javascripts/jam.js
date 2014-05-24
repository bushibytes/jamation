$(function() {
	$("#owl-example").owlCarousel({singleItem:true});
	
	var socket;
	var isAccelActive;
	var isDebouncing = false;
	var debouncer;

	var x = 0, y = 0, z=0;

  var instrument = 'kick'

	function init() {
		$("#hhat").on('click', function() { instrument = 'hhat'; jam() });
		$("#kick").on('click', function() { instrument = 'kick'; jam() });
		$("#snare").on('click', function() { instrument = 'snare'; jam()});
		$("#loop1").on('click', function() { instrument = 'loop1'; jam()});
		$("#loop2").on('click', function() { instrument = 'loop2'; jam()});
		$("#connect").unbind().on('click', connect);

		initAccel();
	}

	function connect() {
		var server = $("#server").val();
		console.log("connecting to " + server)
		socket = io.connect(server);

		socket.on('connect', function() {
			console.log('connected');
			$("#connector").slideUp()
			$("#instruments").slideDown();
			isAccelActive = true
		})

		socket.on('disconnect', function () {
			isAccelActive = false
   			console.log('client disconnected');
			$("#connector").slideDown()
			$("#instruments").slideUp();
		});

		socket.on('debug', function (data) {
   			console.log('debug: ' + data);
		});
	}


  accelCalculation = function(e) {
      e.preventDefault(); //disable shake undo

      x = e.acceleration.x;
      y = e.acceleration.y;
      z = e.acceleration.z;

      /*if ( e.rotationRate ) {
        document.getElementById("rotationAlpha").innerHTML = e.rotationRate.alpha;
        document.getElementById("rotationBeta").innerHTML = e.rotationRate.beta;
        document.getElementById("rotationGamma").innerHTML = e.rotationRate.gamma;
      }*/		

      var absol = Math.sqrt(x*x + y*y + z*z);
      
      if (absol > 5) {
        console.log(absol);
      }
    }

	debouncedMessage = $.debounce( 250, accelCalculation)

	function initAccel() {		
		if (window.DeviceMotionEvent != undefined) {
			window.ondevicemotion = debouncedMessage
		} 
	}

function log_foo() {
	console.log("foo");
}

function sendAccel(x, y, z, absol) {
  if (isAccelActive) {
    //$("#accel").text(absol);
    var accelObj = { "accel" : { "x":x, "y":y, "z":z , "abs": absol} }
    //socket.emit('audio', accelObj);
    console.log("sent accel " + accelObj)
  }
}

function jam() {
  socket.emit('audio', { "instrument": instrument });
  console.log("sent audio " + instrument)
}

init(); 

}
)



