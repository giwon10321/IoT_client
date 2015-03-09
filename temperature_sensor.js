var util = require('util'),
    events = require('events').EventEmitter;

function TemperatureSensor(){
    if( false == (this instanceof TemperatureSensor)){
        new TemperatureSensor();
    }
    events.call(this);
}

util.inherits(TemperatureSensor, events);

TemperatureSensor.prototype.start = function(){
    var self = this;
    var currentTemp = 30;

    setInterval(function(){
        currentTemp--;
        var values = {
            "measuredDate": new Date(),
            "value": currentTemp
        }
        self.emit('measure', values);
    }, 3000);
};

module.exports = TemperatureSensor;