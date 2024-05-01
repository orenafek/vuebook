<template>
    <button ref="btn" @click="submitAction" :style="{minWidth}">
        <span class="caption" :class="{isLoading}"><slot></slot></span>
        <spinner-anim v-if="isLoading" class="spinner-anim"/>
    </button>
</template>

<script lang="ts">
// @ts-ignore
import SpinnerAnim from './spinner-anim.vue';
import {Component, Prop, toNative, Vue} from "vue-facing-decorator";

@Component({components: {SpinnerAnim}, 'emits': ['loadingButtonClick']})
class LoadingSpinner extends Vue {

    @Prop
    isLoading: Boolean

    minWidth: string

    $refs: { btn: HTMLButtonElement }

    mounted() {
        this.minWidth = `${this.$refs.btn.getBoundingClientRect().width}px`;
    }

    async submitAction() {
        this.$emit('loadingButtonClick');
    }
}

export default toNative(LoadingSpinner);
</script>

<style lang="scss" scoped>
button {
    padding-top: 0;
    padding-bottom: 0;
    height: 23px;
}

span.caption.isLoading {
    display: none;
}

.spinner-anim {
    --size: 20px;
    display: inline-block;
    vertical-align: middle
}
</style>