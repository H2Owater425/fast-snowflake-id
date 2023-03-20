<div align='center'>
	<img src='.github/banner.png' alt='banner'/>
	<h3>Fast snowflake id generator for Node.js</h3>
	<sup>I guess...?</sup>
  
  [![npm version](https://img.shields.io/npm/v/fast-snowflake-id?style=flat-square)](https://npmjs.org/package/fast-snowflake-id)
  [![npm type definition](https://img.shields.io/npm/types/fast-snowflake-id?style=flat-square)](https://npmjs.org/package/fast-snowflake-id)
  [![license](https://img.shields.io/github/license/H2Owater425/fast-snowflake-id?style=flat-square)](https://github.com/H2Owater425/fast-snowflake-id/blob/main/LICENSE)
</div>

<br/>

## Installation

Using npm:
```bash
$ npm install fast-snowflake-id
```

Using yarn:
```bash
$ yarn add fast-snowflake-id
```

## Features

- Get snowflake id as bigint
- Get snowflake id as buffer

Without any dependencies!

## Usage/Examples

setup:
```javascript
// CommonJS
const SnowflakeId = require('fast-snowflake-id').default;

// ES Module
import SnowflakeId from 'fast-snowflake-id';
```

initialization:
```javascript
// All properties are optional
const snowflakeId = new SnowflakeId({
	epoch: 1288834974657 /* Twitter's snowflake id epoch */,
	instanceId: SnowflakeId.getInstanceId(31, 31) /* Getting instanceId from datacenterId and workerId */,
	overflowHandler: function () {
		console.error('overflow!!!!');

		return;
	}
});
```

printing snowflake id as bigint:
```javascript
console.log(snowflakeId.getId());
```

printing snowflake id as buffer:
```javascript
console.log(snowflakeId.getBufferId());
```

## Contribution

Contribution, issues and feature requests are welcome!<br/>Feel free to check [issues page](https://github.com/H2Owater425/fast-snowflake-id/issues).