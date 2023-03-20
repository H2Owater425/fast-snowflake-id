import { randomInt } from 'crypto';

export interface SnowflakeIdOptions {
	epoch?: number;
	instanceId?: number;
	overflowHandler?: () => void;
}

export class SnowflakeId {
	private id: ArrayBuffer = new ArrayBuffer(8);
	private idView: DataView = new DataView(this['id']);

	private lastTime: number = 0;
	private epoch: number = 0;
	private sequenceId: number = 0;
	private instanceId: number = 0;

	private isOverflowHandlerFunction: boolean = false;
	private overflowHandler: (() => void) | undefined;

	public static getInstanceId(datacenterId: number, workerId: number): number {
		if(datacenterId > -1 && datacenterId < 32) {
			if(workerId > -1 && workerId < 32) {
				return datacenterId << 5 + workerId;
			} else {
				throw new Error('WorkerId should be an integer between 0 and 32');
			}
		} else {
			throw new Error('DatacenterId should be an integer between 0 and 32');
		}
	}

	constructor(options: SnowflakeIdOptions = {}) {
		if(Number.isInteger(options['epoch'])) {
			if(options['epoch'] as number <= Date.now()) {
				this['epoch'] = options['epoch'] as number;
			} else {
				throw new Error('Options[\'epoch\'] should not exceed current time');
			}
		}
		
		if(Number.isInteger(options['instanceId'])) {
			if(options['instanceId'] as number > -1 && options['instanceId'] as number < 1024) {
				this['instanceId'] = options['instanceId'] as number;
			} else {
				throw new Error('Options[\'instanceId\'] should be an integer between 0 and 1023');
			}
		} else {
			this['instanceId'] = randomInt(1024);
		}

		if(typeof(options.overflowHandler) === 'function') {
			this.overflowHandler = options.overflowHandler;
			this['isOverflowHandlerFunction'] = true;
		}

		this['instanceId'] <<= 12;
	}

	private generateId(): SnowflakeId {
		if(this['sequenceId'] !== 4096) {
			const currentTime: number = Date.now() - this['epoch'];
	
			if(this['lastTime'] !== currentTime) {
				this['sequenceId'] = 0;
	
				this['lastTime'] = currentTime;
			}

			this['idView'].setUint32(0, Math.trunc(currentTime / 1024 /* 2**10 */));
			this['idView'].setUint32(4, (currentTime << 22) + this['instanceId'] + this['sequenceId']++);
		} else {
			if(this['isOverflowHandlerFunction']) {
				(this.overflowHandler as () => void)();
			} else {
				throw new Error('SnowflakeId[\'sequenceId\'] should not exceed 4095 in given millisecond');
			}
		}

		return this;
	}

	public getId(): BigInt {
		this.generateId();

		return this['idView'].getBigUint64(0);
	}

	public getBufferId(): Buffer {
		this.generateId();

		return Buffer.from(this['id']);
	}
}

export default SnowflakeId;