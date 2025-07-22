import {formatFileSize} from "./app/lib/utils.js";

function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  
  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`;
}

// Test cases
const testCases = [
  { size: 0, expected: '0 Bytes' },
  { size: 500, expected: '500 Bytes' },
  { size: 1023, expected: '1023 Bytes' },
  { size: 1024, expected: '1 KB' },
  { size: 1500, expected: '1.46 KB' },
  { size: 1024 * 1024, expected: '1 MB' },
  { size: 1.5 * 1024 * 1024, expected: '1.5 MB' },
  { size: 1024 * 1024 * 1024, expected: '1 GB' },
  { size: 20 * 1024 * 1024, expected: '20 MB' } // Max file size in the uploader
];

// Run tests
console.log('Testing formatFileSize function:');
console.log('--------------------------------');

let passedTests = 0;
for (const test of testCases) {
  const result = formatFileSize(test.size);
  const passed = result === test.expected;
  
  console.log(`Input: ${test.size} bytes`);
  console.log(`Expected: "${test.expected}"`);
  console.log(`Actual: "${result}"`);
  console.log(`Test ${passed ? 'PASSED' : 'FAILED'}`);
  console.log('--------------------------------');
  
  if (passed) passedTests++;
}

console.log(`Summary: ${passedTests}/${testCases.length} tests passed`);