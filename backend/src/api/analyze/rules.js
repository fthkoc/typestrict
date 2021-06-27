/**
 * rules.js
 * 
 * Use raw data to apply rules 
 */

const Utility = require('./../util');

class Rules {
	configData = {};

	constructor(config) {
		this.configData = config['rules'];
	}

	async checkDuplicatingLibraryNames(fileContent, parsedFileData) {
		console.log('Rules::checkDuplicatingLibraryNames() called.');

		var libraryNames = [];
		var duplicatedImports = [];
		var imports = parsedFileData['imports'];
		// console.log('Rules::checkDuplicatingLibraryNames()::imports:' + Object.keys(imports));
		if (imports != null) {
			Object.keys(imports).forEach(function (i) {
				// console.log('Rules::checkDuplicatingLibraryNames()::libraryNames:' + libraryNames);
				var libraryName = imports[i]['libraryName'];
				var lineNumber = Utility.getLineNumberOfCharInFile(fileContent, imports[i]['start']);
				if (libraryNames.includes(libraryName)) {
					duplicatedImports.push({
						name: libraryName,
						lineNumber: lineNumber,
						message: 'duplicated library name \'' + libraryName + '\', at line ' + lineNumber + '.'
					});
				} else {
					libraryNames.push(libraryName);
				}
			});
		}
		// console.log('Rules::checkDuplicatingLibraryNames()::libraryNames:' + libraryNames);

		const totalCount = Object.keys(imports).length;
		const passedCount = Object.keys(libraryNames).length;

		var result = {
			"rule": "duplicatingLibraryNames",
			"category": this.configData['duplicatingLibraryNames']['category'],
			"weight": this.configData['duplicatingLibraryNames']['weight'],
			"total": totalCount,
			"passed": passedCount,
			"errors": duplicatedImports
		}

		console.log('Rules::checkDuplicatingLibraryNames() finished.');
		return result;
	}

	async checkDuplicatingSpecifiers(fileContent, parsedFileData) {
		console.log('Rules::checkDuplicatingSpecifiers() called.');

		var totalCount = 0;
		var passedCount = 0;
		var duplicatedSpecifiers = [];

		var imports = parsedFileData['imports'];
		if (imports != null) {
			Object.keys(imports).forEach(function (i) {
				// console.log('Rules::checkDuplicatingSpecifiers()::duplicatedSpecifiers=' + duplicatedSpecifiers);
				var libraryName = imports[i]['libraryName'];
				var lineNumber = Utility.getLineNumberOfCharInFile(fileContent, imports[i]['start']);
				var specifiers = imports[i]['specifiers'];

				if (specifiers != null) {
					var specifiersArray = specifiers.map(a => a.specifier);
					var specifiersMap = specifiersArray.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
					// console.log('DEBUG::Rules::checkDuplicatingSpecifiers()::specifiersArray=' + specifiersArray);

					specifiersMap.forEach(function (value, key) {
						var specifier = key;
						var usageCount = value;
						// console.log('DEBUG::Rules::checkDuplicatingSpecifiers()::specifier=' + specifier);
						// console.log('DEBUG::Rules::checkDuplicatingSpecifiers()::usageCount=' + usageCount);
						totalCount += 1;
						if (usageCount > 1) {
							duplicatedSpecifiers.push({
								name: specifier,
								lineNumber: lineNumber,
								message: 'duplicated specifier \'' + specifier + '\' from import \'' + libraryName + '\', at line ' + lineNumber + '.'
							});
						}
						else {
							passedCount += 1;
						}
					});
				}
			});
		}

		var result = {
			"rule": "duplicatingSpecifiers",
			"category": this.configData['duplicatingSpecifiers']['category'],
			"weight": this.configData['duplicatingSpecifiers']['weight'],
			"total": totalCount,
			"passed": passedCount,
			"errors": duplicatedSpecifiers
		}

		console.log('Rules::checkDuplicatingSpecifiers() finished.');
		return result;
	}

