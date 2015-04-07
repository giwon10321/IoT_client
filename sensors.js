var firmata = require('firmata'),
	util = require('util'),
	events = require('events').EventEmitter;

var board;

function Sensors(){
	if( false == (this instanceof Sensors)){
		new Sensors();
	}
	
	events.call(this);
}

util.inherits(Sensors, events);

Sensors.prototype.start = function(){
	var self = this;
	self.board = new firmata.Board("/dev/ttyATH0", function(err){
		if(err){
			console.log(err);
			board.reset();
			return ;
		}
		console.log("board is connected");
		self.emit('ready', null);
	});
};

Sensors.prototype.measure = function(){
	var self = this;
	self.board.analogRead(0, function(data){
		var voltage = data * parseInt(5000/1024);
		var temperature = (voltage - 500)/10;
		var values = {
			"measuredDate": new Date(),
			"value": parseInt(temperature)
		};
		self.emit('measure', values);
	});
}

module.exports = Sensors;
