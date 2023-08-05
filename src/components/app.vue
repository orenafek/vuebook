<template>
    <notebook :model="model"/>
</template>

<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';
import { NotebookApp } from '../notebook_model';
import Notebook from './notebook.vue';

@Component({
  components: { Notebook }
})
class App extends Vue {
    model: NotebookApp.Model

    created() {
        this.model = {cells: [{kind: 'code', input: 'abc'}]};
    }
}

export default toNative(App);
</script>