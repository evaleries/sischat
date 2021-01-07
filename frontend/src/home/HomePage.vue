<template>
    <div class="main-wrapper container">
    <div class="navbar-bg"></div>
      <nav class="navbar navbar-expand-lg main-navbar d-flex justify-content-center">
        <router-link to="/" class="navbar-brand sidebar-gone-hide">SISCHAT</router-link>
        <ul class="navbar-nav navbar-right">
          <li class="dropdown"><a href="#" data-toggle="dropdown" class="nav-link dropdown-toggle nav-link-lg nav-link-user">
            <img alt="image" src="//demo.getstisla.com/assets/img/avatar/avatar-1.png" class="rounded-circle mr-1">
            <div class="d-sm-none d-lg-inline-block">Hi, {{user.username}}</div></a>
            <div class="dropdown-menu dropdown-menu-right">
              <div class="dropdown-title">Akun</div>
              <a href="#" class="dropdown-item has-icon">
                <i class="far fa-envelope"></i> {{user.email}}
              </a>
              <a href="#" class="dropdown-item has-icon">
                <i class="fas fa-male"></i> {{user.jenis_kelamin}}
              </a>
              <a href="#" class="dropdown-item has-icon">
                <i class="fas fa-map"></i> {{user.alamat}}
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" v-on:click="handleLogout" class="dropdown-item has-icon text-danger">
                <i class="fas fa-sign-out-alt"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      <!-- Main Content -->
      <div class="main-content">
        <section class="section">
          <div class="section-header">
            <h1>SISCHAT <small>an online free chatting</small></h1>
          </div>

          <div class="section-body">
            <h2 class="section-title">Chat Yuk!</h2>
            <p class="section-lead">Yuk chat dengan cara klik salah satu orang yang online.</p>

            <div class="row">
              <div class="col-4">
                <div class="card card-info">
                  <div class="card-header">
                    <h4>Who's Online?</h4>
                  </div>
                  <div class="card-body">
                    <div v-if="users.length > 1">
                        <ul class="list-unstyled list-unstyled-border">
                            <li class="media user-listing" v-for="onUser in users" :key="onUser.id" v-show="onUser._id != user._id" @click="getConversations(onUser)">
                                <img alt="image" class="mr-3 rounded-circle" width="50" src="//demo.getstisla.com/assets/img/avatar/avatar-3.png">
                                <div class="media-body">
                                <div class="mt-0 mb-1 font-weight-bold">{{onUser.username}}</div>
                                <div class="text-success text-small font-600-bold"><i class="fas fa-circle"></i> Online</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <p>Tidak ada user yang online</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-8 chat-box-right">
                <div class="card chat-box card-primary" id="mychatbox">
                  <div class="card-header">
                    <h4>Chat <span v-show="hasActiveConversation && talkingTo.username">{{talkingTo.username}}</span></h4>
                  </div>
                  <div class="card-body chat-content shadow-lg" tabindex="2" style="overflow: hidden; outline: none;">
                        <div v-for="conversation in conversations" :key="conversation._id">
                            <div class="chat-item" :class="{
                                'chat-left': (conversation.receiver._id && conversation.receiver._id == talkingTo._id) || conversation.receiver == talkingTo._id, 
                                'chat-right': (conversation.sender._id && conversation.sender._id == user._id) || conversation.sender == user._id
                                }" style="">
                                <img :src="conversation.receiver._id === talkingTo._id ? '//demo.getstisla.com/assets/img/avatar/avatar-1.png' : '//demo.getstisla.com/assets/img/avatar/avatar-3.png'">
                                <div class="chat-details">
                                    <p class="py-0 my-0 font-weight-bold">{{conversation.sender.username}}</p>
                                    <div v-if="!conversation.is_retracted" class="chat-text">
                                        {{conversation.content}}
                                    </div>
                                    <div v-if="conversation.is_retracted" class="chat-text">
                                        <em>{{conversation.content}}</em>
                                    </div>
                                    
                                    <div class="chat-time">
                                        {{conversation.createdAt | moment('from') }} 
                                        <span class="control" v-show="conversation.sender._id == user._id"> 
                                            <span class="btn btn-xs btn-outline-danger" v-show="!conversation.is_retracted" title="Tarik Pesan" @click="retractMessage(conversation)"><i class="fas fa-times"></i></span>
                                            <span class="btn btn-xs btn-outline-danger" @click="deleteMessage(conversation)" title="Hapus Pesan"><i class="fas fa-trash"></i></span> 
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-show="hasActiveConversation && typing" class="chat-item chat-left chat-typing">
                            <img src="//demo.getstisla.com/assets/img/avatar/avatar-3.png">
                            <div class="chat-details">
                                <div class="chat-text"></div>
                            </div>
                        </div>
                        <div v-show="conversations && conversations.length < 1">
                            <div class="empty-state h-100 my-5" data-height="500px">
                                <div class="empty-state-icon">
                                    <i class="fas fa-comment"></i>
                                </div>
                                <h2>Yuk mulai chat sekarang</h2>
                                <p class="lead">
                                    Klik pada salah satu pengguna online untuk memulai chat.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer chat-form" v-show="hasActiveConversation">
                        <form @submit.prevent="sendMessage">
                            <input type="text" v-on:keyup="startTyping" class="form-control chat-box-message" v-model="chatbox" placeholder="Type a message">
                            <button  class="btn btn-primary" :class="{disabled: sending}">
                                <i class="far fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            userWhoTyping: null,
            typing: false,
            hasActiveConversation: false,
            talkingTo: {},
            sending: false,
            chatbox: ''
        }
    },
    computed: {
        user () {
            return this.$store.state.authentication.user;
        },
        users () {
            return this.$store.state.users.all;
        },
        conversations () {
            return JSON.parse(JSON.stringify(this.$store.state.users.conversations));
        }
    },
    sockets: {
        connect: function () {
            console.log('socket connected');
        },
        ALL_ONLINE_USERS: function (data) {
            this.$store.state.users.all = data;
        },
        DISCONNECT: function (data) {
            this.$store.state.users.all = data;
        },
        NEW_MESSAGE: function (data) {
            if ((data.sender._id == this.user._id && data.receiver._id == this.talkingTo._id) || (data.sender._id == this.talkingTo._id && data.receiver._id == this.user._id)) {
                let tmp = this.conversations;
                tmp.push(data);
                this.$store.state.users.conversations = tmp;
            }
            if (!this.hasActiveConversation) this.getConversations(data.sender);
            this.playAudio();
        },
        REFRESH_MESSAGE: function () {
            this.getConversations(this.talkingTo);
        },
        START_TYPING: function (data) {
            if ((data.from._id == this.user._id && data.to._id == this.talkingTo._id) || (data.from._id == this.talkingTo._id && data.to._id == this.user._id)) {
                this.typing = true;
                this.userWhoTyping = data.from
            }
        },
        STOP_TYPING: function (data) {
            this.typing = false;
        }
    },
    mounted () {
        let scripts = [
            'https://demo.getstisla.com/assets/modules/jquery.min.js',
            'https://demo.getstisla.com/assets/modules/popper.js',
            'https://demo.getstisla.com/assets/modules/bootstrap/js/bootstrap.min.js',
            'https://demo.getstisla.com/assets/modules/nicescroll/jquery.nicescroll.min.js',
            'https://demo.getstisla.com/assets/js/stisla.js',
            'https://demo.getstisla.com/assets/js/scripts.js',
        ];

        scripts.forEach((src, i) => {
            let externalScript = document.createElement('script')
            externalScript.setAttribute('src', src);
            externalScript.setAttribute('defer', true);
            externalScript.setAttribute('type', 'application/javascript');
            document.head.appendChild(externalScript)
        });

        this.$socket.emit('NEW_USER', this.user);
        this.$socket.emit('ALL_ONLINE_USERS');
        window.addEventListener('beforeunload', this.exitSocket)
    },
    updated () {
        if (this.hasActiveConversation) {
            this.scrollToEnd();
        }
    },
    methods: {
        handleLogout(e) {
            this.exitSocket();
            this.$router.push({name: 'login'})
        },
        getConversations (user) {
            this.$store.dispatch('users/getConversations', user._id);
            this.openChat(user);
        },
        openChat (user) {
            this.hasActiveConversation = true;
            this.talkingTo = user;
            this.$el.querySelector('.chat-form').focus();
        },
        sendMessage () {
            this.$store.dispatch('alert/clear', null);
            if (this.chatbox == '') {
                this.$store.dispatch('alert/error', 'Pesan harus diisi.', {root: true})
            }
            this.sending = !this.sending;
            this.$socket.emit('SEND_MESSAGE', {from: this.user, to: this.talkingTo, messageContent: this.chatbox});
            this.chatbox = '';
            this.sending = !this.sending;
            this.typing = false;
        },
        retractMessage (message) {
            this.$socket.emit('RETRACT_MESSAGE', {sender: this.user, receiver: this.talkingTo, targetMessage: message});
        },
        deleteMessage (message) {
            this.$socket.emit('DELETE_MESSAGE', {sender: this.user, receiver: this.talkingTo, targetMessage: message});
        },
        scrollToEnd () {
            let container = this.$el.querySelector('.chat-content');
            container.scrollTop = container.scrollHeight;
        },
        startTyping(e) {
            if (!this.talkingTo._id) return;
            this.$socket.emit('START_TYPING', {from: this.user, to: this.talkingTo});
            if (e.which == 13 || this.chatbox == '') {
                this.$socket.emit('STOP_TYPING', {from: this.user, to: this.talkingTo});
            }
        },
        exitSocket() {
            this.$socket.emit('DISCONNECT', this.user);
        },
        playAudio () {
            let audio = new Audio('http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3');
            if (audio) audio.play();
        }
    }
};
</script>

<style scoped>
.main-content {
    padding-top: 80px !important;
}
.chat-box-right {
    height: 90vh;
}

.chat-box {
    height: 80% !important;
    overflow-y: auto;
    overflow-x: hidden;
}
.chat-form {
    height: 10%
}
.user-listing:hover {
    cursor: pointer;
}
</style>
