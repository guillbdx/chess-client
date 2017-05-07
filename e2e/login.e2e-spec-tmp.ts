import { ClientPage } from './login.po';
import { protractor, browser, element, by } from 'protractor';

describe('Login feature', () => {

    let page: ClientPage;

    beforeEach(() => {
        page = new ClientPage();
    });

    it('should redirect on login page when i come on root page while not logged in', () => {
        browser.get('/');
        let titleElement = element(by.css('h3'));
        let title = titleElement.getText();
        expect(titleElement.isPresent()).toBeTruthy();
        expect(title).toEqual('Login');
    });

    it('should display an error message when i try to log with wrong credentials', () => {

        browser.get('/');

        let usernameInput = element(by.css('input#username'));
        let passwordInput = element(by.css('input#password'));
        let submitButton = element(by.buttonText('Login'));

        usernameInput.sendKeys('xxx');
        passwordInput.sendKeys('yyy');
        submitButton.click();

        let alertErrorContainer = element(by.css('.alert-danger'));
        let alertErrorContent = alertErrorContainer.getText();
        expect(alertErrorContainer.isPresent()).toBeTruthy();
        expect(alertErrorContent).toEqual('Wrong credentials');

    });

    it('should drive me to Games page when i log with proper credentials', () => {
        browser.get('/');

        let usernameInput = element(by.css('input#username'));
        let passwordInput = element(by.css('input#password'));
        let submitButton = element(by.buttonText('Login'));

        usernameInput.sendKeys('test0');
        passwordInput.sendKeys('test');
        submitButton.click();

        let titleElement = element(by.css('h3'));
        let title = titleElement.getText();
        expect(titleElement.isPresent()).toBeTruthy();
        expect(title).toEqual('Games');

    });

});
