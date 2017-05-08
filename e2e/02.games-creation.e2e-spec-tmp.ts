import { ClientPage } from './client-page.po';
import { browser, element, by } from 'protractor';

describe('Games listing, and game page.', () => {

    let page = new ClientPage();

    page.register('e2e0', 'e2e0@test.com', 'e2e');

    beforeEach(() => {

    });

    afterEach(() => {

    });

    it('I can create a game versus computer', () => {
        page.login('e2e0', 'e2e');
        page.expectOnPage('Games');
        page.expectListNotHasItems('games-in-progress');
        page.clickOnLink('Create a game');
        page.expectOnPage('Game creation');
        page.clickOnButton('Play versus computer');
        let colorSelect = element(by.id('colorVsComputer'));
        expect(colorSelect.isDisplayed()).toBeTruthy();
        let optionWhite = element(by.id('colorVsComputerWhite'));
        optionWhite.click();
        page.clickOnButton('Start');
        page.expectOnPage('Game');
        page.clickOnLink('Back to your games');
        page.expectOnPage('Games');
        page.expectListHasItems('games-in-progress');
    });

    it('I can create a game versus another user', () => {
        page.expectOnPage('Games');
        page.expectListNotHasItems('games-proposed-to-others');
        page.clickOnLink('Create a game');
        page.expectOnPage('Game creation');
        page.clickOnButton('Play versus another user');

        let colorSelect = element(by.id('colorVsUser'));
        expect(colorSelect.isDisplayed()).toBeTruthy();
        let optionWhite = element(by.id('colorVsUserWhite'));
        optionWhite.click();

        let opponentSelect = element(by.id('opponent'));
        expect(opponentSelect.isDisplayed()).toBeTruthy();
        let option = opponentSelect.element(by.css('option'));
        expect(option.isPresent()).toBeTruthy();
        option.click();

        page.clickOnButton('Create');
        page.expectOnPage('Games');
        page.expectListHasItems('games-proposed-to-others');

    });

    it('Delete account', () => {
        page.deleteAccount();
    })




});