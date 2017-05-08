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
        expect(deployNavLink.isDisplayed()).toBeTruthy();
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

    expectListHasItems(listId: string) {
        let ul = element(by.id(listId));
        expect(ul.isPresent()).toBeTruthy();
        let lis = ul.all(by.css('li'));
        expect(lis.count()).toBeGreaterThan(0);
    }

    expectListNotHasItems(listId: string) {
        let ul = element(by.id(listId));
        expect(ul.isPresent()).toBeTruthy();
        let lis = ul.all(by.css('li'));
        expect(lis.count()).toEqual(0);
    }

    clickOnOption(selectId: string, optionText: string) {

        let opponentSelect = element(by.id(selectId));
        expect(opponentSelect.isDisplayed()).toBeTruthy();

        let options = opponentSelect.all(by.css('option'));
        expect(options.isPresent()).toBeTruthy();

        options.each((option) => {
            option.getText().then((text) => {
                if(text == optionText) {
                    option.click();
                }
            });
        });
    }

    //---------------------------------------------------
    // Shortcuts
    //---------------------------------------------------

    register(username: string, email: string, password: string) {
        browser.get('');
        this.clickOnLink('Sign up now !');
        this.fillForm({
            username: username,
            email: email,
            password: password
        });
        this.clickOnButton('Register');
    }

    login(username: string, password: string) {
        browser.get('');
        this.fillForm({
            username: username,
            password: password
        });
        this.clickOnButton('Login');
    }

    logout() {
        this.deployNav();
        this.clickOnLogout();
    }

    deleteAccount() {
        this.deployNav();
        this.goToProfile();
        this.expectOnPage('Profile');
        this.clickOnLink('Delete your account');
        this.expectOnPage('Delete your account');
        this.clickOnButton('Yes, delete my account');
    }

}
