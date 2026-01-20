/**
 * Mock file service for FileProcessor exercise
 * DO NOT MODIFY THIS FILE
 */

class FileService {
  /**
   * Simulates getting file information asynchronously
   * @param {string} filename - The name of the file to process
   * @returns {Promise<object>} Resolves with file info or rejects with error
   */
  async getFileInfo(filename) {
    return new Promise((resolve, reject) => {
      // Simulate async operation
      setTimeout(() => {
        // Special error cases
        if (filename === 'error.txt') {
          reject(new Error('FILE_NOT_FOUND'));
          return;
        }
        
        if (filename === 'permission.txt') {
          reject(new Error('PERMISSION_DENIED'));
          return;
        }
        
        // Valid file - generate random file info
        const fileInfo = {
          filename: filename,
          size: Math.floor(Math.random() * 10000) + 100, // 100-10100 bytes
          lines: Math.floor(Math.random() * 500) + 1, // 1-500 lines
          type: this._getFileType(filename),
          lastModified: new Date().toISOString()
        };
        
        resolve(fileInfo);
      }, 100); // Simulate 100ms delay
    });
  }
  
  /**
   * Determine file type based on extension
   * @private
   */
  _getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      txt: 'text',
      js: 'javascript',
      json: 'json',
      md: 'markdown',
      html: 'html',
      css: 'css'
    };
    
    return types[ext] || 'unknown';
  }
}

module.exports = new FileService();