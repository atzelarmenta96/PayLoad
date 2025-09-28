// tests/scenarios/edit-employee.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page.js';
import { BenefitsDashboardPage } from '../../pages/benefits-dashboard-page.js';
import { testEmployees } from '../fixtures/test-data.js';

test.describe('Edit Employee Scenario', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new BenefitsDashboardPage(page);

    await loginPage.login();
    await dashboardPage.navigateToDashboard();
  });

  test('should edit employee details', async ({ page }) => {
  const originalEmployee = testEmployees.validEmployee;

  
  await dashboardPage.openAddEmployeeModal();
  await dashboardPage.fillEmployeeDetails(originalEmployee);
  await dashboardPage.saveEmployee(originalEmployee);

  
  const updatedData = {
    ...originalEmployee,
    firstName: 'UpdatedJohn',
    dependants: 3
  };

  
  const updatedRow = await dashboardPage.editEmployee(originalEmployee, updatedData);

  
  const dependantsCell = updatedRow.locator('td').nth(dashboardPage.columnIndexes.dependants);
  await expect(dependantsCell).toHaveText(updatedData.dependants.toString());

  
  const grossPay = await dashboardPage.getGrossPay(updatedRow);
  expect(grossPay).toBe(2000); 

  const benefitsCost = await dashboardPage.getBenefitsCost(updatedRow);
  const expectedBenefits = dashboardPage.calculateExpectedBenefits(updatedData.dependants);
  expect(benefitsCost).toBeCloseTo(expectedBenefits, 2);

  const netPay = await dashboardPage.getNetPay(updatedRow);
  const expectedNetPay = await dashboardPage.calculateNetPay(grossPay, updatedData.dependants);
  expect(netPay).toBeCloseTo(expectedNetPay, 2);
});

});
