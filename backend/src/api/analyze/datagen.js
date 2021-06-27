/**
 * datagen.js
 * 
 * Parse typescript files and create raw analyze data here
 */

const typescriptParser = require('typescript-parser');
const typescriptESTree = require('@typescript-eslint/typescript-estree');
const TSFileParser = require("ts-file-parser");

const fs = require('fs');

class DataGenerator {
	constructor() { }

	async parseWithTSParser(fileName) {
		console.log("DataGenerator::parseWithTSParser() called. fileName=" + fileName);
		const parserInstance = new typescriptParser.TypescriptParser();
		const result = await parserInstance.parseFile(fileName, 'workspace root');
		console.log("DataGenerator::parseWithTSParser()::finished.");
		// console.log("DataGenerator::parseWithTSParser()::finished. result=" + JSON.stringify(result));
		return result;
	}

	async parseWithESTree(fileName) {
		console.log("DataGenerator::parseWithESTree() called. fileName=" + fileName);
		const file = fs.readFileSync(fileName);
		const result = await typescriptESTree.parse(file);
		console.log("DataGenerator::parseWithESTree()::finished.");
		// console.log("DataGenerator::parseWithESTree()::finished. result=" + JSON.stringify(result));
		return result;
	}

	async parseWithTSFileParser(fileName) {
		console.log("DataGenerator::parseWithTSFileParser() called. fileName=" + fileName);
		const declarations = fs.readFileSync(fileName).toString();
		const result = TSFileParser.parseStruct(declarations, {}, fileName);
		console.log("DataGenerator::parseWithTSFileParser()::finished.");
		// console.log("DataGenerator::parseWithTSFileParser()::finished. result=" + JSON.stringify(result));
		return result;
	}
}

module.exports = DataGenerator;