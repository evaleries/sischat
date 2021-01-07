<template>
    <section class="section">
        <div class="container">
            <div class="row">
                <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                     <div class="login-brand">
                        <span>SISCHAT - B</span>
                    </div>
                    <div class="card card-primary">
                    <div class="card-header"><h4>Daftar</h4></div>

                    <div class="card-body">
                        <form @submit.prevent="handleSubmit">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" v-model="username" name="username" class="form-control" :class="{ 'is-invalid': submitted && !username }" />
                                <div v-show="submitted && !username" class="invalid-feedback">Username harus diisi</div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" v-model="email" name="email" class="form-control" :class="{ 'is-invalid': submitted && !email }" />
                                <div v-show="submitted && !email" class="invalid-feedback">Email harus diisi</div>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" v-model="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />
                                <div v-show="submitted && !password" class="invalid-feedback">Password harus diisi</div>
                            </div>
                            <div class="form-group">
                                <label for="jenis_kelamin">Jenis Kelamin</label>
                                <select name="jenis_kelamin" id="jenis_kelamin" class="form-control" v-model="jenis_kelamin" :class="{ 'is-invalid': submitted && !jenis_kelamin }">
                                    <option value="-1">Pilih</option>
                                    <option value="L">Laki-Laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                <div v-show="submitted && !jenis_kelamin" class="invalid-feedback">Jenis Kelamin harus diisi</div>
                            </div>
                            <div class="form-group">
                                <label for="alamat">Alamat</label>
                                <textarea name="alamat" id="alamat" rows="5" v-model="alamat" class="form-control" :class="{ 'is-invalid': submitted && !alamat }"></textarea>
                                <div v-show="submitted && !alamat" class="invalid-feedback">Alamat harus diisi</div>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-block" :disabled="loggingIn">Daftar</button>
                                <img v-show="loggingIn" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            </div>
                            <hr>
                            <p class="text-center">Sudah punya akun?</p>
                            <div class="form-group">
                                <button type="button" v-on:click="handleLogin" class="btn btn-outline-info btn-block">Login Sekarang</button>
                            </div>
                        </form>
                    </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style scoped>
.container {
    margin-top: 1em;
}
</style>

<script>
import { router } from '../_helpers';
export default {
    data () {
        return {
            username: '',
            password: '',
            email: '',
            jenis_kelamin: '',
            alamat: '',
            submitted: false
        }
    },
    computed: {
        loggingIn () {
            return this.$store.state.authentication.status.loggingIn;
        }
    },
    methods: {
        handleSubmit (e) {
            this.submitted = true;
            const { username, password, email, jenis_kelamin, alamat } = this;
            const { dispatch } = this.$store;
            if (jenis_kelamin == -1) {
                alert('Pilih jenis kelamin');
            }
            if (username && password && email && jenis_kelamin && alamat) {
                dispatch('authentication/register', { username, password, email, jenis_kelamin, alamat });
            }
        },
        handleLogin(e) {
            router.push({name: 'login'});
        }
    }
};
</script>
