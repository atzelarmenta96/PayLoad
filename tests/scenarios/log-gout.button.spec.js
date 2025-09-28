import { test, expect } from '@playwright/test';
import { BenefitsDashboardPage } from '../../pages/benefits-dashboard-page.js';
import { LoginPage } from '../../pages/login-page.js';


test.describe('Logout Button testing', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new BenefitsDashboardPage(page);

    await loginPage.login();
    await dashboardPage.navigateToDashboard();
  });

    test('Logout button', async () => {

        await dashboardPage.logoutButton();

    })


});

