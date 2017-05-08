import { ClientPage } from './client-page.po';
import { browser, element, by } from 'protractor';

describe('Navigation.', () => {

    let page = new ClientPage();

    it('Switch from login to register', () => {
        browser.get('');
        page.expectOnPage('Login');
        page.clickOnLink('Sign up now !');
        page.expectOnPage('Register');
        page.clickOnLink('Sign in !');
        page.expectOnPage('Login');
    });

    it('Browses between pages', () => {

        page.login('test0', 'test');
        page.expectOnPage('Games');

        page.deployNav();
        page.goToGames();
        page.expectOnPage('Games');

        page.deployNav();
        page.goToProfile();
        page.expectOnPage('Profile');

        page.clickOnLink('Change password');
        page.expectOnPage('New password');

        page.clickOnLink('Back to your profile');
        page.expectOnPage('Profile');

        page.clickOnLink('Delete your account');
        page.expectOnPage('Delete your account');

        page.clickOnLink('Back to your profile');
        page.expectOnPage('Profile');

        page.logout();


    });


});