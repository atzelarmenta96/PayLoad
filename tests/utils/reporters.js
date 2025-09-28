// tests/utils/reporters/custom-reporter.js
import { Reporter } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

class CustomReporter extends Reporter {
  onBegin(config, suite) {
    console.log(`🚀 Starting test run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test) {
    console.log(`▶️  Starting test: ${test.title}`);
  }

  onTestEnd(test, result) {
    if (result.status === 'failed') {
      console.log(`❌ Test failed: ${test.title}`);
      this.captureArtifacts(test, result);
    } else if (result.status === 'passed') {
      console.log(`✅ Test passed: ${test.title}`);
    }
  }

  captureArtifacts(test, result) {
    const testName = test.title.replace(/[^a-zA-Z0-9]/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Ensure artifacts directory exists
    const artifactsDir = path.join(process.cwd(), 'artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }

    console.log(`📸 Capturing artifacts for failed test: ${test.title}`);
  }

  onEnd(result) {
    console.log(`🏁 Test run finished: ${result.status}`);
    if (result.status === 'failed') {
      console.log('🔍 Check artifacts/ directory for screenshots and videos');
    }
  }
}

export default CustomReporter;
