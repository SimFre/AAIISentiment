
import puppeteer from "puppeteer";

export default class {
    constructor(baseurl) {
        this.baseurl = baseurl;
        this.browser = null;
        this.page = null;
        this.chromePath;
        this.headless = true;
    }

    async initialize() {
        const params = {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: this.headless,
            defaultViewport: {
                width: 1024,
                height: 768,
            }
        };
        if (this.chromePath)
            params.executablePath = this.chromePath;

        this.browser = await puppeteer.launch(params);
        this.page = await this.browser.newPage();
    }

    async getData() {
        // Open the page
        await this.page.goto(this.baseurl + "/sentimentsurvey/sent_results");
        await this.page.waitForSelector('.sentimentsurvey tbody');
        const rows = await this.page.$$('.sentimentsurvey tbody tr');
        console.log("Reading rows");
        rows.map(async (o, i) => {
          const cells = rows.$$('td');
          console.log("Cells on row", i, o);
        });
        console.log("Done");
    }

    close() {
        this.browser?.close();
    }
}
