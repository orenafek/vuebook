<template>
    <notebook :model="model"/>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { Component, Vue, toNative } from 'vue-facing-decorator';

import { NotebookActions } from '../control';
import { ModelImpl } from '../notebook_model';
import Notebook from './notebook.vue';

@Component({
  components: { Notebook }
})
class App extends Vue {
    model: ModelImpl
    control: NotebookActions

    created() {
        this.model = reactive(new ModelImpl()).load();
        window.addEventListener('beforeunload', () => this.model.save());
    }
}

export default toNative(App);
</script>