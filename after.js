const terser = require('terser');
const fs = require('fs/promises');

fs.readFile('./library/index.js', {
	encoding: 'utf-8',
	flag: 'r'
})
.then(function (file) {
	return terser.minify(file);
})
.then(function (minifiedFile) {
	if(typeof(minifiedFile['code']) === 'string') {
		return minifiedFile['code'];
	} else {
		throw new Error('Cannot minify index.js');
	}
})
.then(function (minifiedCode) {
	return fs.writeFile('./library/index.js', minifiedCode, {
		encoding: 'utf-8',
		flag: 'w'
	});
})
.then(function () {
	process['stdout'].write('Successfully finished minifying\n');

	return;
})
.catch(function (error) {
	process['stderr'].write(String(error) + '\n');

	process.exit(1);
});