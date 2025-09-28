import { url } from "inspector";
import path from "path";

// pages/base-page.js
export class BasePage {
  constructor(page) {
    this.page = page;
    
  }

  async navigateTo() {
    try {
      await this.page.goto('/Prod');
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch (error) {
      await this.captureFailure(`navigation-to-${url}`);
      throw error;
    }
  }

  async waitForElement(selector, options = { timeout: 20000 }) {
  try {
    // Espera que el elemento sea visible
    await this.page.waitForSelector(selector, { state: 'visible', ...options });
    // Devuelve un locator, más robusto que $
    return this.page.locator(selector);
  } catch (error) {
    // Captura screenshot o video en caso de falla
    await this.captureFailure(`element-not-found-${selector}`);
    throw error;
  }
}


  async fillField(selector, value) {
    try {
      await this.waitForElement(selector);
      await this.page.fill(selector, value);
    } catch (error) {
      await this.captureFailure(`fill-field-${selector}`);
      throw error;
    }
  }

  async clickElement(selector) {
    try {
      await this.waitForElement(selector);
      await this.page.click(selector);
    } catch (error) {
      await this.captureFailure(`click-element-${selector}`);
      throw error;
    }
  }

  async captureFailure(context) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `artifacts/screenshots/failure-${context}-${timestamp}.png`;
    
    await this.page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    
    console.log(`📸 Screenshot captured: ${screenshotPath}`);
  }

  async getText(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  async isElementVisible(selector) {
    try {
      await this.waitForElement(selector, 15000);
      return true;
    } catch {
      return false;
    }
  }
}
