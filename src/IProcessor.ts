
import { ICommandCenterDelegates, ICommandCenterModel } from "./ccmodel";


export interface IProcessor<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> {

    process(input: I | undefined): O;
    getThreads(): Map<String, Promise<any>>;
    go<P extends IProcessor<D, M, W, R>, W extends unknown, R extends unknown>(actionType: new (...args: any) => P, input?: W): Promise<R>;
    goSync<P extends IProcessor<D, M, W, R>, W extends unknown, R extends unknown>(actionType: { new(...args: any[]): P }, input?: W): R;
    getDelegates(): D;
    getHandler<H extends IProcessor<D, M, I, O>, I, O>(clazz: { new(...args: any[]): H }): H;
    getModel(): M;
    register(): void;
    getParent(): IProcessor<D, M, unknown, unknown> | undefined;
    setParent(parent: IProcessor<D, M, unknown, unknown> | undefined): void;


}
export abstract class AProcessor<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> implements IProcessor<D, M, I, O> {
    private model: M;

    constructor(model: M) {
        this.model = model;
    }

    protected parent?: IProcessor<D, M, any, any> | undefined;

    // Method to generate a unique key for each promise
    private generatePromiseKey(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    // Method to add a promise to the collection
    private addPromise(typeName: string, promise: Promise<any>): void {
        const key = typeName + "_" + this.generatePromiseKey();
        this.getThreads().set(key, promise);
        promise.then(() => {
            this.getDelegates().getLogger().verbose("Promise resolved for " + typeName);
            this.removePromise(key);
        }).catch(() => this.removePromise(key));
    }

    // Method to remove a promise from the collection
    private removePromise(key: string): void {
        this.getThreads().delete(key);
    }

    abstract process(input: I): O;

    async go<P extends IProcessor<D, M, W, R>, W, R>(actionType: new (...args: any) => P, withParam?: W): Promise<R> {

        const result = new Promise<R>((resolve, reject) => {
            try {
                resolve(this.goSync(actionType, withParam));
            } catch (e) {
                this.getDelegates().getLogger().verbose("Failed to go to " + actionType.name + " with " + JSON.stringify(withParam));
                reject(e);
            }
        });

        this.addPromise(actionType.name, result);

        return result;

    }

    goSync<P extends IProcessor<D, M, W, R>, W, R>(actionType: { new(...args: any): P }, withParam?: W): R {
        this.getDelegates().getLogger().verbose("Going to " + actionType.name + " with " + JSON.stringify(withParam));
        return this.getHandler(actionType).process(withParam);
    }



    getThreads(): Map<String, Promise<any>> {
        if (this.getParent()) {
            this.getDelegates().getLogger().verbose("Getting threads from parent for " + this.constructor.name);
            return this.getParent()!.getThreads();
        } else {
            throw new Error("getThreads() method is expected to be overridden in the root ");
        }
    }

    getDelegates(): D {
        if (this.getParent()) {
            this.getDelegates().getLogger().verbose("Getting delegates from parent for " + this.constructor.name);
            return this.getParent()!.getDelegates();
        } else {
            throw new Error("getDelegates() method is expected to be overridden in the root ");
        }
    }

    getHandler<H extends IProcessor<D, M, I, O>, I, O>(clazz: new (...args: any[]) => H): H {
        if (this.getParent()) {
            this.getDelegates().getLogger().verbose(`getting parent of ${clazz.name}`);
            return this.getParent()!.getHandler(clazz);
        } else {
            throw new Error("getHandler() method is expected to be overridden in the root ");
        }
    }

    register(): void {

    }


    setParent(parent: IProcessor<D, M, unknown, unknown>): void {
        if (this.parent) {
            throw new Error("Parent is already set");
        }
        this.parent = parent;
    }

    getModel(): M {
        return this.model;
    }

    getParent(): IProcessor<D, M, unknown, unknown> | undefined {
        return this.parent;
    }
}


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