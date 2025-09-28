import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page.js';


test.describe('Wrong login credentials', () => {
    let loginPage;
  let dashboardPage;

  test.beforeEach('Wrong credentials', async ({page}) => {
      loginPage = new LoginPage(page);
     });


     test('Get error message for wrong credentials', async () =>{

        await loginPage.wrongLogin();
       const errorMessage = await loginPage.getErrorMessage();

       await expect(errorMessage).toContainText('There were one or more problems that prevented you from logging in:');
      await expect(errorMessage).toContainText('The specified username or password is incorrect.');

     })



       test('Get error message for missing credentials', async () => {
      await loginPage.missingLogin();
      const errorMessage = await loginPage.getErrorMessage();

      await expect(errorMessage).toContainText('There were one or more problems that prevented you from logging in:');
      await expect(errorMessage).toContainText('The Username field is required.');
      await expect(errorMessage).toContainText('The Password field is required.');
       
    })

   

    test('Get error message for partial missing username credentials', async () =>{
        await loginPage.partialMissingUsername();
       const errorMessage = await loginPage.getErrorMessage();

       await expect(errorMessage).toContainText('There were one or more problems that prevented you from logging in:');
       await expect(errorMessage).toContainText('The specified username or password is incorrect.');
       
    })

    test('Get error message for partial password missing credentials', async () =>{
        await loginPage.partialMissingPassword();
       const errorMessage = await loginPage.getErrorMessage();

       await expect(errorMessage).toContainText('There were one or more problems that prevented you from logging in:');
       await expect(errorMessage).toContainText('The specified username or password is incorrect.');
    })


})