	async checkNamingConvention(fileContent, parsedFileData) {
		console.log('Rules::checkNamingConvention() called.');

		var totalCount = 0;
		var passedCount = 0;
		var errors = [];

		var allVariables = [];

		var declarations = parsedFileData['declarations'];
		if (declarations != null) {
			Object.keys(declarations).forEach(function (i) {
				var properties = declarations[i]['properties'];
				if (properties != null) {
					Object.keys(properties).forEach(function (j) {
						allVariables.push(properties[j]);
					});
				}

				var methods = declarations[i]['methods'];
				if (methods != null) {
					Object.keys(methods).forEach(function (j) {
						var variables = methods[j]['variables'];
						if (variables != null) {
							Object.keys(variables).forEach(function (k) {
								allVariables.push(variables[k]);
							});
						}

						var parameters = methods[j]['parameters'];
						if (parameters != null) {
							Object.keys(parameters).forEach(function (k) {
								allVariables.push(parameters[k]);
							});
						}
					});
				}

			});

			if (allVariables != null) {
				var totalCount = Object.keys(allVariables).length;
				var constantRegEx = this.configData['namingConvention']['options'].find(x => x.name === 'MacroCase')['regex'];
				var selectionRegEx = this.configData['namingConvention']['options'].find(x => x.name === this.configData['namingConvention']['selection'])['regex'];
				Object.keys(allVariables).forEach(function (i) {
					if (allVariables[i]['isConst']) {
						var regex = constantRegEx;
					}
					else {
						var regex = selectionRegEx;
					}

					// console.log('DEBUG::Rules::checkNamingConvention()::regex=' + regex);
					var name = allVariables[i]['name'];
					var lineNumber = Utility.getLineNumberOfCharInFile(fileContent, allVariables[i]['start']);

					if (name.match(regex)) {
						passedCount++;
					}
					else {
						errors.push({
							name: name,
							lineNumber: lineNumber,
							message: 'variable \'' + name + '\' not matching naming convention, at line ' + lineNumber + '.'
						});
					}
				});
			}
		}


		var result = {
			"rule": "namingConvention",
			"category": this.configData['namingConvention']['category'],
			"weight": this.configData['namingConvention']['weight'],
			"total": totalCount,
			"passed": passedCount,
			"errors": errors
		}

		console.log('Rules::checkNamingConvention() finished.');
		return result;
	}

	async checkMethodReturnType(fileContent, parsedFileData) {
		console.log('Rules::checkMethodReturnType() called.');

		var totalCount = 0;
		var passedCount = 0;

		var classes = parsedFileData['classes'];
		var methods = [];
		Object.keys(classes).forEach(function (i) {
			methods = methods.concat(classes[i]['methods']);
			totalCount += classes[i]['methods'].length;
		});

		var methodsWithoutReturnType = [];
		Object.keys(methods).forEach(function (i) {
			if (methods[i]['returnType'] == null) {
				var methodName = methods[i]['name'];
				var lineNumber = Utility.getLineNumberOfCharInFile(fileContent, methods[i]['start']);
				methodsWithoutReturnType.push({
					name: methodName,
					lineNumber: lineNumber,
					message: 'method \'' + methodName + '\' has not have a return type, at line ' + lineNumber + '.'
				});
			}
			else {
				passedCount += 1;
			}
		});

		var result = {
			"rule": "methodReturnType",
			"category": this.configData['methodReturnType']['category'],
			"weight": this.configData['methodReturnType']['weight'],
			"total": totalCount,
			"passed": passedCount,
			"errors": methodsWithoutReturnType
		}

		console.log('Rules::checkMethodReturnType() finished.');
		return result;
	}

	async checkMethodLOC(fileContent, parsedFileData) {
		console.log('Rules::checkMethodLOC() called.');
		var totalCount = 0;
		var passedCount = 0;

		var classes = parsedFileData['classes'];
		var methods = [];
		if (classes != null) {
			Object.keys(classes).forEach(function (i) {
				methods = methods.concat(classes[i]['methods']);
				totalCount += classes[i]['methods'].length;
			});
		}

		var functionsViolatesLOCLimit = [];
		if (methods != null) {
			var regex = this.configData['commentsForMethods']['regex'];
			var maxLineCount = this.configData['methodLOC']['maxLineCount'];
			Object.keys(methods).forEach(function (i) {
				var functionText = methods[i]['text'];
				var comment = functionText.match(regex);

				functionText = functionText.replace(new RegExp(regex), '');

				var functionLines = functionText.split('\n');
				// console.log('DEBUG::Rules::checkMethodLOC()::functionLines=' + functionLines);
				var functionLOC = functionLines.length - 2;
				if (comment != null) {
					functionLOC -= 1;
				}
				// console.log('DEBUG::Rules::checkMethodLOC()::functionLOC=' + functionLOC);
				if (functionLOC > maxLineCount) {
					var methodName = methods[i]['name'];
					var lineNumber = Utility.getLineNumberOfCharInFile(fileContent, methods[i]['start']);
					functionsViolatesLOCLimit.push({
						name: methodName,
						lineNumber: lineNumber,
						message: 'method \'' + methodName + '\' violates LOC limit, starts at line ' + lineNumber + '.'
					});
				}
				else {
					passedCount += 1;
				}
			});
		}

		var result = {
			"rule": "methodLOC",
			"category": this.configData['methodLOC']['category'],
			"weight": this.configData['methodLOC']['weight'],
			"total": totalCount,
			"passed": passedCount,
			"errors": functionsViolatesLOCLimit
		}

		console.log('Rules::checkMethodLOC() finished.');
		return result;
	}

