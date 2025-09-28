// pages/benefits-dashboard-page.js
import { BasePage } from './base-page.js';
import { expect } from '@playwright/test';

export class BenefitsDashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // === Selectors ===
    this.addEmployeeButton = 'button#add';
    this.employeeTable = '#employeesTable';
    this.employeeRows = '#employeesTable tbody tr';
    this.editButton = 'i[class="fas fa-edit"]';   // <-- asegúrate que este selector existe
    this.deleteButton = 'i[class="fas fa-times"]'; // <-- asegúrate que este selector existe
    this.deleteEmploye = 'button#deleteEmployee'; 
    this.updateEmployeeButton = '#updateEmployee';
    this.modal = 'h5.modal-title';
    this.firstNameInput = 'input#firstName';
    this.lastNameInput = 'input#lastName';
    this.dependantsInput = 'input#dependants';
    this.saveEmployeeButton = 'button#addEmployee';
    this.dashboardButton = 'a[class="navbar-brand"]';
    this.logoutbutton = 'a[href="/Prod/Account/LogOut"]';
    this.logginForm = 'form[action="/Prod/Account/LogIn"]';

    // Column indexes (0-based)
    this.columnIndexes = {
      id : 0,
      firstName: 1,
      lastName: 2,
      dependants: 3,
      salary: 4,
      grossPay: 5,
      benefitsCost: 6,
      netPay: 7
    };

    this.headerIndex
  }

  async dashBoardButton(){

    await this.clickElement(this.dashboardButton);
    await this.waitForElement(this.employeeTable, { timeout: 30000 });
    await this.isElementVisible(this.employeeTable, { timeout: 30000 });
    }

    async logoutButton(){
      await this.clickElement(this.logoutbutton);
      await this.waitForElement(this.logginForm, { timeout: 15000 });
     const currentUrl = this.page.url();
     expect(currentUrl).toBe('https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/LogIn')
      
    }

    async expectedtoFail(employee){
    }
  // === Navigation & Modal ===
  async navigateToDashboard() {
    await this.navigateTo('/Prod/Benefits');
    await this.waitForElement(this.employeeTable, { timeout: 15000 });
  }

  async openAddEmployeeModal() {
    await this.clickElement(this.addEmployeeButton);
    await this.waitForElement(this.modal, { timeout: 15000 });
  }

  async fillEmployeeDetails(employeeData) {
    const { firstName, lastName, dependants = 0 } = employeeData;
    await this.fillField(this.firstNameInput, firstName);
    await this.fillField(this.lastNameInput, lastName);
    await this.fillField(this.dependantsInput, dependants.toString());
  }



  // === Save Employee with validation check ===
