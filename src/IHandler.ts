import { ICommandCenterDelegates, ICommandCenterModel }from "./ccmodel";
import { IConsumer }from "./IConsumer";
import { AProcessor }from "./IProcessor";


export interface IHandler<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>> extends IConsumer<D, M, void> {
    handle(): void;

    consume(input: void): void;
}

export abstract class AHandler<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>> extends AProcessor<D, M, void, void> implements IHandler<D, M> {
    constructor(model: M) {
        super(model);
    }
    abstract handle(): void;
    consume(input: void): void {
        this.handle();
    }
}
