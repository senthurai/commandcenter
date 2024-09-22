import { LogDelegate } from "./LogDelegate";
export interface IModel<D extends IDelegates> {

    /**
     *  This method is used as marker to identify the model. 
     *  Typescript removes the interface from the compiled code, so this method is used to identify the model.
     *  this method will not be called by the framework, declared for the typescript to validate the boundaries.
     *  Implementation can be as simple as:
     *  getModel(): this {
     *        return this;
     *  }
     */
    getModel(): this;

}

export interface IDelegates {
    getLogger(): LogDelegate;
    /**
     * This method is used as marker to identify the delegates.
     * Typescript removes the interface from the compiled code, so this method is used to identify the delegates.
     * this method will not be called by the framework, declared for the typescript to validate the boundaries.
     * Implementation can be as simple as:
     * getDelegates(): this {
     *        return this;
     *  }
     */
    getDelegates(): this;
}
 

