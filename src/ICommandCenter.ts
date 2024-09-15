
import { IProcessor } from "./IProcessor";
import { AConsumer } from "./IConsumer";
import { ICommandCenterDelegates, ICommandCenterModel } from "./ccmodel";

export interface ICommandCenter<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, T extends IProcessor<D, M, any, any>, I> {
    getProcessors(): Array<{ new(): T }>;
}

export abstract class CommandCenter<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>,
    T extends IProcessor<D, M, any, any>, I> extends AConsumer<D, M, I> implements ICommandCenter<D, M, T, I> {

    constructor(model: M) {
        super(model);
        this.getProcessors().filter(c => this.isNotLazy(c)).forEach(p => this.getHandler(p));
    }
    private isNotLazy(c: { new(): T }): boolean {
        return !c.prototype.lazy;
    }
    abstract getProcessors(): Array<{ new(): T }>;
}