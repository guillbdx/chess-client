import { ClientPage } from './client-page.po';
import { browser, element, by } from 'protractor';

describe('Game creation, accept and refuse.', () => {

    let page = new ClientPage();

    beforeEach(() => {

    });

    afterEach(() => {

    });

    it('Register new users', () => {
        page.register('e2e0', 'e2e0@test.com', 'e2e');
        page.register('e2e1', 'e2e1@test.com', 'e2e');
        page.register('e2e2', 'e2e2@test.com', 'e2e');
    });

    it('As e2e0, I create a game versus computer', () => {

        browser.get('');
        page.expectOnPage('Login');

        page.login('e2e0', 'e2e');
        page.expectOnPage('Games');
        page.expectListNotHasItems('games-in-progress');
        page.clickOnLink('Create a game');
        page.expectOnPage('Game creation');
        page.clickOnButton('Play versus computer');

        page.clickOnOption('colorVsComputer', 'Black');
        page.clickOnButton('Start');

        browser.pause(1000);
        page.expectOnGamePage();
        page.clickOnLink('Back to your games');
        page.expectOnPage('Games');
        page.expectListHasItems('games-in-progress');
    });

    it('As e2e0, I create a game versus user e2e1', () => {
        page.expectOnPage('Games');
        page.expectListNotHasItems('games-proposed-to-others');
        page.clickOnLink('Create a game');
        page.expectOnPage('Game creation');
        page.clickOnButton('Play versus another user');

        page.clickOnOption('colorVsUser', 'White');
        page.clickOnOption('opponent', 'e2e1');

        page.clickOnButton('Create');
        page.expectOnPage('Games');
        page.expectListHasItems('games-proposed-to-others');

    });

    it('As e2e0, I create a game versus user e2e2', () => {
        page.expectOnPage('Games');
        page.clickOnLink('Create a game');
        page.expectOnPage('Game creation');
        page.clickOnButton('Play versus another user');
        page.clickOnOption('colorVsUser', 'Black');
        page.clickOnOption('opponent', 'e2e2');
        page.clickOnButton('Create');
        page.expectOnPage('Games');
        page.logout();
    });

    it('As e2e1, I refuse the game.', () => {
        page.login('e2e1', 'e2e');
        page.expectListHasItems('games-proposed-by-others');
        page.clickOnLink('Refuse');
        page.expectListNotHasItems('games-proposed-by-others');
        page.logout();
    });

    it('As e2e2, I accept the game.', () => {
        page.login('e2e2', 'e2e');

        page.expectListNotHasItems('games-in-progress');
        page.expectListHasItems('games-proposed-by-others');

        page.clickOnLink('Accept');
        browser.pause(1000);
        page.expectOnGamePage();
        page.clickOnLink('Back to your games');
        page.expectOnPage('Games');

        page.expectListNotHasItems('games-proposed-by-others');
        page.expectListHasItems('games-in-progress');
        page.logout();
    });



    it('Delete accounts', () => {

        page.login('e2e0', 'e2e');
        page.expectOnPage('Games');
        page.deleteAccount();
        page.expectOnPage('Login');

        page.login('e2e1', 'e2e');
        page.expectOnPage('Games');
        page.deleteAccount();
        page.expectOnPage('Login');

        page.login('e2e2', 'e2e');
        page.expectOnPage('Games');
        page.deleteAccount();
        page.expectOnPage('Login');

    })




});