import { ClientPage } from './client-page.po';
import { browser, element, by } from 'protractor';

describe('Games listing, and game page.', () => {

    let page = new ClientPage();

    beforeEach(() => {
        page.login('test0', 'test');
    });

    afterEach(() => {
        page.logout();
    });

    it('There are some games in each category.', () => {
        page.expectListHasItems('games-in-progress');
        page.expectListHasItems('games-proposed-by-others');
        page.expectListHasItems('games-proposed-to-others');
        page.expectListHasItems('games-ended');
    });

    it("I can click on a game in progress.", () => {
        let ul = element(by.id('games-in-progress'));
        expect(ul.isPresent()).toBeTruthy();
        let game = ul.element(by.css('li'));
        expect(game.isPresent()).toBeTruthy();
        let link = game.element(by.linkText('Play'));
        expect(link.isPresent()).toBeTruthy();
        link.click();
        page.expectOnPage('Game');

    });

    it("I can click on an ended game.", () => {
        let ul = element(by.id('games-ended'));
        expect(ul.isPresent()).toBeTruthy();
        let game = ul.element(by.css('li'));
        expect(game.isPresent()).toBeTruthy();
        let link = game.element(by.linkText('See'));
        expect(link.isPresent()).toBeTruthy();
        link.click();
        page.expectOnPage('Game');

    });


});