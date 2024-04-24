import puppeteer from "puppeteer";

class BrowserService {

    static getBrowser() {
        return puppeteer.launch({});
    }

    static closeBrowser(browser: any) {
        if (!browser) {
            return;
        }
        return browser.close();
    }
}

module.exports = BrowserService;
