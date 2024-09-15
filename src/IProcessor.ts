
import { ICommandCenterDelegates, ICommandCenterModel }from "./ccmodel";


export interface IProcessor<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>, I, O> {
     
    process(input: I | undefined): O;
    getThreads(): Promise<any>[];
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


    abstract process(input: I): O;

    async go<P extends IProcessor<D, M, W, R>, W, R>(actionType: new (...args: any) => P, withParam?: W): Promise<R> {
        try {
            const result = await new Promise<R>((resolve, reject) => {
                resolve(this.goSync(actionType, withParam));
            });
            this.getThreads().push(Promise.resolve(result));
            return result;
        } catch (e) {
            console.error(e);
            return Promise.reject(null);
        }
    }

    goSync<P extends IProcessor<D, M, W, R>, W, R>(actionType: { new(...args: any): P }, withParam?: W): R {
        return this.getHandler(actionType).process(withParam);
    }



    getThreads(): Promise<any>[] {
        if (this.getParent()) {
            return this.getParent()!.getThreads();
        } else {
            throw new Error("getThreads() method is expected to be overridden in the root ");
        }
    }

    getDelegates(): D {
        if (this.getParent()) {
            return this.getParent()!.getDelegates();
        } else {
            throw new Error("getDelegates() method is expected to be overridden in the root ");
        }
    }

    getHandler<H extends IProcessor<D, M, I, O>, I, O>(clazz: new (...args: any[]) => H): H {
        if (this.getParent()) {
            return this.getParent()!.getHandler(clazz);
        } else {
            throw new Error("getHandler() method is expected to be overridden in the root ");
        }
    }

    register(): void {

    }


    setParent(parent: IProcessor<D, M, unknown, unknown>): void {
        if(this.parent) {
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


