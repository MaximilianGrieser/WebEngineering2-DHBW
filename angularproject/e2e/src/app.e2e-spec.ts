import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import {HttpClient} from "@angular/common/http";
import {async, fakeAsync, waitForAsync} from "@angular/core/testing";

describe('workspace-project App', () => {
  let page: AppPage;
 // modules installieren
  beforeEach(() => {
    page = new AppPage();
  });

  it('login with correct credentials, should go to grid page(calendar view)', function () {
    return page.navigateTo().then(value => {
      return element(by.id('fuserid')).sendKeys('miri').then(() => {
        return element(by.id('fpassword')).sendKeys('blub').then(() => {
          return element(by.id('flogin')).click().then(() => {
            browser.waitForAngular();
            return browser.getCurrentUrl().then((url) => {
              console.log(url);
              return expect<any>(browser.getCurrentUrl()).toEqual('http://localhost:4200/grid');
            });
          });
        });
      });
    });
  });

  it('login with wrong credentials, should stay at login page', function () {
    return page.navigateTo().then(value => {
      return element(by.id('fuserid')).sendKeys('miri').then(() => {
        return element(by.id('fpassword')).sendKeys('sefdfg').then(() => {
          return element(by.id('flogin')).click().then(() => {
            browser.waitForAngular();
            return browser.getCurrentUrl().then((url) => {
              console.log(url);
              return expect<any>(browser.getCurrentUrl()).toEqual('http://localhost:4200/login');
            });
          });
        });
      });
    });
  });
});
