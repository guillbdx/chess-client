import { ClientPage } from './client-page.po';
import { browser, element, by } from 'protractor';

describe('Games listing, and game page.', () => {

    let page = new ClientPage();

    beforeEach(() => {
        browser.get('');
        page.fillForm({
            username: 'test0',
            password: 'test'
        });
        page.clickOnButton('Login');
    });

    it('There are some games in each category.', () => {
        page.expectListHasItems('games-in-progress');
        page.expectListHasItems('games-proposed-by-others');
        page.expectListHasItems('games-proposed-to-others');
        page.expectListHasItems('games-ended');
    })


});