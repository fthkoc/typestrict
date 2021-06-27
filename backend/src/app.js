const express = require('express');
const cors = require('cors');

const fs = require('fs');

const TSAnalyzer = require('./api/analyze/analyze');
const Utility = require('./api/util');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/analyze', async (req, res) => {
	var start = new Date();
	console.log("get::/analyze called.");
	console.log("incoming request:" + JSON.stringify(req.headers));

	const configData = JSON.parse(fs.readFileSync(__dirname + '\\api\\config.json'));
	const analyzer = new TSAnalyzer(configData);
	const fileName = configData['fileFullPath'];
	result = await analyzer.analyzeFile(fileName);

	var timePassed = new Date() - start
	result['time'] = `${timePassed} ms`;

	res.send(result);
	console.log("get::/analyze finished.");
})

app.get('/analyzeGitHub', async (req, res) => {
	var start = new Date();
	console.log("get::/analyzeGitHub called.");

	const configData = JSON.parse(fs.readFileSync(__dirname + '\\api\\config.json'));
	const analyzer = new TSAnalyzer(configData);

	const fileURL = req.query['url'].split("\"").join("");
	console.log("fileURL:" + JSON.stringify(fileURL));

	const fileFullPath = configData['fileDir'] + '\\' + 'github_' + Utility.getTimeStampForResultFile(new Date()) + '.ts';

	// get file from github and write it to directory
	var request = require("request");
	const getFileFromServer = (callback) => {
		request(fileURL, function (err, resp, body) {
			fs.writeFile(fileFullPath, resp['body'], function (err) {
				if (err) throw err;
				else {
					console.log('DEBUG::' + fileFullPath + ' saved.');
					callback(true);
				}
			});
		});
	}

	const performAnalyze = async (callback) => {
		result = await analyzer.analyzeFile(fileFullPath);
		callback(result);
	}

	getFileFromServer((isFinished) => {
		if (isFinished) {
			performAnalyze((result) => {
				if (result) {
					var timePassed = new Date() - start
					result['time'] = `${timePassed} ms`;

					res.send(result);
				}
			})
		}
	});

	console.log("get::/analyzeGitHub finished.");
})

app.get('/settings', async (req, res) => {
	console.log("get::/settings called.");
	console.log("incoming request:" + JSON.stringify(req.headers));
	const configData = JSON.parse(fs.readFileSync(__dirname + '\\api\\config.json'));
	res.send(configData);
	console.log("get::/settings finished.");
})

app.get('/dashboard', async (req, res) => {
	console.log("get::/dashboard called.");
	console.log("incoming request:" + JSON.stringify(req.headers));
	const configData = JSON.parse(fs.readFileSync(__dirname + '\\api\\config.json'));
	const resultPath = configData['resultPath'];
	const fileList = fs.readdirSync(resultPath).sort().reverse().slice(0, 5);
	console.log('fileList=' + fileList);
	var resultArray = [];
	fileList.forEach(function (file) {
		var fileData = JSON.parse(fs.readFileSync(resultPath + '\\' + file));
		resultArray.push(fileData);
	});
	res.send(resultArray);
	console.log("get::/dashboard finished.");
})

const port = 3000;
app.listen(port, () => console.log("*** typestrict backend server connected on port " + port + " ***"));

