
import { AConsumer, IProcessor } from "./IProcessor";
import { IDelegates, IModel } from "./ccmodel";



export interface ICommandCenter<D extends IDelegates, M extends IModel<D>, I> {

}

export abstract class CommandCenter<D extends IDelegates, M extends IModel<D>, I> extends AConsumer<D, M, I> implements ICommandCenter<D, M, I> {

    constructor(model: M) {
        super(model);

    }

}