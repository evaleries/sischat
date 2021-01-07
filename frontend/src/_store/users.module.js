import { userService } from '../_services';

export const users = {
    namespaced: true,
    state: {
        all: {},
        conversations: []
    },
    actions: {
        getAll({ commit }) {
            commit('getAllRequest');

            userService.getAll()
                .then(
                    users => commit('getAllSuccess', users),
                    error => commit('getAllFailure', error)
                );
        },
        getConversations({commit}, user) {
            userService.getConversations(user)
                .then(
                    conversations => commit('getConversations', conversations),
                    error => commit('getConversationsFailure', error)
                )
        }
    },
    mutations: {
        getAllRequest(state) {
            state.all = { loading: true };
        },
        getAllSuccess(state, users) {
            state.all = { items: users };
        },
        getAllFailure(state, error) {
            state.all = { error };
        },
        getConversations(state, conversations) {
            state.conversations = conversations;
        },
        getConversationsFailure(state, error) {
            state.all = { error }
        }
    }
}
