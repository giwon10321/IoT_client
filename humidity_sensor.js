var util = require('util'),
    events = require('events').EventEmitter;

function HumiditySensor(){
    if( false == (this instanceof HumiditySensor)){
        new HumiditySensor();
    }
    events.call(this);
}

util.inherits(HumiditySensor, events);

HumiditySensor.prototype.start = function(){
    var self = this;

    setInterval(function(){
        var values = {
            measuredDate: new Date(),
            value: parseInt(Math.random()*40 + 40)
        };
        self.emit('measure', values);
    }, 3000);
};

module.exports = HumiditySensor;