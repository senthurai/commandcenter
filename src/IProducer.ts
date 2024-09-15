import { ICommandCenterDelegates, ICommandCenterModel }from "./ccmodel";
import { IProcessor, AProcessor }from "./IProcessor";


export interface IProducer<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, O> extends IProcessor<D, M, void, O> {
    produce(): O;
}

export abstract class AProducer<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, O> extends AProcessor<D, M, void, O> implements IProducer<D, M, O> {
    constructor(model: M) {
        super(model);
    }
    abstract produce(): O;
    process(input: void): O {
        return this.produce();
    }
}
