import { createApp } from 'vue';
// @ts-ignore
import AppComponent from './components/app.vue';

import './index.scss';
import './components/command-palette/index.scss';
import './components/command-palette/themes/simple.scss';


function main() {
    let app = createApp(AppComponent).mount(document.querySelector('#app'));

    Object.assign(window, {app});
}

document.addEventListener('DOMContentLoaded', main);