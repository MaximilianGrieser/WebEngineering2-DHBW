import { AppPage } from './app.po';
import {browser, by, element, logging} from 'protractor';
import {HttpClient} from "@angular/common/http";
import {async, fakeAsync, waitForAsync} from "@angular/core/testing";

describe('workspace-project App', () => {
  let page: AppPage;
  beforeEach(() => {
    page = new AppPage();
  });

  it('login with correct credentials, should go to grid page(calendar view)', function () {
    return page.navigateTo().then(value => {
      return element(by.id('fuserid')).sendKeys('admin').then(() => {
        return element(by.id('fpassword')).sendKeys('pw').then(() => {
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
      return element(by.id('fuserid')).sendKeys('admin').then(() => {
        return element(by.id('fpassword')).sendKeys('wrongpw').then(() => {
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
