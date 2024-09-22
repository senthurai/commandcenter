
import { CommandCenterAction, DataAction, ICommandCenterAction } from '../IAction';
import { CommandCenter } from '../ICommandCenter';
import { AProcessor } from '../IProcessor';
import { WorkflowOrchestrator as Workflow } from '../IWorkflowOrchestrator';
import { A2ANodeServerCCModel, A2ANodeServerDelegates, IA2ANodeServerDelegates } from '../model';

export class SudokuWorkflow extends Workflow<IA2ANodeServerDelegates, A2ANodeServerCCModel> {

    protected getCommandCenters(): (new () => ICommandCenterAction<A2ANodeServerDelegates, A2ANodeServerCCModel, unknown>)[] {
        return [];
    }

    handle(): void {
        const data: number[][] = this.goSync(SudokuProcessor, [[1, -1, -1], [-1, -1, 2], [2, -1, -1]]);
        data.forEach((element: number[]) => {
            console.log(element);
        });

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

export class SudokuProcessor extends AProcessor<A2ANodeServerDelegates, A2ANodeServerCCModel, number[][], number[][]> {
    process(input: number[][]): number[][] {
        this.getModel().setInput(input);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (input[i][j] === -1) {
                    let possibleValues = [1, 2, 3];
                    for (let k = 0; k < 3; k++) {
                        let notExist = this.goSync(CheckValueProcessor, new Point(true, i, k, possibleValues[k]));
                        if (notExist) {
                            this.goSync(UpdateValueProcessor, new Point(true, i, k, possibleValues[k]));
                        }
                        notExist = this.goSync(CheckValueProcessor, new Point(false, k, i, possibleValues[k]));
                        if (notExist) {
                            this.goSync(UpdateValueProcessor, new Point(false, k, i, possibleValues[k]));
                        }
                    }
                }
            }
        }
        return this.getModel().getInput();
    }
}
export class Point {
    row: boolean
    x: number;
    y: number;
    value: number;
    constructor(row: boolean, x: number, y: number, value: number) {
        this.row = row;
        this.x = x;
        this.y = y;
        this.value = value;
    }
}

export class UpdateValueProcessor extends DataAction<A2ANodeServerDelegates, A2ANodeServerCCModel, Point, void> {
    process(input: Point): boolean {
        let sudoku = this.getModel().getInput();
        if (input.row) {
            sudoku[input.x][input.y] = input.value;
        } else {
            sudoku.forEach((row) => {
                row[input.x] = input.value;
            });
        }
        return true;
    }
}

export class CheckValueProcessor extends DataAction<A2ANodeServerDelegates, A2ANodeServerCCModel, Point, boolean> {

    process(input: Point): boolean {
        let sudoku = this.getModel().getInput();
        if (input.row) {
            return !sudoku[input.x].includes(input.y);
        } else {
            return !sudoku.map((row) => row[input.x]).includes(input.y);
        }
    }
}

export class ExtractLineAction extends DataAction<A2ANodeServerDelegates, A2ANodeServerCCModel, Point, number[]> {
    process(input: Point): number[] {
        let sudoku = this.getModel().getInput();
        if (input.row) {
            return sudoku[input.x];
        } else {
            return sudoku.map((row, i) => sudoku[i][input.x]);
        }
    }

}