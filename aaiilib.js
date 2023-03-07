
import puppeteer from "puppeteer";

export default class {
    constructor(baseurl) {
        this.baseurl = baseurl;
        this.browser = null;
        this.page = null;
        this.chromePath;
        this.headless = true;
        this.dataset = [];
        this.headers = ["reportDate", "bullish", "neutral", "bearish"];
    }

    async initialize() {
        const params = {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: this.headless,
            defaultViewport: {
                width: 1280,
                height: 800,
            }
        };
        if (this.chromePath)
            params.executablePath = this.chromePath;

        this.browser = await puppeteer.launch(params);
        this.page = await this.browser.newPage();
    }

    async getTableData() {
        const dateObject = new Date();
        dateObject.setUTCHours(0);
        dateObject.setUTCMinutes(0);
        dateObject.setUTCMinutes(0);
        dateObject.setUTCMilliseconds(0);
        const year = dateObject.getUTCFullYear();

        try {
            const response = await this.page.goto(this.baseurl);
            await this.page.waitForSelector('.sentimentsurvey tbody');
            const rows = await this.page.$$('.sentimentsurvey table:first-of-type tbody tr');
            const rowData = rows.map(async (rowObject, rowIndex) => {
                const cells = await rowObject.$$('td');
                const cellData = cells.map(async (cellObject, cellIndex) => {
                    const text = await (await cellObject.getProperty('textContent')).jsonValue();
                    const record = { r: rowIndex, c: cellIndex, value: text.trim() };
                    return record;
                });
                const cellSet = await Promise.all(cellData);
                let rd = new Date(year + " " + cellSet[0].value);
                rd.setUTCHours(0);
                rd.setUTCMinutes(0);
                rd.setUTCMinutes(0);
                rd.setUTCMilliseconds(0);
                if (rd > dateObject) {
                    rd.setUTCFullYear(rd.getUTCFullYear() - 1);
                }
                return {
                    "reportDate": rd,
                    "bullish": cellSet[1].value,
                    "neutral": cellSet[2].value,
                    "bearish": cellSet[3].value
                }
            });
            const tableData = await Promise.all(rowData);
            tableData.shift();
            return tableData;
        } catch (err) {
            console.error("ERROR", err.message);
            return false;
        }
    }

    close() {
        this.browser?.close();
    }
}
