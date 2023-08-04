import { createApp } from 'vue';
// @ts-ignore
import AppComponent from './components/app.vue';

function main() {
    let app = createApp(AppComponent).mount(document.querySelector('#app'));

    Object.assign(window, {app});
}

document.addEventListener('DOMContentLoaded', main);