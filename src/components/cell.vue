<template>
    <div class="cell">
        <div class="cell--input" ref="input"></div>
        <div class="cell--outputs">
            <spinner-anim v-if="model.loading" style="--size: 20px; display: inline-block; vertical-align: middle"/>
            <div class="cell--output" v-for="out in model.outputs" :data-kind="out.kind">
                <div v-if="htmlMime.includes(out.kind)"
                     class="payload image" v-html="out.payload"></div>
                <div v-else-if="applications.includes(out.kind)">
                    <component :is="out.payload.is" v-bind="out.payload.props"></component>
                </div>
                <div v-else class="payload">{{ out.payload }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, toNative, Vue} from 'vue-facing-decorator';
import {CodeEditor} from './editor';


// @ts-ignore
import SpinnerAnim from "./loading-spinner/spinner-anim.vue";

@Component({
    "emits": ['action'],
    components: {SpinnerAnim}
})
class ICell extends Vue {
    @Prop model: any
    editor: CodeEditor
    htmlMime = ['image/svg+xml', 'text/html']

    applications = ['application/vue3']

    $refs: { input: HTMLDivElement}

    private _isUpdating = false

    mounted() {
        this.editor = new CodeEditor(this.$refs.input, this.model.input);
        this.editor.on('change', () => this.updateModel());
        this.editor.on('action', a => this.$emit('action', a));
        this.$watch(() => this.model.input, v => {
            if (!this._isUpdating) {
                this.editor.set(v);
            }
        });
    }

    updateModel() {
        this._isUpdating = true;
        this.model.input = this.editor.get();
        Promise.resolve().then(() => this._isUpdating = false);
    }

    focus() {
        this.editor.focus();
    }
}

export {ICell}
export default toNative(ICell);
</script>