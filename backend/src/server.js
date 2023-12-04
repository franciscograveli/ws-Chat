const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });


wss.on("connection", (client) => {
    client.on("error", console.error);

    client.on("message", (data) => {
        wss.clients.forEach(element => {
            element.send(data.toString());
        });
    });

    
});
