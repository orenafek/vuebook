<template>
    <div>
        <command-palette ref="cmd" :commands="commands"/>
        <notebook :model="model"/>
    </div>
</template>

<script lang="ts">
import { reactive, watch } from 'vue';
import { Component, Vue, toNative } from 'vue-facing-decorator';
import { useMagicKeys } from '@vueuse/core';

import { NotebookActions } from '../control';
import { ModelImpl } from '../notebook_model';
import Notebook from './notebook.vue';
import CommandPalette, { ICommandPalette } from './command-palette/index.vue';

@Component({
  components: { Notebook, CommandPalette }
})
class App extends Vue {
    model: ModelImpl
    control: NotebookActions

    commands = ["insert-before", "insert-after", "delete", "clear"]

    $refs: {cmd: ICommandPalette}

    created() {
        this.model = reactive(new ModelImpl()).load();
        window.addEventListener('beforeunload', () => this.model.save());

        const keys = useMagicKeys()
        watch(keys['Meta+K'], (v) => v && this.$refs.cmd.open());
        watch(keys['Escape'], (v) => v && this.$refs.cmd.close());
    }
}

export default toNative(App);
</script>