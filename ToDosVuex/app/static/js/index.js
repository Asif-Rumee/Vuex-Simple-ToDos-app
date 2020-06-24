const store = new Vuex.Store({
            state: {
                todos: [],
                newTodo: "",
                editedTodo: null,
                visibility: "all",
                todoid: 0,
                beforeEditCache: null
            },

            getters: {
                getTodos: state => {
                    return state.todos;
                },
                getEditedTodo: state => {
                    return state.editedTodo;
                }
            },

            mutations: {
                addTodo: function (state) {
                    let value = state.newTodo && state.newTodo.trim();
                    if (!value) {
                        return;
                    }
                    state.todos.push({
                        id: state.todoid++,
                        title: value,
                        completed: false
                    });
                    state.newTodo = "";
                },
                updateNewTodo(state, newTodo) {
                    state.newTodo = newTodo;
                },
                updateVisibility(state, Visibility) {
                    state.Visibility = Visibility;
                },
                removeTodo: function (state, todo) {
                    state.todos.splice(state.todos.indexOf(todo), 1);
                },
                removeCompleted: function (state) {
                    state.todos = filters.active(state.todos);
                },
                editTodo: function (state, todo) {
                    state.beforeEditCache = todo.title;
                    state.editedTodo = todo;
                },
                doneEdit: function (state, todo) {
                    if (!state.editedTodo) {
                        return;
                    }
                    state.editedTodo = null;
                    todo.title = todo.title.trim();
                    if (!todo.title) {
                        this.$store.commit('removeTodo', todo);
                    }
                },
                cancelEdit: function (state, todo) {
                    state.editedTodo = null;
                    todo.title = state.beforeEditCache;
                }
            },

            actions: {
                updateNewTodo({ commit }, newTodo) {
                    commit('updateNewTodo', newTodo);
                },

                updateVisibility({ commit }, visibility) {
                    commit('updateVisibility', visibility);
                },

                removeCompleted({ commit }) {
                    commit('removeCompleted');
                }
            },
            strict: true
        });

        var filters = {
            all: function (todos) {
                return todos;
            },
            active: function (todos) {
                return todos.filter(function (todo) {
                    return !todo.completed;
                });
            },
            completed: function (todos) {
                return todos.filter(function (todo) {
                    return todo.completed;
                });
            }
        };

        app = new Vue({
            el: ".todoapp",
            store,

            computed: {
                filteredTodos: function () {
                    return filters[this.visibility](this.$store.getters.getTodos);
                },
                remaining: function () {
                    return filters.active(this.$store.getters.getTodos).length;
                },
                getTodos: function () {
                    return this.$store.getters.getTodos;
                },
                allDone: {
                    get: function () {
                        return this.remaining === 0;
                    },
                    set: function (value) {
                        this.$store.getters.getTodo.forEach(function (todo) {
                            todo.completed = value;
                        });
                    }
                },
                newTodo: {
                    get() {
                        return this.$store.state.newTodo;
                    },
                    set(value) {
                        this.$store.dispatch('updateNewTodo', value);
                    }
                },
                visibility: {
                    get() {
                        return this.$store.state.visibility;
                    },
                    set(value) {
                        this.$store.dispatch('updateVisibility', value);
                    }
                }
            },

            methods: {
                compareEditedTodo: function (todo) {
                    return this.$store.getters.getEditedTodo == todo;
                },
                addTodo: function () {
                    this.$store.commit('addTodo');
                },
                removeTodo: function (todo) {
                    this.$store.commit('removeTodo', todo);
                },
                removeCompleted: function () {
                    this.$store.dispatch('removeCompleted');
                },

                editTodo: function (todo) {
                    this.$store.commit('editTodo', todo);
                    console.log(this.$store.getters.getEditedTodo);
                },
                doneEdit: function (todo) {
                    this.$store.commit('doneEdit', todo);
                },
                cancelEdit: function (todo) {
                    this.$store.commit('cancelEdit', todo);
                }
            },

            filters: {
                pluralize: function (n) {
                    return n === 1 ? "item" : "items";
                }
            },

            directives: {
                'todo-focus': function (el, binding) {
                    if (binding.value) {
                        el.focus();
                    }
                }
            }
        });


        function onHashChange() {
            var visibility = window.location.hash.replace(/#\/?/, "");
            if (filters[visibility]) {
                app.$store.state.visibility = visibility;
            } else {
                window.location.hash = "";
                app.$store.state.visibility = "all";
            }
        }

        window.addEventListener("hashchange", onHashChange);
        onHashChange();