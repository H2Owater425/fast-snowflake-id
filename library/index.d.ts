interface SnowflakeIdOptions {
	epoch?: number;
	instanceId?: number;
	overflowHandler?: () => void;
}

export default class SnowflakeId {
	public static getInstanceId(datacenterId: number, workerId: number): number;
	
	constructor(options?: SnowflakeIdOptions);
	
	public generateId(): SnowflakeId;
	public getId(): BigInt;
	public getBufferId(): Buffer;
}