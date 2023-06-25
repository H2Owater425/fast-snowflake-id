import { randomInt } from 'crypto';

interface SnowflakeIdOptions {
	epoch?: number;
	instanceId?: number;
	overflowHandler?: () => void;
}

export default class SnowflakeId {
	private _id: ArrayBuffer = new ArrayBuffer(8);
	private _idView: DataView = new DataView(this['_id']);

	private _lastTime: number = 0;
	private _epoch: number = 0;
	private _sequenceId: number = 0;
	private _instanceId: number = 0;

	private _overflowHandler: (() => void) | undefined;

	public static getInstanceId(datacenterId: number, workerId: number): number {
		if(datacenterId > -1 && datacenterId < 32) {
			if(workerId > -1 && workerId < 32) {
				return datacenterId << 5 + workerId;
			} else {
				throw new Error('WorkerId must be an integer between 0 and 32');
			}
		} else {
			throw new Error('DatacenterId must be an integer between 0 and 32');
		}
	}

	constructor(options: SnowflakeIdOptions = {}) {
		if(Number.isInteger(options['epoch'])) {
			if(options['epoch'] as number <= Date.now()) {
				this['_epoch'] = options['epoch'] as number;
			} else {
				throw new Error('Options[\'epoch\'] must not exceed current time');
			}
		}
		
		if(Number.isInteger(options['instanceId'])) {
			if(options['instanceId'] as number > -1 && options['instanceId'] as number < 1024) {
				this['_instanceId'] = options['instanceId'] as number;
			} else {
				throw new Error('Options[\'instanceId\'] must be an integer between 0 and 1023');
			}
		} else {
			this['_instanceId'] = randomInt(1024);
		}

		if(typeof(options.overflowHandler) === 'function') {
			this._overflowHandler = options.overflowHandler;
		}

		this['_instanceId'] <<= 12;
	}

	public generateId(): SnowflakeId {
		if(this['_sequenceId'] !== 4096) {
			const currentTime: number = Date.now() - this['_epoch'];
	
			if(this['_lastTime'] !== currentTime) {
				this['_sequenceId'] = 0;
	
				this['_lastTime'] = currentTime;
			}

			this['_idView'].setUint32(0, Math.trunc(currentTime / 1024 /* 2**10 */));
			this['_idView'].setUint32(4, (currentTime << 22) + this['_instanceId'] + this['_sequenceId']++);
		} else {
			if(typeof(this._overflowHandler) === 'function') {
				(this._overflowHandler as () => void)();
			} else {
				throw new Error('SnowflakeId[\'sequenceId\'] must not exceed 4095 in given millisecond');
			}
		}

		return this;
	}

	public getId(): BigInt {
		return this['_idView'].getBigUint64(0);
	}

	public getBufferId(): Buffer {
		return Buffer.from(this['_id']);
	}
}