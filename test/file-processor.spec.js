/**
 * Test file for FileProcessor
 * DO NOT MODIFY THIS FILE
 */

const { expect } = require('chai');
const sinon = require('sinon');
const EventEmitter = require('events');

// Import the FileProcessor class
const FileProcessor = require('../file-processor');
const fileService = require('../file-service');

describe('FileProcessor', function() {
  let processor;
  
  beforeEach(function() {
    processor = new FileProcessor();
  });
  
  afterEach(function() {
    sinon.restore();
  });
  
  describe('Class Structure', function() {
    it('should extend EventEmitter', function() {
      expect(processor).to.be.instanceOf(EventEmitter);
    });
    
    it('should have processFile method', function() {
      expect(processor.processFile).to.be.a('function');
    });
    
    it('processFile method should be async', function() {
      const descriptor = Object.getOwnPropertyDescriptor(
        FileProcessor.prototype, 
        'processFile'
      );
      expect(descriptor.value.constructor.name).to.equal('AsyncFunction');
    });
  });
  
  describe('Event Emission', function() {
    it('should emit PROCESSING_STARTED with filename for valid input', function(done) {
      const testFilename = 'test.txt';
      let startedEmitted = false;
      
      processor.on('PROCESSING_STARTED', (filename) => {
        startedEmitted = true;
        expect(filename).to.equal(testFilename);
      });
      
      processor.on('PROCESSING_COMPLETED', () => {
        expect(startedEmitted).to.be.true;
        done();
      });
      
      processor.processFile(testFilename);
    });
    
    it('should emit PROCESSING_COMPLETED with correct data structure', function(done) {
      const testFilename = 'data.json';
      
      processor.on('PROCESSING_COMPLETED', (result) => {
        expect(result).to.be.an('object');
        expect(result).to.have.all.keys(
          'filename', 'size', 'lines', 'processedAt'
        );
        expect(result.filename).to.equal(testFilename);
        expect(result.size).to.be.a('number');
        expect(result.lines).to.be.a('number');
        expect(result.processedAt).to.be.a('string');
        done();
      });
      
      processor.processFile(testFilename);
    });
  });
  
  describe('Error Handling', function() {
    it('should emit PROCESSING_ERROR with INVALID_FILENAME for empty filename', function(done) {
      processor.on('PROCESSING_ERROR', (error) => {
        expect(error).to.be.an('object');
        expect(error.filename).to.equal('');
        expect(error.message).to.equal('INVALID_FILENAME');
        done();
      });
      
      processor.processFile('');
    });
    
    it('should emit PROCESSING_ERROR with INVALID_FILENAME for undefined filename', function(done) {
      processor.on('PROCESSING_ERROR', (error) => {
        expect(error.message).to.equal('INVALID_FILENAME');
        done();
      });
      
      processor.processFile();
    });
    
    it('should emit PROCESSING_ERROR for service rejection (error.txt)', function(done) {
      processor.on('PROCESSING_ERROR', (error) => {
        expect(error.filename).to.equal('error.txt');
        expect(error.message).to.equal('FILE_NOT_FOUND');
        done();
      });
      
      processor.processFile('error.txt');
    });
    
    it('should emit PROCESSING_ERROR for service rejection (permission.txt)', function(done) {
      processor.on('PROCESSING_ERROR', (error) => {
        expect(error.filename).to.equal('permission.txt');
        expect(error.message).to.equal('PERMISSION_DENIED');
        done();
      });
      
      processor.processFile('permission.txt');
    });
  });
  
  describe('Event Order', function() {
    it('should emit PROCESSING_STARTED before PROCESSING_COMPLETED', function(done) {
      const events = [];
      const testFilename = 'order-test.txt';
      
      processor.on('PROCESSING_STARTED', (filename) => {
        events.push({ type: 'STARTED', filename });
      });
      
      processor.on('PROCESSING_COMPLETED', (result) => {
        events.push({ type: 'COMPLETED', filename: result.filename });
        
        expect(events).to.have.lengthOf(2);
        expect(events[0].type).to.equal('STARTED');
        expect(events[1].type).to.equal('COMPLETED');
        expect(events[0].filename).to.equal(testFilename);
        expect(events[1].filename).to.equal(testFilename);
        done();
      });
      
      processor.processFile(testFilename);
    });
    
    it('should emit PROCESSING_STARTED before PROCESSING_ERROR for service errors', function(done) {
      const events = [];
      const testFilename = 'error.txt';
      
      processor.on('PROCESSING_STARTED', (filename) => {
        events.push({ type: 'STARTED', filename });
      });
      
      processor.on('PROCESSING_ERROR', (error) => {
        events.push({ type: 'ERROR', filename: error.filename });
        
        expect(events).to.have.lengthOf(2);
        expect(events[0].type).to.equal('STARTED');
        expect(events[1].type).to.equal('ERROR');
        done();
      });
      
      processor.processFile(testFilename);
    });
  });
  
  describe('Async Behavior', function() {
    it('should handle multiple concurrent file processes', function(done) {
      const results = [];
      let completedCount = 0;
      const files = ['file1.txt', 'file2.txt', 'file3.txt'];
      
      processor.on('PROCESSING_COMPLETED', (result) => {
        results.push(result.filename);
        completedCount++;
        
        if (completedCount === files.length) {
          // All files should be processed (order may vary)
          expect(results).to.have.members(files);
          done();
        }
      });
      
      files.forEach(file => processor.processFile(file));
    });
    
    it('should not block on errors', function(done) {
      const results = [];
      const errors = [];
      
      processor.on('PROCESSING_COMPLETED', (result) => {
        results.push(result.filename);
        checkCompletion();
      });
      
      processor.on('PROCESSING_ERROR', (error) => {
        errors.push(error.filename);
        checkCompletion();
      });
      
      function checkCompletion() {
        if (results.length + errors.length === 3) {
          expect(results).to.include('good.txt');
          expect(errors).to.include('error.txt');
          expect(errors).to.include('');
          done();
        }
      }
      
      processor.processFile('good.txt');
      processor.processFile('error.txt');
      processor.processFile('');
    });
  });
});