import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import config from 'config';

import { store } from './_store';
import { router } from './_helpers';
import App from './App';

const moment = require('moment')
require('moment/locale/id');

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO(config.apiUrl),
    vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_"
    }
}));

Vue.use(require('vue-moment'), {
    moment
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
