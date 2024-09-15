import { ICommandCenterDelegates, ICommandCenterModel }from "./ccmodel";
import { IProcessor, AProcessor }from "./IProcessor";


export interface IConsumer<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, C> extends IProcessor<D, M, C, void> {
    consume(input: C): void;
}

export abstract class AConsumer<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, C> extends AProcessor<D, M, C, void> implements IConsumer<D, M, C> {
    constructor(model: M) {
        super(model);
    }
    abstract consume(input: C): void;
    process(input: C): void {
        this.consume(input);
    }
}
