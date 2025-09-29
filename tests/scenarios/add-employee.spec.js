// tests/scenarios/add-employee.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page.js';
import { BenefitsDashboardPage } from '../../pages/benefits-dashboard-page.js';
import { testEmployees } from '../fixtures/test-data.js';
import { invalidEmployees } from '../fixtures/test-data.js';


test.describe('Add Employee Scenario', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new BenefitsDashboardPage(page);

    await loginPage.login();
    await dashboardPage.navigateToDashboard();
  });

  test('should add employee with correct benefit calculations', async () => {
  const employee = testEmployees.validEmployee;

  await dashboardPage.openAddEmployeeModal();
  await dashboardPage.fillEmployeeDetails(employee);
  await dashboardPage.saveEmployee(employee);
  

  await dashboardPage.verifyEmployeeCalculations(employee);
});

 test('Validate that an employee cannot be saved when the fields exceed the established restrictions', async () => {
  const employee = invalidEmployees.extendedEmployee;

  await dashboardPage.openAddEmployeeModal();
  await dashboardPage.fillEmployeeDetails(employee);
   const employe  = await dashboardPage.saveEmployee(employee);

  expect(employe).toBe(false);

});

test('should validate employee with no dependants', async () => {
  const employee = testEmployees.employeeWithNoDependants;

  await dashboardPage.openAddEmployeeModal();
  await dashboardPage.fillEmployeeDetails(employee);
  await dashboardPage.saveEmployee(employee);

  await dashboardPage.verifyEmployeeCalculations(employee);
});



test('should handle employee with many dependants', async () => {
  const employee = testEmployees.employeeWithManyDependants;

  await dashboardPage.openAddEmployeeModal();
  await dashboardPage.fillEmployeeDetails(employee);
  await dashboardPage.saveEmployee(employee);

  await dashboardPage.verifyEmployeeCalculations(employee);
});

test('should handle employee with wrong dependants input (less than 0)', async () => {
  const employee = testEmployees.employeeWithInvalidDependants;

  await dashboardPage.openAddEmployeeModal();
  await dashboardPage.fillEmployeeDetails(employee);
  
  const employe  = await dashboardPage.saveEmployee(employee);

  expect(employe).toBe(false); 
});

});

  