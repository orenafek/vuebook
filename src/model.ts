import {LocalStore, Serialization} from './infra/store';

namespace Model {
    export interface Notebook {
        cells: Cell[]
    }

    export interface Cell {
        kind: string
        input: string
        outputs?: Output[]
    }

    export interface Output {
        /** text, HTMl, etc. */
        /** TODO: Change to an Or of types. */
        kind: string
        payload: string
    }

    /**
     * Converts between a model and `.ipynb` JSON format
     */
    export class IpynbConverter implements Serialization<Notebook> {
        metadata: any = {
            "kernelspec": {
                "display_name": "Python 3 (ipykernel)",
                "language": "python",
                "name": "python3"
            }
        }
        version = [4, 4]
        options = {indent: 1}

        parse(s: string): Notebook {
            throw new Error('Method not implemented.');
        }

        stringify(d: Notebook): string {
            return JSON.stringify(this.toJSON(d), null, this.options.indent);
        }

        toJSON(model: Notebook) {
            return {
                cells: model.cells.map(cell => ({
                    cell_type: cell.kind,
                    metadata: {},
                    outputs: [],
                    source: this.lines(cell.input)
                })),
                metadata: this.metadata,
                nbformat: this.version[0],
                nbformat_minor: this.version[1]
            };
        }

        lines(s: string) {
            return [...s.matchAll(/.*\n|.+$/g)].map(mo => mo[0]);
        }
    }
}

class ModelImpl implements Model.Notebook {
    cells: Model.Cell[]

    store = new LocalStore<Model.Notebook>('untitled')

    load() {
        return this.from(this.store.load());
    }

    save() {
        this.store.save({cells: this.cells});
    }

    from(json?: { cells?: Model.Cell[] }) {
        this.cells = json?.cells ?? [this.mkCodeCell()];
        return this;
    }

    clearOutputs(cell: Model.Cell) {
        cell.outputs = [];
    }

    insert(at: Model.Cell | number, newCell: Model.Cell,
           after: boolean = false) {
        if (typeof at !== 'number') {
            at = this.cells.indexOf(at);
            if (at < 0) this.cells.length;
            else if (after) at++;
        }
        this.cells.splice(at, 0, newCell);
    }

    delete(cell: Model.Cell) {
        let at = this.cells.indexOf(cell);
        if (at >= 0) this.cells.splice(at, 1);
    }

    mkCodeCell(code: string = ''): Model.Cell {
        return {
            kind: 'code',
            input: code,
            outputs: []
        };
    }

    addResult(cell: Model.Cell, result: IMimeBundle) {
        let viewable = ['image/svg+xml', 'text/html', 'text/plain'];
        for (let kind of viewable) {
            let payload = result[kind];
            if (typeof payload === 'string') {
                cell.outputs.push({kind, payload})
                break;
            }
        }
    }

    addError(cell: Model.Cell, error: string) {
        cell.outputs.push({kind: 'error', payload: error});
    }

    writeOutput(cell: Model.Cell, text: string) {
        cell.outputs ??= [];
        let term = cell.outputs.find(o => o.kind === 'term');
        if (!term) cell.outputs.push(term = {kind: 'term', payload: ''});
        term.payload += text;
    }
}


type IMimeBundle = { [kind: string]: any }


export {Model, ModelImpl}