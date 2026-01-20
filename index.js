/**
 * Example usage of FileProcessor
 * This file demonstrates how to use the FileProcessor class
 */

const FileProcessor = require('./file-processor');

// Create processor instance
const processor = new FileProcessor();

// Set up event listeners
processor.on('PROCESSING_STARTED', (filename) => {
  console.log(`📁 [STARTED] Processing: ${filename}`);
});

processor.on('PROCESSING_COMPLETED', (result) => {
  console.log(`✅ [COMPLETED] File: ${result.filename}`);
  console.log(`   Size: ${result.size} bytes, Lines: ${result.lines}`);
  console.log(`   Processed at: ${result.processedAt}`);
  console.log('---');
});

processor.on('PROCESSING_ERROR', (error) => {
  console.log(`❌ [ERROR] File: ${error.filename}`);
  console.log(`   Message: ${error.message}`);
  console.log('---');
});

// Test cases
console.log('=== File Processor Demo ===\n');

// Valid file
processor.processFile('document.txt');

// Empty filename (should error)
processor.processFile('');

// Undefined filename (should error)
processor.processFile();

// File that causes not found error
processor.processFile('error.txt');

// File that causes permission error
processor.processFile('permission.txt');

// Another valid file
processor.processFile('script.js');

// Simulate multiple files
setTimeout(() => {
  console.log('\n=== Batch Processing ===\n');
  processor.processFile('data.json');
  processor.processFile('README.md');
  processor.processFile('config.yaml');
}, 200);