	async checkMethodArgumentType(fileContent, parsedFileData) {
		console.log('Rules::checkMethodArgumentType() called.');

		var totalCount = 0;
		var passedCount = 0;

		var classes = parsedFileData['classes'];
		var methodArguments = [];
		Object.keys(classes).forEach(function (i) {
			var methods = classes[i]['methods'];
			Object.keys(methods).forEach(function (j) {
				if (methods[j]['arguments'] != null) {
					methodArguments = methodArguments.concat(methods[j]['arguments']);
					totalCount += methods[j]['arguments'].length;
				}
			})
		});

		var argumentsWithoutType = [];
		Object.keys(methodArguments).forEach(function (i) {
			if (methodArguments[i]['type'] == null) {
				var argumentName = methodArguments[i]['name'];
				var lineNumber = Utility.getLineNumberOfCharInFile(fileContent, methodArguments[i]['start']);
				argumentsWithoutType.push({
					name: argumentName,
					lineNumber: lineNumber,
					message: 'argument \'' + argumentName + ' has not have a specific type, at line ' + lineNumber + '.'
				});
			}
			else {
				passedCount += 1;
			}
		});

		var result = {
			"rule": "methodArgumentType",
			"category": this.configData['methodArgumentType']['category'],
			"weight": this.configData['methodArgumentType']['weight'],
			"total": totalCount,
			"passed": passedCount,
			"errors": argumentsWithoutType
		}

		console.log('Rules::checkMethodArgumentType() finished.');
		return result;
	}

	async checkFieldType(fileContent, parsedFileData) {
		console.log('Rules::checkFieldType() called.');

		var totalCount = 0;
		var passedCount = 0;

		var classes = parsedFileData['classes'];
		var fields = [];
		if (classes != null) {
			Object.keys(classes).forEach(function (i) {
				if (classes[i]['fields'] != null) {
					fields = fields.concat(classes[i]['fields']);
					totalCount += classes[i]['fields'].length;
				}
			});
		}

		var fieldsWithoutType = [];
		if (fields != null) {
			Object.keys(fields).forEach(function (i) {
				if (fields[i]['type'] == null) {
					var fieldName = fields[i]['name'];
					//var className = fields[i]['name']; // TODO: get class name
					//var startIndex = fields[i]['start']; // undefined
					//var endIndex = fields[i]['end']; // undefined
					fieldsWithoutType.push({
						name: fieldName,
						//start: startIndex,
						//end: endIndex,
						message: 'field \'' + fieldName + '\' has not have a specific type.'
						// message: 'field \'' + fieldName + '\' in class \'' + className + '\' has not have a specific type, starts at char ' + startIndex + ', ends at ' + endIndex + '.'
					});
				}
				else {
					passedCount += 1;
				}
			});
		}

		var result = {
			"rule": "fieldType",
			"category": this.configData['fieldType']['category'],
			"weight": this.configData['fieldType']['weight'],
			"total": totalCount,
			"passed": passedCount,
			"errors": fieldsWithoutType
		}

		console.log('Rules::checkFieldType() finished.');
		return result;
	}

	async checkCommentsForMethods(fileContent, parsedFileData) {
		console.log('Rules::checkCommentsForMethods() called.');

		var totalCount = 0;
		var passedCount = 0;

		var classes = parsedFileData['classes'];
		var methods = [];
		Object.keys(classes).forEach(function (i) {
			methods = methods.concat(classes[i]['methods']);
			totalCount += classes[i]['methods'].length;
		});

		var methodsWithoutComment = [];
		Object.keys(methods).forEach(function (i) {
			var functionText = methods[i]['text'];
			var regex = this.configData['commentsForMethods']['regex'];
			if (!functionText.match(regex)) {
				var methodName = methods[i]['name'];
				var lineNumber = Utility.getLineNumberOfCharInFile(fileContent, methods[i]['start']);
				methodsWithoutComment.push({
					name: methodName,
					lineNumber: lineNumber,
					message: 'method \'' + methodName + '\' has not have a comment on top, starts at line ' + lineNumber + '.'
				});
			}
			else {
				passedCount += 1;
			}
		});

		var result = {
			"rule": "commentsForMethods",
			"category": this.configData['commentsForMethods']['category'],
			"weight": this.configData['commentsForMethods']['weight'],
			"total": totalCount,
			"passed": passedCount,
			"errors": methodsWithoutComment
		}

		console.log('Rules::checkCommentsForMethods() finished.');
		return result;
	}
}

module.exports = Rules;