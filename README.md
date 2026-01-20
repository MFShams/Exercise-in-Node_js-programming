Exercise-in-Node_js-programming/
├── README.md
├── package.json
├── index.js
├── file-processor.js
├── file-service.js
├── test/
│   ├── file-processor.spec.js
│   └── mocha.opts

# Node.js Event-Driven File Processor

## Description

Create a File Processor module that asynchronously processes files and emits events at different stages of processing. The processor should handle file validation, asynchronous processing, and proper error handling using Node.js EventEmitter.

## Requirements

### Class: FileProcessor
- Must extend `EventEmitter`
- Must be exported as the default export from `file-processor.js`

### Method: `processFile(filename)`
- Accepts a `filename` (string) as parameter
- Returns nothing (events handle communication)
- Must be an asynchronous method

### Event Emission

The class should emit the following events:

#### 1. `PROCESSING_STARTED`
- Emitted immediately when `processFile` is called with a valid filename
- Callback receives: `filename` (the filename being processed)

#### 2. `PROCESSING_COMPLETED`
- Emitted when file processing completes successfully
- Callback receives an object with:
  - `filename`: The processed filename
  - `size`: The file size in bytes (from service)
  - `lines`: Number of lines in the file (from service)
  - `processedAt`: Timestamp of completion

#### 3. `PROCESSING_ERROR`
- Emitted in two cases:
  - When `filename` is undefined or empty string
  - When the file service rejects with an error
- Callback receives an object with:
  - `filename`: The filename that caused the error
  - `message`: Error message
    - `'INVALID_FILENAME'` for undefined/empty filename
    - The error message from service for processing errors

### File Service
A mock file service is provided in `file-service.js` with the following method:

```javascript
// Returns a Promise that resolves with file info or rejects with error
async function getFileInfo(filename) {
  // Implementation details...
}