async saveEmployee(employee) {
  // Verifica validaciones de inputs
  const invalidData =
    employee.firstName.length > 50 ||
    employee.lastName.length > 50 ||
    employee.dependants < 0 ||
    employee.dependants > 32;

  if (invalidData) {
    console.log(
      ` Validation correctly failed: Nombre/apellido > 50 o dependants < 0 o > 32`
    );
    return false; // Retorna false si no se pudo guardar
  }

  // Si los datos son válidos, guarda normalmente
  const initialCount = await this.getEmployeeCount();
  await this.clickElement(this.saveEmployeeButton);

  // Espera que la fila nueva aparezca en la tabla
  await this.page.waitForFunction(
    ({ selector, count }) =>
      document.querySelectorAll(selector).length > count,
    { selector: this.employeeRows, count: initialCount },
    { timeout: 30000 }
  );

  // Espera a que el modal se cierre
  await this.page.locator(this.modal).first().waitFor({ state: 'hidden', timeout: 10000 });

  console.log(`Employee "${employee.firstName} ${employee.lastName}" saved successfully`);
  return true; // Retorna true si se guardó correctamente
}


  // === Row Handling by ID ===
  async getEmployeeRowById(employeeId) {
    const rows = this.page.locator(this.employeeRows);
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const idText = (await row.locator('td').nth(this.columnIndexes.id).innerText()).trim();
      if (idText === employeeId.toString()) {
        await row.waitFor({ state: 'visible', timeout: 10000 });
        return row;
      }
    }

    throw new Error(` Employee with ID ${employeeId} not found`);
  }



  // === Delete by ID ===
  async deleteEmployee(employee) {
    if (!employee.id) throw new Error('Employee ID is missing');
    const row = await this.getEmployeeRowById(employee.id);

    // Click delete icon
    await row.locator(this.deleteButton).click();

    // Confirm deletion
    const confirmButton = this.page.locator(this.deleteEmploye);
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();

    // Wait for row to be removed
    await this.page.waitForFunction(
      ({ selector, idIndex, id }) => {
        const rows = Array.from(document.querySelectorAll(selector));
        return !rows.some(row => row.querySelectorAll('td')[idIndex].innerText.trim() === id);
      },
      { selector: this.employeeRows, idIndex: this.columnIndexes.id, id: employee.id },
      { timeout: 15000 }
    );

    console.log(` Employee ID ${employee.id} deleted`);
  }

  async verifyTableHeaders() {
  // Encabezados esperados en orden
  const expectedHeaders = [
    "Id",
    "First Name",
    "Last Name",
    "Dependents",   
    "Salary",
    "Gross Pay",
    "Benefits Cost",
    "Net Pay",
    "Actions"
  ];

  const headersLocator = this.page.locator('#employeesTable thead tr th');
  const headerCount = await headersLocator.count();

  // Guardar errores encontrados
  const errors = [];

  // Soft assert: número de columnas
  await expect.soft(headerCount, `Número de columnas`).toBe(expectedHeaders.length);
  if (headerCount !== expectedHeaders.length) {
    errors.push(` Se esperaban ${expectedHeaders.length} columnas pero se encontraron ${headerCount}`);
  }

  // Verificar encabezados en orden
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (i >= headerCount) break; // evita error si hay menos columnas

    const headerText = (await headersLocator.nth(i).innerText()).trim();
    await expect.soft(headerText, `Encabezado en columna ${i + 1}`)
      .toBe(expectedHeaders[i]);

    if (headerText !== expectedHeaders[i]) {
      errors.push(
        ` Columna ${i + 1}: esperado "${expectedHeaders[i]}", encontrado "${headerText}"`
      );
    }
  }

  // Mostrar resumen si hay errores
  if (errors.length > 0) {
    console.log("\n=====  Resumen de errores en encabezados =====");
    errors.forEach(err => console.log(err));
    console.log("===============================================\n");
  } else {
    console.log(" Todos los encabezados son correctos y están en orden.");
  }
}



  

  async getEmployeeCount() {
    return await this.page.locator(this.employeeRows).count();
  }

  async getEmployeeRow(employee) {
  const rows = this.page.locator(this.employeeRows);
  const count = await rows.count();

  console.log(` Buscando empleado: ${employee.firstName} ${employee.lastName}`);
  console.log(` Número de filas en la tabla: ${count}`);

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const rowText = await row.innerText();
    console.log(` Fila ${i} (texto completo): "${rowText}"`);

    const firstName = (await row.locator('td').nth(this.columnIndexes.firstName).innerText()).trim();
    const lastName = (await row.locator('td').nth(this.columnIndexes.lastName).innerText()).trim();

    console.log(`   ↳ firstName: "${firstName}", lastName: "${lastName}"`);

    if (
      firstName.toLowerCase() === employee.firstName.toLowerCase() &&
      lastName.toLowerCase() === employee.lastName.toLowerCase()
    ) {
      console.log(` Encontrado: ${firstName} ${lastName} en fila ${i}`);
      await row.waitFor({ state: 'visible', timeout: 20000 });
      return row;
    }
  }

  throw new Error(` Employee ${employee.firstName} ${employee.lastName} not found`);
}


  async editEmployee(employee, newData) {
  //  Obtener la fila actual
  const row = await this.getEmployeeRow(employee);

  //  Clic en el botón de editar
  await row.locator(this.editButton).click();

  //  Espera a que el modal esté visible
  await this.waitForElement(this.modal, { timeout: 10000 });

  //  Rellenar datos nuevos
  await this.fillEmployeeDetails(newData);

  //  Guardar cambios
  await this.clickElement(this.updateEmployeeButton);

  //  Esperar que la fila con los nuevos datos aparezca
  await this.page.waitForFunction(
    ({ selector, firstName, lastName }) => {
      const rows = Array.from(document.querySelectorAll(selector));
      return rows.some(row => {
        const tds = row.querySelectorAll('td');
        return tds[1]?.innerText.trim() === firstName &&
               tds[2]?.innerText.trim() === lastName;
      });
    },
    { selector: this.employeeRows, firstName: newData.firstName, lastName: newData.lastName },
    { timeout: 10000 }
  );

  //  Retornar la fila actualizada
  return await this.getEmployeeRow(newData);
}


  // === Benefits & Pay Calculations ===
async getGrossPay(row) {
  const text = await row.locator('td').nth(this.columnIndexes.grossPay).innerText();
  const value = parseFloat(text.replace(/[^0-9.-]+/g, ""));
  if (isNaN(value)) throw new Error(`Gross Pay inválido: "${text}"`);
  return value;
}

async getNetPay(row) {
  const text = await row.locator('td').nth(this.columnIndexes.netPay).innerText();
  const value = parseFloat(text.replace(/[^0-9.-]+/g, ""));
  if (isNaN(value)) throw new Error(`Net Pay inválido: "${text}"`);
  return value;
}

async getBenefitsCost(row) {
  const text = await row.locator('td').nth(this.columnIndexes.benefitsCost).innerText();
  const value = parseFloat(text.replace(/[^0-9.-]+/g, ""));
  if (isNaN(value)) throw new Error(`Benefits Cost inválido: "${text}"`);
  return value;
}

calculateExpectedBenefits(dependants) {
  if (typeof dependants !== "number") throw new Error(`Dependants inválido: "${dependants}"`);
  return (1000 + 500 * dependants) / 26;
}

async calculateNetPay(grossPay, dependants) {
  if (typeof grossPay !== "number" || typeof dependants !== "number") {
    throw new Error(`calculateNetPay: grossPay o dependants no son números. grossPay=${grossPay}, dependants=${dependants}`);
  }
  const benefits = this.calculateExpectedBenefits(dependants);
  return grossPay - benefits;
}


  // === Verification ===
async verifyEmployeeCalculations(employee) {
  const row = await this.getEmployeeRow(employee);

  // Dependants
  const dependantsCell = row.locator('td').nth(this.columnIndexes.dependants);
  await expect(dependantsCell).toHaveText(employee.dependants.toString());

  // Gross Pay
  const grossPay = await this.getGrossPay(row);
  expect(grossPay).toBe(2000); // fijo según tu escenario

  // Benefits Cost
  const benefitsCost = await this.getBenefitsCost(row);
  const expectedBenefits = this.calculateExpectedBenefits(employee.dependants);
  expect(benefitsCost).toBeCloseTo(expectedBenefits, 2);

  // Net Pay
  const netPay = await this.getNetPay(row);
  const expectedNetPay = await this.calculateNetPay(grossPay, employee.dependants);
  expect(netPay).toBeCloseTo(expectedNetPay, 2);
}
   
}


