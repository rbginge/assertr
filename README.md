## Simple javascript test tool

A javascript test tool designed to be simple and lightweight. The assertions can be '===', '==', '!==', '!=', '>', '>=', '<', '<=', 'contains' or 'has'. 

'contains' is for checking a string or array contains a value (or substring). 'has' is for checking an object or array has a particular key. The rest should be self evident.

The results of the tests will be output to the console unless you tell it to run quietly (however, in quiet mode failing tests will throw an exception).

#### Include the library
Include the assertr code before the code you want to test

```html
	<script src="assertr.js"></script>
	<script src="yourcode.js"></script>
```

#### Register the functions to test

```javascript
	var yourFunctionToTest = function(arg1, arg2) {
    // some code here
    return 'result of my function';
	};
	
	// Takes two args; <name of test suite> and <the function to test>
	assertr.register('yourFunctionToTest', yourFunctionToTest);
	
	var anotherFunctionToTest = function(arg1) {
    // some code here
    return 'result of my other function';
	};
	
	assertr.register('jimmyJoesFunction', anotherFunctionToTest);
```

#### Add your test code
(For maintainability/seperation of concerns etc you should probably put this in a separate file)

```javascript
  // The second argument tells the test runner to do its business quietly
	assertr.run([
		{
			yourFunctionToTest: [
				{
					description: 'Some description of the test so other peeps dont have to mind read',
					expects: 'result of my function',
					args: ['arg1'], 
					unit: function(result) {
						return assertr.assert(result, '===', this.expects);
					}
				},
				{
					description: 'More descriptions',
					expects: 'some gibberish that wont match',
					args: ['arg1', 'arg2'], 
					unit: function(result) {
						return assertr.assert(result, '!==', this.expects);
					}
				}
			],
			jimmyJoesFunction: [
				{
					description: 'Another suite of tests for one of my insanely complex functions',
					expects: 'The moon on a stick',
					args: [], 
					unit: function(result) {
						return assertr.assert(result, '!==', this.expects);
					}
				}
			]
		}
	], true); // Pass true as second arg to tell the test suite to run quietly i.e. not output results to console. Note that in this state exceptions will be thrown for failing tests.
```
