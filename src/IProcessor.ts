
import { IDelegates, IModel } from "./ccmodel";
import { LogDelegate } from "./LogDelegate";


export interface IProcessor<D extends IDelegates, M extends IModel<D>, I, O> {
    readonly model: M;
    process(input: I | undefined): O;
    getThreads(): Map<String, Promise<any>>;
    go<P extends IProcessor<D, M, W, R>, W extends any, R extends any>(actionType: new (...args: any) => P, input?: W): Promise<R>;
    goSync<P extends IProcessor<D, M, W, R>, W extends any, R extends any>(actionType: { new(...args: any[]): P }, input?: W): R;
    getDelegates(): D;
    getHandler<H extends IProcessor<D, M, I, O>, I, O>(clazz: { new(...args: any[]): H }): H;
    getModel(): M;
    getParent(): IProcessor<D, M, any, any> | undefined;
    setParent(parent: IProcessor<D, M, any, any> | undefined): void;
    getPreProcessors<T extends IProcessor<D, M, any, any>>(): Array<{ new(): T }>;
}


export abstract class AProcessor<D extends IDelegates, M extends IModel<D>, I, O> implements IProcessor<D, M, I, O> {
    readonly model: M;
    private logger: LogDelegate | undefined;
    constructor(model: M) {
        this.model = model;
        this.getPreProcessors().forEach(p => this.getHandler(p));
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
            this.getLogger().verbose("Promise resolved for " + typeName);
            this.removePromise(key);
        }).catch(() => this.removePromise(key));
    }

    private getLogger() {

        return this.logger || (this.logger = this.getDelegates().getLogger());
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
                this.getLogger().verbose("Failed to go to " + actionType.name + " with " + JSON.stringify(withParam));
                reject(e);
            }
        });

        this.addPromise(actionType.name, result);

        return result;

    }
    getPreProcessors<T extends IProcessor<D, M, any, any>>(): Array<{ new(): T; }> {
        return [];
    }

    goSync<P extends IProcessor<D, M, W, R>, W, R>(actionType: { new(...args: any): P }, withParam?: W): R {
        // Log the action type and parameters for debugging purposes
        this.getLogger().verbose(`Attempting to process ${actionType.name} with parameters: ${JSON.stringify(withParam)}`);

        try {
            // Ensure withParam is defined or set a default value
            const params = withParam || {} as W; // Adjust default value as necessary
            // Process the action and return the result
            const result: R = this.getHandler(actionType).process(params);
            // Log successful processing
            this.getLogger().verbose(`${actionType.name} processed successfully.`);
            return result;
        } catch (e: any) {
            // Log and rethrow the error for further handling
            this.getLogger().error(`Error processing ${actionType.name}: ${e.message}`);
            throw e;
        }
    }



    getThreads(): Map<String, Promise<any>> {
        if (this.getParent()) {
            this.getLogger().verbose("Getting threads from parent for " + this.constructor.name);
            return this.getParent()!.getThreads();
        } else {
            throw new Error("getThreads() method is expected to be overridden in the root ");
        }
    }

    getDelegates(): D {
        if (this.getParent()) {
            const delegates = this.getParent()!.getDelegates();
            console.log("getting delegates from parent of " + this.constructor.name);
            return delegates;
        } else {
            throw new Error("getDelegates() method is expected to be overridden in the root ");
        }
    }

    getHandler<H extends IProcessor<D, M, I, O>, I, O>(clazz: new (...args: any[]) => H): H {
        if (this.getParent()) {
            this.getLogger().verbose(`getting parent of ${clazz.name}`);
            return this.getParent()!.getHandler(clazz);
        } else {
            throw new Error("getHandler() method is expected to be overridden in the root ");
        }
    }



    setParent(parent: IProcessor<D, M, any, any>): void {
        if (this.parent) {
            throw new Error("Parent is already set");
        }
        this.parent = parent;
    }

    getModel(): M {
        return this.model;
    }

    getParent(): IProcessor<D, M, any, any> | undefined {
        return this.parent;
    }
}


export interface IConsumer<D extends IDelegates, M extends IModel<D>, C> extends IProcessor<D, M, C, void> {
    consume(input: C): void;
}

export abstract class AConsumer<D extends IDelegates, M extends IModel<D>, C> extends AProcessor<D, M, C, void> implements IConsumer<D, M, C> {
    constructor(model: M) {
        super(model);
    }
    abstract consume(input: C): void;
    process(input: C): void {
        this.consume(input);
    }
}


export interface IProducer<D extends IDelegates, M extends IModel<D>, O> extends IProcessor<D, M, void, O> {
    produce(): O;
}

export abstract class AProducer<D extends IDelegates, M extends IModel<D>, O> extends AProcessor<D, M, void, O> implements IProducer<D, M, O> {
    constructor(model: M) {
        super(model);
    }
    abstract produce(): O;
    process(input: void): O {
        return this.produce();
    }
}
export interface IHandler<D extends IDelegates, M extends IModel<D>> extends IConsumer<D, M, void> {
    handle(): void;

    consume(input: void): void;
}

export abstract class AHandler<D extends IDelegates, M extends IModel<D>> extends AProcessor<D, M, void, void> implements IHandler<D, M> {
    constructor(model: M) {
        super(model);
    }
    abstract handle(): void;
    consume(input: void): void {
        this.handle();
    }
}