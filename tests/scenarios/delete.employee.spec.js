// tests/scenarios/delete-employee.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page.js';
import { BenefitsDashboardPage } from '../../pages/benefits-dashboard-page.js';
import { testEmployees } from '../fixtures/test-data.js';

test.describe('Delete Employee Scenario', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new BenefitsDashboardPage(page);

    await loginPage.login();
    await dashboardPage.navigateToDashboard();
  });

  test('should delete an employee', async () => {
    
    const employee = { ...testEmployees.validEmployee };

    
    await dashboardPage.openAddEmployeeModal();
    await dashboardPage.fillEmployeeDetails(employee);
    await dashboardPage.saveEmployee(employee);

    console.log(` Employee saved with ID: ${employee.id}`);

    
    await dashboardPage.verifyEmployeeCalculations(employee);

   
    await dashboardPage.deleteEmployee(employee);

    console.log(` Employee with ID ${employee.id} deleted successfully`);

    
    const rows = await dashboardPage.getEmployeeCount();
    const ids = [];
    for (let i = 0; i < rows; i++) {
      const row = dashboardPage.page.locator(dashboardPage.employeeRows).nth(i);
      const idText = await row.locator('td').nth(dashboardPage.columnIndexes.id).innerText();
      ids.push(idText.trim());
    }
    expect(ids).not.toContain(employee.id);
  });
});