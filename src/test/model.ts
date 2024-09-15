import { ICommandCenterDelegates, ICommandCenterModel } from "../ccmodel";

 

export interface IA2ANodeServerCCModel extends ICommandCenterModel<A2ANodeServerDelegates> {
}

export interface IA2ANodeServerDelegates extends ICommandCenterDelegates {

}

export class A2ANodeServerCCModel implements IA2ANodeServerCCModel {
    getModel(): this {
        return this;
    }
}

export class A2ANodeServerDelegates implements IA2ANodeServerDelegates {
    getDelegates(): this {
        return this;
    }
}
