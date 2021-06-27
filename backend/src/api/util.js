/**
 * util.js
 * 
 * Utility functions 
 */

const fs = require('fs')

class Utility {
	config = {}

	constructor(updatedConfig) {
		this.config = updatedConfig;
	}

	/**
	 * Creates JSON file with given name for given object in the path from config
	 * 
	 * @param {JSON} result 
	 * @param {string} fileName 
	 */
	async writeResultToFile(result, fileName) {
		const date = Utility.getTimeStampForResultFile(new Date());
		const resultFileName = this.config['resultPath'] + '\\' + fileName + '_' + date + '.json';
		fs.writeFile(resultFileName, JSON.stringify(result), (err) => {
			if (err) {
				throw err;
			}
			console.log(resultFileName + ' saved.');
		});
	}

	/**
	 * Creates string 
	 * 
	 * @param {Date} date 
	 * @returns timestamp as a string in 'YYYYMMDDhhmmss' format
	 */
	static getTimeStampForResultFile(date) {
		const year = `${date.getFullYear()}`.padStart(4, '0');
		const month = `${date.getMonth() + 1}`.padStart(2, '0');
		const day = `${date.getDate()}`.padStart(2, '0');
		const hour = `${date.getHours()}`.padStart(2, '0');
		const minute = `${date.getMinutes()}`.padStart(2, '0');
		const second = `${date.getSeconds()}`.padStart(2, '0');
		return `${year}${month}${day}${hour}${minute}${second}`
	}

	static getLineNumberOfCharInFile(fileContent, position) {
		return fileContent.substring(0, position).split('\n').length;
	}

	static writeGitHubDataToFile(fileFullPath, data) {
		fs.writeFile(fileFullPath, JSON.stringify(data), function (err) {
			if (err) throw err;
			console.log(fileFullPath + ' saved.');
		});
	}
}

module.exports = Utility;