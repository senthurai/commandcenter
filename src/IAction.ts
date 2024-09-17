
import { AProcessor, IProcessor } from "./IProcessor";
import { ICommandCenterDelegates, ICommandCenterModel } from "./ccmodel";


export interface IUIAction<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> extends IProcessor<D, M, I, O> {

}

export abstract class UIAction<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> extends AProcessor<D, M, I, O> implements IUIAction<D, M, I, O> {

}

export interface IUIDesignAction<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> extends IProcessor<D, M, I, O> {

}

export abstract class UIDesignAction<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> extends AProcessor<D, M, I, O> implements IUIDesignAction<D, M, I, O> {

}

export interface IDataAction<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> extends IProcessor<D, M, I, O> {

}

export abstract class DataAction<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> extends AProcessor<D, M, I, O> implements IDataAction<D, M, I, O> {

}

export interface ICommandCenterAction<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I> extends IProcessor<D, M, I, undefined> {

}

export abstract class CommandCenterAction<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I> extends AProcessor<D, M, I, undefined> implements ICommandCenterAction<D, M, I> {

}