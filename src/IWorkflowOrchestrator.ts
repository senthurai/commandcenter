
import { ICommandCenterAction } from "./IAction";
import { CommandCenter, ICommandCenter } from "./ICommandCenter";
import { IHandler, IProcessor } from "./IProcessor";
import { ICommandCenterDelegates, ICommandCenterModel } from "./ccmodel";

export interface IWorkflowOrchestrator<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>>
    extends ICommandCenter<D, M, ICommandCenterAction<D, M, any>, void>, IHandler<D, M> {
}

export abstract class WorkflowOrchestrator<D extends ICommandCenterDelegates, M extends ICommandCenterModel<D>>
    extends CommandCenter<D, M, ICommandCenterAction<D, M, any>, void>

    implements IWorkflowOrchestrator<D, M> {

    private delegates: D;

    private registry: Map<new (...args: any[]) => IProcessor<D, M, any, any>, any>;

    private threads: Map<string, Promise<any>> = new Map();
    getThreads(): Map<string, Promise<any>> {
        return this.threads;
    }

    constructor(model: M, delegates: D) {
        super(model);
        this.delegates = delegates;
        this.registry = new Map();
    }

    abstract handle(): void;

    getHandler<P extends IProcessor<D, M, any, any>>(clazz: new (...args: any[]) => P): P {
        try {
            if (this.registry.has(clazz)) {
                this.getDelegates().getLogger().verbose(`Accessing instance of ${clazz.name}`);
                return this.registry.get(clazz);
            }
            this.getDelegates().getLogger().verbose(`Creating instance of ${clazz.name}`);
            const newInstance = new clazz();
            newInstance.setParent(this);
            newInstance.register();
            this.registry.set(clazz, newInstance);
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
    protected abstract getCommandCenters(): (new () => ICommandCenterAction<D, M, unknown>)[];

    getParent(): IProcessor<D, M, unknown, unknown> | undefined {
        return undefined;
    }
    getProcessors(): (new () => ICommandCenterAction<D, M, unknown>)[] {
        return this.getCommandCenters();
    }
}