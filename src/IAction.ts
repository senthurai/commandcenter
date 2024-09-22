
import { AConsumer, AProcessor, IProcessor } from "./IProcessor";
import { IDelegates as IDelegates, IModel as IModel } from "./ccmodel";


export interface IAction<D extends IDelegates, M extends IModel<D>, I, O> extends IProcessor<D, M, I, O> {

}

export abstract class Action<D extends IDelegates, M extends IModel<D>, I, O> extends AProcessor<D, M, I, O> implements IAction<D, M, I, O> {

}



export abstract class UIAction<D extends IDelegates, M extends IModel<D>, I, O> extends AProcessor<D, M, I, O> implements IAction<D, M, I, O> {

}



export abstract class UIDesignAction<D extends IDelegates, M extends IModel<D>, I, O> extends AProcessor<D, M, I, O> implements IAction<D, M, I, O> {

}


export abstract class DataAction<D extends IDelegates, M extends IModel<D>, I, O> extends AProcessor<D, M, I, O> implements IAction<D, M, I, O> {

}

export interface ICommandCenterAction<D extends IDelegates, M extends IModel<D>, I> extends IAction<D, M, I, void> {
}

export abstract class CommandCenterAction<D extends IDelegates, M extends IModel<D>, I> extends AConsumer<D, M, I> implements ICommandCenterAction<D, M, I> {

}