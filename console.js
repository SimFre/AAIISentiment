
import aaiilib from "./aaiilib.js";

const chromePath = process.env.CHROME_PATH;
//const chromePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseurl = "https://www.aaii.com/sentimentsurvey/sent_results";

const aaii = new aaiilib(baseurl);
aaii.chromePath = chromePath;
aaii.headless = true;

await aaii.initialize();
const d = await aaii.getTableData();
aaii.close();

if (d) {
    const j = JSON.stringify(d, null, 2);
    console.log(j);
}
