// pages/login-page.js
import { BasePage } from './base-page.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = 'input[name="Username"]';
    this.passwordInput = 'input[name="Password"]';
    this.loginButton = 'button[type="submit"]';
    this.errorMessage = 'div.text-danger.validation-summary-errors';

    this.username = "TestUser808";
    this.password = "n8hw2;Pb!5N=";
    this.wrongUsername = "TestUser855";
    this.missingUsername = "";
    this.partialmissingusername = "TestUser8";
    this.wrongPassword = "n8hw2;Pb!55=";
    this.missingPassword = "";
    this.partialmissingpassword = "n8hw2;Pb!"
    
    
  }

  async login() {
    
      await this.navigateTo('/Account/Login');
      
      await this.fillField(this.usernameInput, this.username);
      
      await this.fillField(this.passwordInput, this.password);
      await this.clickElement(this.loginButton);
         
  }

  async wrongLogin(){
    await this.navigateTo('/Account/Login');
    
    await this.fillField(this.usernameInput, this.wrongUsername);
    await this.fillField(this.passwordInput, this.wrongPassword);
    await this.clickElement(this.loginButton); 
  }



  async missingLogin(){
    await this.navigateTo('/Account/Login');

    await this.fillField(this.usernameInput, this.missingUsername);
    await this.fillField(this.passwordInput, this.missingPassword);
    await this.clickElement(this.loginButton);
  }

  async partialMissingUsername(){

    await this.navigateTo('/Account/Login');

    await this.fillField(this.usernameInput, this.partialmissingusername);
    await this.fillField(this.passwordInput, this.password);
    await this.clickElement(this.loginButton);

  }

  async partialMissingPassword(){

    await this.navigateTo('/Account/Login');

    await this.fillField(this.usernameInput, this.username);
    await this.fillField(this.passwordInput, this.partialmissingpassword);
    await this.clickElement(this.loginButton);

  }



  async getErrorMessage() {
  return this.page.locator(this.errorMessage);
  }
}
