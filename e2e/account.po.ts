import { browser, element, by } from 'protractor';

export class ClientPage {

    navigateTo(url: string) {
        return browser.get(url);
    }

    getSelectorText(selector: string) {
        return element(by.css(selector)).getText();
    }

}
