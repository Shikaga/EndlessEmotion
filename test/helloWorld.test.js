const expect = require('chai').expect;

describe('Hello World', function() {

    // Describe the test case
    it('should say hello to the world', function() {
      // Arrange
      const a = "Hello"
      const b = "World"
  
      // Act
      const result = a + " " + b;
  
      // Assert
      expect(result).to.equal("Hello World");
    });
  
  });