export interface SnowflakeIdOptions {
	epoch?: number;
	instanceId?: number;
	overflowHandler?: () => void;
}

export class SnowflakeId {
	private id: ArrayBuffer;
	private idView: DataView;
	private lastTime: number;
	private epoch: number;
	private sequenceId: number;
	private instanceId: number;
	private isOverflowHandlerFunction: boolean;
	private overflowHandler: (() => void) | undefined;

	public static getInstanceId(datacenterId: number, workerId: number): number;
	
	constructor(options?: SnowflakeIdOptions);
	
	private generateId(): SnowflakeId;

	public getId(): BigInt;
	public getBufferId(): Buffer;
}

export default SnowflakeId;