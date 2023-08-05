<template>
    <div class="notebook">
        <div v-for="cell in model.cells" :key="key(cell)">
            <cell :model="cell" ref="cells" @action="cellAction(cell, $event)"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, toNative } from 'vue-facing-decorator';
import { NotebookActions } from '../control';
import type { ModelImpl, NotebookApp } from '../notebook_model';
// @ts-ignore
import Cell from './cell.vue';

@Component({
    emits: ["cell:action"],
    components: { Cell }
})
class Notebook extends Vue {
    @Prop model: ModelImpl
    _keys: Map<NotebookApp.Cell, number>
    control: NotebookActions

    created() {
        this._keys = new Map;
        this.control = new NotebookActions(this.model);
    }

    cellAction(cell: NotebookApp.Cell, action) {
        action = {cell, ...action};
        this.control.handleCellAction(action);
        this.$emit('cell:action', action);
    }

    key(cell: NotebookApp.Cell) {
        let v = this._keys.get(cell);
        if (v === undefined) {
            v = Math.max(0, ...this._keys.values()) + 1;
            this._keys.set(cell, v);
        }
        return v;
    }
}

export default toNative(Notebook);
</script>