
import { CommandCenterAction, DataAction, ICommandCenterAction } from '../IAction.js';
import { CommandCenter } from '../ICommandCenter.js';
import { WorkflowOrchestrator } from '../IWorkflowOrchestrator.js';
import { A2ANodeServerCCModel, A2ANodeServerDelegates, IA2ANodeServerDelegates } from './model.js';

export class A2ANodeServerWO extends WorkflowOrchestrator<IA2ANodeServerDelegates, A2ANodeServerCCModel> {

    protected getCommandCenters(): (new () => ICommandCenterAction<A2ANodeServerDelegates, A2ANodeServerCCModel, unknown>)[] {
        return [];
    }

    handle(): void {
        this.go(A2AInitServerAction, 0)
        console.log('A2ANodeServerWO-Done!');
    }

    constructor(delegates: A2ANodeServerDelegates) {
        super(new A2ANodeServerCCModel(), delegates);
    }

}

export class A2ANodeServerCommandCenter extends CommandCenter<A2ANodeServerDelegates, A2ANodeServerCCModel, unknown> {
    getProcessors(): (new () => CommandCenterAction<A2ANodeServerDelegates, A2ANodeServerCCModel, unknown>)[] {
        return [];
    }

    consume(input: unknown): void {
    }
}

export class A2AInitServerAction extends DataAction<A2ANodeServerDelegates, A2ANodeServerCCModel, number, number> {
    process(input: number): number {
        console.log('Init Server done!');
        return input;
    }
}

export class A2AInitClientNodeAction extends DataAction<A2ANodeServerDelegates, A2ANodeServerCCModel, unknown, unknown> {
    process(input: unknown): unknown {
        return input;
    }
}
