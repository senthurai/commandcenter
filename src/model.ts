import { IDelegates, IModel } from "./ccmodel";
import { LogDelegate, LogLevel } from "./LogDelegate";


export interface IA2ANodeServerCCModel extends IModel<A2ANodeServerDelegates> {
    setInput(input: number[][]): void;
    getInput() : number[][];
}

export interface IA2ANodeServerDelegates extends IDelegates {

}

export class A2ANodeServerCCModel implements IA2ANodeServerCCModel {
    getInput() {
        return this.input;
    }
    input: number[][];
    setInput(input: number[][]) {
        this.input = input;
    }
    getModel(): this {
        return this;
    }
}
 
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