<template>
    <div class="notebook">
        <div v-for="cell in model.cells" :key="keyOf(cell)"
                class="cell-container" :class="{focused: cell === this.focusedCell}"
                @focusin="focusedCell = cell">
            <cell :model="cell" ref="cells" @action="cellAction(cell, $event)"/>
        </div>
    </div>
</template>

<style>
.focused { border-left: 3px solid blue; margin-left: -3px; }
</style>

<script lang="ts">
import { Component, Vue, Prop, toNative } from 'vue-facing-decorator';
import { NotebookActions } from '../control';
import type { ModelImpl, Model as M } from '../model';
// @ts-ignore
import Cell from './cell.vue';

@Component({
    emits: ["cell:action"],
    components: { Cell }
})
class INotebook extends Vue {
    @Prop model: ModelImpl
    _keys: AutoIncMap<M.Cell>
    control: NotebookActions
    focusedCell: M.Cell = undefined

    created() {
        this._keys = new AutoIncMap;
        this.control = new NotebookActions(this.model);
    }

    cellAction(cell: M.Cell, action: {cell?: M.Cell, type: string}) {
        action = {cell, ...action};
        this.control.handleCellAction(action as NotebookActions.CellAction);
        switch (action.type) {
            case 'delete': this.cleanup(); break;
        }
        this.$emit('cell:action', action);
    }

    command(command: {command: string}) {
        if (this.focusedCell)
            this.cellAction(this.focusedCell, {type: command.command});
    }

    keyOf(cell: M.Cell) {
        return this._keys.getOrAlloc(cell);
    }

    /** Remove deleted cells from key map */
    cleanup() {
        let s = new Set(this.model.cells);
        let redundant = [...this._keys.keys()] .filter(k => !s.has(k));
        for (let k of redundant) this._keys.delete(k);

        if (!s.has(this.focusedCell)) this.focusedCell = undefined;
    }
}

/** Auxiliary for cell keys */
class AutoIncMap<K> extends Map<K, number> {
    _fresh = 0

    getOrAlloc(k: K) {
        let v = this.get(k);
        if (v === undefined)
            this.set(k, v = ++this._fresh);
        return v;
    }
}


export { INotebook }
export default toNative(INotebook);
</script>