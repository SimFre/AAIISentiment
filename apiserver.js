
import express from "express";
import aaiilib from "./aaiilib.js";

const listenport = process.env.PORT ?? 3001;
const chromePath = process.env.CHROME_PATH;
// const baseurl = process.env.APTUS_BASEURL ?? "";
const baseurl = "https://www.aaii.com/";

const aaii = new aaiilib(baseurl);
aaii.chromePath = chromePath;
aaii.headless = false;

const app = express();
app.get("/list", async (req, res) => {
    const auth = await aaii.authenticate();
    if (auth.status === true) {
        const doors = await aaii.listDoors();
        res.send(doors);
    }
    else {
        res.send(auth);
    }
});

app.get("/open/:doorId", async (req, res) => {
    const doorId = req.params.doorId;
    const auth = await aaii.authenticate();
    if (auth.status === true) {
        const jd = await aaii.unlockDoor(doorId);
        res.send(jd);
    }
    else {
        res.send(auth);
    }
});

app.listen(listenport, async () => {
    console.log(`
        App started on ${listenport}
        URL: ${baseurl}
        UN:  ${username}
        PW:  ${password}
    `);
    await aaii.initialize();
});
