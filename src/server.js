const app = require("./index");

const connect = require("./configs/db");

app.listen(3500, async () => {
    await connect();
    console.log("Listening to port 3500");
});