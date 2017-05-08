import { ClientPage } from './client-page.po';
import { browser, element, by } from 'protractor';

describe('Games listing, and game page.', () => {

    let page = new ClientPage();

    beforeEach(() => {

    });

    afterEach(() => {

    });

    it('I can create a game versus computer', () => {
        page.login('test0', 'test');
        page.expectOnPage('Games');
        page.clickOnLink('Create a game');
        page.expectOnPage('Game creation');
        page.clickOnLink('Play versus computer');

    });




});