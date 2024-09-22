
import { CommandCenter, ICommandCenter } from "./ICommandCenter";
import { IHandler, IProcessor } from "./IProcessor";
import { IDelegates, IModel } from "./ccmodel";

export interface IWorkflowOrchestrator<D extends IDelegates, M extends IModel<D>>
    extends ICommandCenter<D, M, void>, IHandler<D, M> {
}

export abstract class WorkflowOrchestrator<D extends IDelegates, M extends IModel<D>>
    extends CommandCenter<D, M, void>

    implements IWorkflowOrchestrator<D, M> {

    private delegates: D;

    private registry: Map<string, any>;

    private threads: Map<string, Promise<any>> = new Map();
    getThreads(): Map<string, Promise<any>> {
        return this.threads;
    }

    constructor(model: M, delegates: D) {
        super(model);
        this.delegates = delegates;
        this.registry = new Map();
        this.register();
    }

    abstract handle(): void;

    getHandler<P extends IProcessor<D, M, any, any>>(clazz: new (...args: any[]) => P): P {
        try {
            if (this.registry.has(clazz.name)) {
                this.getDelegates().getLogger().verbose(`Accessing instance of ${clazz.name}`);
                return this.registry.get(clazz.name);
            }
            this.getDelegates().getLogger().verbose(`Creating instance of ${clazz.name}`);
            const newInstance = new clazz(this.getModel());
           
            newInstance.setParent(this);
            this.registry.set(clazz.name, newInstance);
            return newInstance;
        } catch (e) {
            throw new Error(`Failed to create instance of ${clazz.name}`);
        }
    }

    consume(input: void): void {
        this.handle();
    }

    getDelegates(): D {
        return this.delegates;
    }
    protected abstract getCommandCenters(): Array<{ new(): IProcessor<D, M, unknown, unknown> }>;

    getParent(): IProcessor<D, M, unknown, unknown> | undefined {
        return undefined;
    }

    getPreProcessors<T extends IProcessor<D, M, unknown, unknown>>(): Array<{ new(): T; }> {
        return this.getCommandCenters() as Array<{ new(): T; }>;
    }

    register(): void {
        this.getCommandCenters().forEach((clazz) => {
            this.getHandler(clazz);
        });
    }

    unregister(): void {
        this.registry.forEach((value, key) => {
            value.unregister();
        });
    }
}