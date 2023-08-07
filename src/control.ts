import { ModelImpl, Model as M } from './model';


class NotebookActions {

    model: ModelImpl

    constructor(model: ModelImpl) {
        this.model = model;
    }

    handleCellAction(action: NotebookActions.CellAction) {
        switch (action.type) {
            case 'exec':
            case 'exec-fwd':
                this.model.clearOutputs(action.cell);
                break;
            case 'insert-after':
                this.model.insert(action.cell, this.model.mkCodeCell(), true);
                break;
            case 'delete':
                this.model.delete(action.cell);
                break;
            default:
                console.warn(action)
        }
    }    
}


namespace NotebookActions {
    export interface CellAction {
        type: string
        cell: M.Cell
    }
}


export { NotebookActions }