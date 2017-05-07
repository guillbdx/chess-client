import { ClientPage } from './client-page.po';
import { browser, element, by } from 'protractor';

describe('User general features : register, login, change password, retrieving profile, remove account.', () => {

    let page = new ClientPage();

    let testUsername = page.generateRandomUsername();

    beforeEach(() => {
        browser.get('');
    });

    /*-------------------------------------------------------------------*/
    /* LOGIN AND LOGOUT */
    /*-------------------------------------------------------------------*/

    it("Login with wrong credentials", () => {
        page.fillForm({
            username: 'test0',
            password: 'xxx'
        });
        page.clickOnButton('Login');
        page.expectErrorMessage('Wrong credentials');
    });

    it("Login with valid credentials then logout", () => {
        page.fillForm({
            username: 'test0',
            password: 'test'
        });
        page.clickOnButton('Login');
        page.expectOnPage('Games');

        page.deployNav();
        page.clickOnLogout();
        page.expectOnPage('Login');

    });

    /*-------------------------------------------------------------------*/
    /* REGISTRATION */
    /*-------------------------------------------------------------------*/

    it("Register with a wrong email", () => {
        page.clickOnLink('Sign up now !');
        page.fillForm({
            username: 'xxx',
            email: 'yyy',
            password: 'zzz'
        });
        page.expectSubmitButtonIsDisabled('Register');
    });

    it("Register with an email already in use", () => {
        page.clickOnLink('Sign up now !');
        page.fillForm({
            username: 'test0',
            email: 'test0@test.com',
            password: 'test'
        });
        page.clickOnButton('Register');
        page.expectErrorMessage('Username : This value is already used.');
    });

    it("Register with valid credentials", () => {
        page.clickOnLink('Sign up now !');

        page.fillForm({
            username: testUsername,
            email: testUsername + '@test.com',
            password: 'test'
        });
        page.clickOnButton('Register');
    });

    /*-------------------------------------------------------------------*/
    /* PROFILE AND CHANGE PASSWORD */
    /*-------------------------------------------------------------------*/

    it("Login with valid credentials and retrieve my profile and change my password.", () => {
        page.fillForm({
            username: testUsername,
            password: 'test'
        });
        page.clickOnButton('Login');
        page.expectOnPage('Games');
        page.deployNav();
        page.goToProfile();
        page.expectOnPage('Profile');
        page.clickOnLink('Change password');
        page.expectOnPage('New password');
        page.fillForm({
            password: 'myNewPassword'
        });
        page.clickOnButton('Change');
        page.expectOnPage('Profile');
        page.deployNav();
        page.clickOnLogout();
        page.expectOnPage('Login');
    });

    it('Login with previous credentials', () => {
        page.fillForm({
            username: testUsername,
            password: 'test'
        });
        page.clickOnButton('Login');
        page.expectErrorMessage('Wrong credentials');
    });

    it('Login with new credentials', () => {
        page.fillForm({
            username: testUsername,
            password: 'myNewPassword'
        });
        page.clickOnButton('Login');
        page.expectOnPage('Games');
    });

});