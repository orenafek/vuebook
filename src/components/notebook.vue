<template>
    <div class="notebook">
        <div v-for="cell in model.cells" :key="key(cell)">
            <cell :model="cell" ref="cells" @action="cellAction(cell, $event)"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, toNative } from 'vue-facing-decorator';
import type { NotebookApp } from '../notebook_model';
// @ts-ignore
import Cell from './cell.vue';

@Component({
    components: { Cell }
})
class Notebook extends Vue {
    @Prop model: NotebookApp.Model
    _keys: Map<NotebookApp.Cell, number>

    created() {
        this._keys = new Map;
    }

    cellAction(cell: NotebookApp.Cell, action) {
        this.$emit('cell:action', {cell, ...action});
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