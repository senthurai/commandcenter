
import { AConsumer, IProcessor } from "./IProcessor";
import { ICommandCenterDelegates, ICommandCenterModel } from "./ccmodel";



export interface ICommandCenter<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I> {

}

export abstract class CommandCenter<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I> extends AConsumer<D, M, I> implements ICommandCenter<D, M, I> {

    constructor(model: M) {
        super(model);

    }

}