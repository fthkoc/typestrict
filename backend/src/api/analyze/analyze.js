/**
 * analyze.js
 * 
 * Main class for analyze TS files 
 */

const Rules = require('./rules');
const DataGenerator = require('./datagen');
const Utility = require('./../util');
const fs = require('fs');

class TSAnalyzer {
	configData = {};
	fileContent = '';

	constructor(config) {
		this.configData = config;
		this.dataGenerator = new DataGenerator();
		this.rules = new Rules(this.configData);
		this.utility = new Utility(this.configData);
	}

	async analyzeFile(fileName) {
		console.log("TSAnalyzer::AnalyzeFile() called.");
		console.log("TSAnalyzer::AnalyzeFile()::fileName=" + fileName);

		// Create the index and analyze details
		var totalCount = 0;
		var passedCount = 0;
		var calculatedIndex = 0;
		var potentialIndex = 0;
		var details = [];

		// Read file
		try {
			this.fileContent = fs.readFileSync(fileName, "utf8",
				function (error) {
					if (error) {
						return {
							"file": fileName,
							"total": totalCount,
							"passed": passedCount,
							"status": "Error! Couldn't read the file, check the path, fileName and directory.",
							"details": error,
							"time": '',
							"index": calculatedIndex,
							"potential": potentialIndex
						}
					}
				});
		} catch (exception) {
			return {
				"file": fileName,
				"total": totalCount,
				"passed": passedCount,
				"status": "Error! Exception thrown at readFileSync().",
				"details": exception,
				"time": '',
				"index": calculatedIndex,
				"potential": potentialIndex
			}
		}
		// console.log('DEBUG::Rules::constructor()::this.fileContent=' + this.fileContent);

		// Generate parser data for given file
		var rawDataESTree;
		var rawDataTSParser;
		var rawDataTSFileParser;
		try {
			rawDataESTree = await this.dataGenerator.parseWithESTree(fileName);
			// console.log("TSAnalyzer::rawDataESTree:" + JSON.stringify(rawDataESTree));
			rawDataTSParser = await this.dataGenerator.parseWithTSParser(fileName);
			// console.log("TSAnalyzer::rawDataTSParser:" + JSON.stringify(rawDataTSParser));
			rawDataTSFileParser = await this.dataGenerator.parseWithTSFileParser(fileName);
			// console.log("TSAnalyzer::rawDataTSFileParser:" + JSON.stringify(rawDataTSFileParser));
		} catch (exception) {
			console.log('DEBUG::parserException=' + JSON.stringify(exception))
			return {
				"file": fileName,
				"total": totalCount,
				"passed": passedCount,
				"status": "Error! Parsing not completed.",
				"details": [{
					"rule": "parsing",
					"category": "Parse Errors",
					"weight": 0,
					"total": 1,
					"passed": 0,
					"errors": exception
				}],
				"time": '',
				"index": 0,
				"potential": null
			}
		}



		// Apply defined rules to parser data and update result
		if (this.configData['rules']['duplicatingLibraryNames']['check']) {
			const duplicatingLibraryNames = await this.rules.checkDuplicatingLibraryNames(this.fileContent, rawDataTSParser);
			totalCount += duplicatingLibraryNames['total'];
			passedCount += duplicatingLibraryNames['passed'];
			calculatedIndex += duplicatingLibraryNames['passed'] * duplicatingLibraryNames['weight'];
			potentialIndex += duplicatingLibraryNames['total'] * duplicatingLibraryNames['weight'];
			details.push(duplicatingLibraryNames);
			console.log("TSAnalyzer::duplicatingLibraryNames:" + JSON.stringify(duplicatingLibraryNames));
		}
		if (this.configData['rules']['duplicatingSpecifiers']['check']) {
			const duplicatingSpecifiers = await this.rules.checkDuplicatingSpecifiers(this.fileContent, rawDataTSParser);
			totalCount += duplicatingSpecifiers['total'];
			passedCount += duplicatingSpecifiers['passed'];
			calculatedIndex += duplicatingSpecifiers['passed'] * duplicatingSpecifiers['weight'];
			potentialIndex += duplicatingSpecifiers['total'] * duplicatingSpecifiers['weight'];
			details.push(duplicatingSpecifiers);
			console.log("TSAnalyzer::duplicatingSpecifiers:" + JSON.stringify(duplicatingSpecifiers));
		}
		if (this.configData['rules']['namingConvention']['check']) {
			const namingConvention = await this.rules.checkNamingConvention(this.fileContent, rawDataTSParser);
			totalCount += namingConvention['total'];
			passedCount += namingConvention['passed'];
			calculatedIndex += namingConvention['passed'] * namingConvention['weight'];
			potentialIndex += namingConvention['total'] * namingConvention['weight'];
			details.push(namingConvention);
			console.log("TSAnalyzer::namingConvention:" + JSON.stringify(namingConvention));
		}
		if (this.configData['rules']['methodReturnType']['check']) {
			const methodReturnType = await this.rules.checkMethodReturnType(this.fileContent, rawDataTSFileParser);
			totalCount += methodReturnType['total'];
			passedCount += methodReturnType['passed'];
			calculatedIndex += methodReturnType['passed'] * methodReturnType['weight'];
			potentialIndex += methodReturnType['total'] * methodReturnType['weight'];
			details.push(methodReturnType);
			console.log("TSAnalyzer::methodReturnType:" + JSON.stringify(methodReturnType));
		}
		if (this.configData['rules']['methodLOC']['check']) {
			const methodLOC = await this.rules.checkMethodLOC(this.fileContent, rawDataTSFileParser);
			totalCount += methodLOC['total'];
			passedCount += methodLOC['passed'];
			calculatedIndex += methodLOC['passed'] * methodLOC['weight'];
			potentialIndex += methodLOC['total'] * methodLOC['weight'];
			details.push(methodLOC);
			console.log("TSAnalyzer::methodLOC:" + JSON.stringify(methodLOC));
		}
		if (this.configData['rules']['methodArgumentType']['check']) {
			const methodArgumentType = await this.rules.checkMethodArgumentType(this.fileContent, rawDataTSFileParser);
			totalCount += methodArgumentType['total'];
			passedCount += methodArgumentType['passed'];
			calculatedIndex += methodArgumentType['passed'] * methodArgumentType['weight'];
			potentialIndex += methodArgumentType['total'] * methodArgumentType['weight'];
			details.push(methodArgumentType);
			console.log("TSAnalyzer::methodArgumentType:" + JSON.stringify(methodArgumentType));
		}
		if (this.configData['rules']['fieldType']['check']) {
			const fieldType = await this.rules.checkFieldType(this.fileContent, rawDataTSFileParser);
			totalCount += fieldType['total'];
			passedCount += fieldType['passed'];
			calculatedIndex += fieldType['passed'] * fieldType['weight'];
			potentialIndex += fieldType['total'] * fieldType['weight'];
			details.push(fieldType);
			console.log("TSAnalyzer::fieldType:" + JSON.stringify(fieldType));
		}
		if (this.configData['rules']['commentsForMethods']['check']) {
			const commentsForMethods = await this.rules.checkCommentsForMethods(this.fileContent, rawDataTSFileParser);
			totalCount += commentsForMethods['total'];
			passedCount += commentsForMethods['passed'];
			calculatedIndex += commentsForMethods['passed'] * commentsForMethods['weight'];
			potentialIndex += commentsForMethods['total'] * commentsForMethods['weight'];
			details.push(commentsForMethods);
			console.log("TSAnalyzer::commentsForMethods:" + JSON.stringify(commentsForMethods));
		}

		// construct analyze result object
		const result = {
			"file": fileName,
			"total": totalCount,
			"passed": passedCount,
			"status": "",
			"details": details,
			"time": '',
			"index": calculatedIndex,
			"potential": potentialIndex
		}

		// Write result to file
		this.utility.writeResultToFile(result, 'result');

		// Return result
		console.log("TSAnalyzer::result:" + JSON.stringify(result));
		return result;
	}
}

module.exports = TSAnalyzer;