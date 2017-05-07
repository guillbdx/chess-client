import { browser, element, by } from 'protractor';

export class ClientPage {

    clickOnLink(textLink: string) {
        let link = element(by.linkText(textLink));
        link.click();
    }

    clickOnButton(textButton: string) {
        let button = element(by.buttonText(textButton));
        button.click();
    }

    deployNav() {
        let deployNavLink = element(by.id('toggle-nav-content'));
        deployNavLink.click();
    }

    goToProfile() {
        let link = element(by.id('navProfile'));
        link.click();
    }

    clickOnLogout() {
        let link = element(by.id('logout-link'));
        link.click();
    }

    fillForm(data: Object) {
        for(let id in data) {
            let input = element(by.css('input#' + id));
            input.sendKeys(data[id]);
        }
    }

    expectSubmitButtonIsDisabled(submitButtonText: string) {
        let submitButton = element(by.buttonText(submitButtonText));
        expect(submitButton.getAttribute('disabled')).toBe('true');
    }

    expectErrorMessage(message: string) {
        let alertErrorContainer = element(by.css('.alert-danger'));
        let alertErrorContent = alertErrorContainer.getText();
        expect(alertErrorContent).toEqual(message);
    }

    expectSuccessMessage(message: string) {
        let alertSuccessContainer = element(by.css('.alert-success'));
        let alertSuccessContent = alertSuccessContainer.getText();
        expect(alertSuccessContent).toEqual(message);
    }

    expectOnPage(pageTitle: string) {
        let titleElement = element(by.css('h3'));
        let title = titleElement.getText();
        expect(title).toEqual(pageTitle);
    }

    generateRandomUsername() {
        let username = "e2e-test-";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( let i=0; i < 5; i++ )
            username += possible.charAt(Math.floor(Math.random() * possible.length));
        return username;
    }

}
