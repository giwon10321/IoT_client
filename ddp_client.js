var DDPClient = require("ddp");

var ddpclient = new DDPClient({
    host: "localhost",
    port: 3000,
    ssl: false,
    autoReconnect: true,
    autoReconnectTimer: 500,
    maintainCollections: true,
    ddpVersion: "1",
    useSockJs: true
});

ddpclient.connect(function(err, wasReconnect){
    console.log("before connect");
    if(err){
        console.log("DDP connection error");
    }

    if(wasReconnect){
        console.log("reestablishment of a connection");
    }
    console.log("connected");
});

ddpclient.on("message", function(msg){
    console.log("ddp message: " + msg);
});
