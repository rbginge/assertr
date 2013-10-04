/*
 *	assertr.js v0.1
 *	Simple javascript unit testing suite
 *
 *	Copyright 2013, Ryan Bolton:
 *	<ryan at ryanbolton dot me>
 *	assertr is available under the MIT license.
 */
 ;(function(window, lib, undefined) {
 	'use strict';

	window[lib] = (function() {

		var iterate = function(enumerable, cb) {
			if(enumerable.length === undefined) {
				for(var key in enumerable) {
					if(enumerable.hasOwnProperty(key)) {
						cb(enumerable[key], key);
					}
				}
			} else {
				for(var i = 0, len = enumerable.length; i < len; i++) {
					cb(enumerable[i], i);
				}
			}
		},
		logToConsole = function(message) {
			if(window.console && !this.runQuietly) {
				console.log(message);
			}
		},
		functionRegistered = function(name) {
			return this.functions.hasOwnProperty(name);
		};

		var FunctionMissingException = function(fnName) {
			this.message = 'The function ' + fnName + ' hasn\'t been registered';
			this.name = "FunctionMissingException";
		};
		FunctionMissingException.prototype = Error.prototype;

		var FailedTestException = function(testDescription) {
			this.message = 'The test "' + testDescription + '" has FAILED';
			this.name = "FailedTestException";
		};
		FailedTestException.prototype = Error.prototype;

		var assertr = function() {
			this.functions = {};
			this.tests = [];
			this.runQuietly = false;
		};

		assertr.prototype = {
			log: function(suiteName, testDescription, pass, expects, result) {
				var message = suiteName;

				if(testDescription) {
					message += ': (' + testDescription + '): ' + pass + "!\n";
					message += 'Expected ' + expects.toString() + ', got ' + result.toString() + "\n";
				}

				logToConsole.call(this, message);
			},
			register: function(name, fn) {
				if(!functionRegistered.call(this, name)) {
					this.functions[name] = fn;
				}
			},
			run: function(tests, quiet) {
				var _this = this, result;

				this.runQuietly = quiet;

				iterate(tests, function(suites) {
					iterate(suites, function(suite, suiteName) {
						if(functionRegistered.call(_this, suiteName)) {
							_this.log(suiteName);
							iterate(suite, function(test) {
								var result = _this.functions[suiteName].apply(null, test.args),
									assertion = test.unit(result);

								if(_this.runQuietly && !assertion) {
									throw new FailedTestException(test.description);
								}

								_this.log(suiteName, test.description,
									assertion ? 'PASS' : 'FAIL',
									test.expects,
									result);

							});
						} else {
							throw new FunctionMissingException(suiteName);
						}
					});
				});
			},
			assert: function(result, condition, expects) {
				if (condition === '===') return result === expects;
				if (condition === '==') return result == expects;
				if (condition === '!==') return result !== expects;
				if (condition === '!=') return result != expects;
				if (condition === '>') return result > expects;
				if (condition === '>=') return result >= expects;
				if (condition === '<') return result < expects;
				if (condition === '<=') return result <= expects;
				// String or array
				if (condition === 'contains' && result.hasOwnProperty(length)) return result.indexOf(expects) > -1;
				// Array
				if (condition === 'has' && result.hasOwnProperty(length) && /^\d+$/.test(expects)) return typeof result[expects] !== undefined;
				// Object
				if (condition === 'has') return result.hasOwnProperty(expects);
				
				return false;
			}
		};

		return new assertr();

	}) ();

})(window, 'assertr');
