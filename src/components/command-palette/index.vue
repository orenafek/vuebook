<template>
    <Command :class="{open: this.isOpen}" theme="simple" class="root dialog-lightweight" @select-item="onSelect">
        <Command-Input ref="m" placeholder=">" />
        <Command-List>
            <Command-Empty>No results found.</Command-Empty>

            <Command-Item v-for="cmd in commands" :data-value="cmd">
                {{ cmd }}
            </Command-Item>
        </Command-List>
    </Command>           
</template>

<style scoped>
.root { display: none; }
.root.open {
    display: block;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, toNative } from 'vue-facing-decorator';
import { Command } from 'vue-command-palette';

@Component({
  components: { Command, 'Command-Input': Command.Input, 
    'Command-Item': Command.Item, 'Command-Group': Command.Group, 
    'Command-Empty': Command.Empty, 'Command-Separator': Command.Separator,
    'Command-List': Command.List }
})
class CommandPalette extends Vue {
    @Prop commands: string[]
    isOpen = false

    onSelect(e: {value: string}) {
        console.log(e);
    }

    open() {
        this.isOpen = true;
        requestAnimationFrame(() =>
        this.$refs.m.$refs.inputRef.focus());
    }

    close() { this.isOpen = false; }
}

export { CommandPalette as ICommandPalette }
export default toNative(CommandPalette)
</script>