<template>
    <div class="cell">
        <div class="cell--input-container">
            <div class="cell--input" ref="input"></div>
            <collapse-button :toggle="toggleCollapsed" :collapsed="collapsed" class="collapse-btn-extend"/>
        </div>
        <div class="cell--outputs" v-if="!collapsed">
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

//@ts-ignore
import CollapseButton from "./collapse-button/collapse-button.vue";

@Component({
    "emits": ['action'],
    components: {SpinnerAnim, CollapseButton}
})
class ICell extends Vue {
    @Prop model: any

    collapsed: boolean = false;

    editor: CodeEditor
    htmlMime = ['image/svg+xml', 'text/html']

    applications = ['application/vue3']

    $refs: { input: HTMLDivElement }

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
        this.$watch(() => this.model.outputs, v => {
            this.expand();
        })
        this.$watch(() => this.model.completions, v => {
            this.editor.completions = this.model.completions;
        })
    }

    updateModel() {
        this._isUpdating = true;
        this.model.input = this.editor.get();
        Promise.resolve().then(() => this._isUpdating = false);
    }

    focus() {
        this.editor.focus();
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }

    collapse() {
        this.collapsed = true;
    }

    expand(){
        this.collapsed = false;
    }
}

export {ICell}
export default toNative(ICell);
</script>

<style lang="scss" scoped>
.collapse-btn-extend {
    grid-area: btn;
    width: 3%;
}

.cell--input-container {
    display: grid;
    grid-template-columns: 3% auto;
    grid-template-areas: 'btn cell-input';
}

</style>