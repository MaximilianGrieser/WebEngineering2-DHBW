import { browser, by, element } from 'protractor';

export class AppPage {
  private credentials = {
    username: 'miri',
    password: 'test'
  };

  navigateTo() {
    return browser.get('/login');
  }

  fillCredentials(credentials: any = this.credentials) {
    element(by.id('fuserid')).sendKeys(credentials.username);
    element(by.id('fpassword')).sendKeys(credentials.password);
    element(by.id('flogin')).click();
  }

  getPageTitleText() {
    return element(by.css('h1')).getText();
  }

  getErrorMessage() {
    return element(by.css('.alert-danger')).getText();
  }
}
