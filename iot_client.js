var DDPClient = require("ddp"),
    config = require("./config"),
    tempSensor = require("./temperature_sensor");

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

ddpclient.connect(function(err, wasReconnect){
    if(err){
        console.log("DDP connection error");
    }

    if(wasReconnect){
        console.log("reestablishment of a connection");
    }

    console.log("connected");
    ddpclient.call('login',[
        {user: {username: userConfig["username"]}, password: userConfig["password"]}
    ] ,function(err,result){
        if(err){
            console.error(err);
        }
        if(result) {
            console.log(result);
            tempsensor.start();
        }
    });
});

ddpclient.on("message", function(msg){
    console.log("ddp message: " + msg);
});

tempsensor.on("measure", function(values){
    values.deviceToken = deviceConfig["deviceToken"];
    ddpclient.call('insertTemp', [values], function(err, result){
        if(err){
            console.error(err);
        }
        if(result){
            console.log("result : "+result);
        }
    }, function(){
        //console.log(ddpclient.collections.temperatures);
    });
});

