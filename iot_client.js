var DDPClient = require("ddp"),
    config = require("./config"),
	sensors = require("./sensors"),
    tempSensor = require("./temperature_sensor"),
    humiSensor = require("./humidity_sensor");

var ddpConfig = config["ddpConfig"];
var userConfig = config["user"];
var deviceConfig = config["device"];

var ddpclient = new DDPClient({
    host: ddpConfig["host"],
    port: ddpConfig["port"],
    ssl: ddpConfig["ssl"],
    autoReconnect: ddpConfig["autoReconnect"],
    autoReconnectTimer: ddpConfig["autoReconnectTimer"],
    maintainCollections: ddpConfig["maintainCollections"],
    ddpVersion: ddpConfig["ddpVersion"],
    useSockJs: ddpConfig["useSockJs"]
});

var tempsensor = new tempSensor(30, -1);
var humisensor = new humiSensor();
var sensors = new sensors();

ddpclient.connect(function(err, wasReconnect){
    if(err){
        console.log("DDP connection error");
    }

    if(wasReconnect){
        console.log("reestablishment of a connection");
    }

    console.log("connected to server");
    ddpclient.call('login',[
        {user: {username: userConfig["username"]}, password: userConfig["password"]}
    ] ,function(err,result){
        if(err){
            console.error(err);
        }
        if(result) {
            console.log(result);
			sensors.start();
        }
    });
});
sensors.on("ready", function(value){
	sensors.measure();
});
sensors.on("measure", function(values){
	values.deviceToken = deviceConfig["deviceToken"];
	ddpclient.call('insertTemp', [values], function(err, result){
		if(err){
			console.error(err);
		}
		if(result){
			console.log("temp result: "+result);
		}
	}, function(){

	});
});
