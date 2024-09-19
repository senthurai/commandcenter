import { ICommandCenterDelegates, ICommandCenterModel } from "../ccmodel";
import { LogDelegate, LogLevel } from "../LogDelegate";


export interface IA2ANodeServerCCModel extends ICommandCenterModel<A2ANodeServerDelegates> {
}

export interface IA2ANodeServerDelegates extends ICommandCenterDelegates {

}

export class A2ANodeServerCCModel implements IA2ANodeServerCCModel {
    getModel(): this {
        return this;
    }
}

;
export class A2ANodeServerDelegates implements IA2ANodeServerDelegates {
    getLogger(): LogDelegate {
        return logger;
    }
    getDelegates(): this {
        return this;
    }
}

export class ConcreteLogDelegate extends LogDelegate {

    constructor(name: string) {
        super(name);
    }

    log(message: string): void {
        console.log(message);
    }

}
const logger = new ConcreteLogDelegate("simple")
logger.setLevel(LogLevel.VERBOSE)