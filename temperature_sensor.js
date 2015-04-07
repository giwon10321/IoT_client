var util = require('util'),
    events = require('events').EventEmitter;

var properTemp = 22;
var range = 5;

function TemperatureSensor(temp, type){
    if( false == (this instanceof TemperatureSensor)){
        new TemperatureSensor();
    }
    this.temp = temp;
    this.type = type;
    this.state = 'normal';
    events.call(this);
}

util.inherits(TemperatureSensor, events);

TemperatureSensor.prototype.start = function(){
    var self = this;

    setInterval(function(){
        if(self.temp >= properTemp + range){ //max
            console.log('change to cooling');
            self.state = 'cooling';
        }else if(self.temp <= properTemp - range){ //min
            console.log('change to heating');
            self.state = 'heating';
        }else if(self.temp == properTemp){
            console.log('change to normal');
            self.state = 'normal';
        }

        if(self.state == 'normal'){
            self.temp = self.temp + self.type;
        }else if(self.state == 'cooling'){
            self.temp--;
        }else if(self.state == 'heating'){
            self.temp++;
        }

        var values = {
            measuredDate: new Date(),
            value: self.temp
        };
        self.emit('measure', values);
    }, 3000);
};

module.exports = TemperatureSensor;
