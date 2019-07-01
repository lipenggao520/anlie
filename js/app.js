((Vue) => {
    //自定义属性 
    // 注意 我们在自定义的时候 自定义指令的名必须用引号包裹 引号内部能有空格否则汇报错
    Vue.directive('focus', {
        inserted(el) {
            el.focus();
        }
    });

    var myHerder = {
        template: ` 
            <header class="header">
                <h1>todos</h1>
                <input placeholder="What needs to be done?" class="new-todo" @keyup.enter="$emit('TkeyAdd',$event)" v-focus>
            </header>`,
    }
    var myContent = {
        props: ['todos', 'sun', 'flag', 'nextId', 'entireAdd', 'activeAdd', 'completedAdd'],
        template: `
            <section class="main">
                <input id="toggle-all" type="checkbox" class="toggle-all" :checked="flag">
                <label for="toggle-all" @click='Tall'>Mark all as complete</label>
                <!-- v-for='(item,index) in todos' -->
                <ul class="todo-list">
                    <li :class="(activeAdd && item.completed) || (completedAdd &&!item.completed) ? 'conceal' : ''
                    " :key="item.id" v-for='(item, index) in todos 
                    '>
                    <div class="view">
                        <input type="checkbox" class="toggle" @click='Tselect(index)' :checked="item.completed">
                        <label :class="item.completed  ?'a ' : ' '">{{item.title}}</label>
                        <button class="destroy" @click='Tdel(index)'></button>
                    </div>
                    <input class="edit">
                    </li>
                </ul>
            </section>`,
        methods: {
            // wholeContent 内容组件 开始
            Tall() {
                this.$emit('whole-content', {
                    type: 'Tall'
                });
            },
            Tselect(i) {
                this.$emit('whole-content', {
                    type: 'Tselect',
                    index: i
                });
            },
            Tdel(i) {
                this.$emit('whole-content', {
                    type: 'Tdel',
                    index: i
                })
            }
            // 内容组件结束
        }
    }
    var myFooter = {
        props: ['todos', 'flag', 'nextId', 'entireAdd', 'activeAdd', 'completedAdd', 'genuine'],
        template: `
                <footer class="footer">
                    <span class="todo-count">
                    <strong>{{genuine}}</strong> item left</span>
                    <ul class="filters">
                        <li><a href="#/" :class="entireAdd ? 'selected' :''" @click='TAentire'>All</a></li>
                        <li><a href="#/active" :class="activeAdd ? 'selected' : ''" @click='TAactive'>Active</a></li>
                        <li><a href="#/completed" :class="completedAdd ? 'selected' :' '" @click='TAcompleted'>Completed</a></li>
                    </ul>
                    <button class="clear-completed" @click='Tdeluptate'>Clear completed</button>
                </footer>`,
        methods: {
            Tdeluptate() {
                this.$emit('whole-footer', {
                    type: 'Tdeluptate'
                });
            },
            TAactive() {
                this.$emit('whole-footer', {
                    type: 'TAactive'
                });
            },
            TAentire() {
                this.$emit('whole-footer', {
                    type: 'TAentire'
                })
            },
            TAcompleted() {
                this.$emit('whole-footer', {
                    type: 'TAcompleted'
                });
            }
        }

    }

    Vue.component('my-details', {
        data() {
            return {
                sun: 0,
                entireAdd: true,
                activeAdd: false,
                completedAdd: false,
                flag: false,
                nextId: 4,
                todos: [{
                    id: 1,
                    title: '吃饭 ',
                    completed: false
                }, {
                    id: 2,
                    title: '睡觉 ',
                    completed: false
                }, {
                    id: 3,
                    title: '打豆豆 ',
                    completed: true
                }],
            }
        },
        template: `
                <div>
                    <my-herder @TkeyAdd ="add($event)"></my-herder>
                    <my-content :todos='todos' :flag ='flag' :nextId='nextId' :entireAdd = 'entireAdd' :activeAdd = 'activeAdd' :completedAdd ='completedAdd' :sun='sun' @whole-content ='wholeContent($event)'> 
                    </my-content>
                    <my-footer :todos='todos' :flag ='flag' :nextId='nextId' :entireAdd = 'entireAdd' :activeAdd = 'activeAdd' :completedAdd ='completedAdd' :genuine='genuine'@whole-footer = 'wholeFooter($event)'> 
                    </my-footer> 
                </div>`,
        components: {
            'my-herder': myHerder,
            'my-content': myContent,
            'my-footer': myFooter,
        },
        methods: {
            // ----------------------头部 添加新的数据 开始 组件化 ----------------
            add(e) {
                // 添加新的 数据
                this.todos.push({
                    id: this.nextId,
                    title: e.target.value,
                    completed: false,
                });
                this.nextId++;
                e.target.value = ' ';
            },
            // ----------------------头部 添加新的数据 结束 组件化 ----------------
            // --------------------------------内容部分 组件化开始-----------------
            wholeContent(e) {
                console.log(e);
                if (e.type == 'Tselect') {
                    // 根据对应的索引值来改变 当前对象里面的 item.completed 值
                    // 我们使用 some 方法 只要有一个相等 就会返回 true 
                    var s = this.todos.some((item, index) => {
                        if (e.index == index) {
                            item.completed = !item.completed;
                            return true;
                        }
                    });
                } else if (e.type == 'Tall') {
                    // 当我们点击 全选按钮 的时候 就用forEach 遍历出每一个completed
                    // 给 该元素设置为true
                    this.todos.forEach((item, index) => {
                        item.completed = !this.flag;
                    });
                    // 我们这个 flag 变量也需要 取反 从新赋值
                    this.flag = !this.flag;
                } else if (e.type == 'Tdel') {
                    // 根据索引值来删除对应的元素 这是删除 单个
                    this.todos.splice(e.index, 1);
                }
            },
            wholeFooter(e) {
                if (e.type == 'Tdeluptate') {
                    // 这是删除多个 遍历数组 复选框为选中的状态 就删除
                    this.todos.forEach((item, index) => {
                        // console.log(item);
                        if (item.completed) {
                            this.todos.splice(index, (this.todos.length - index));
                        }
                    });
                } else if (e.type == 'TAactive') {
                    // 复选框选中的隐藏 没有选中的则显示
                    this.activeAdd = this.activeAdd ? 'ture' : 'false';
                    this.entireAdd = false;
                    this.completedAdd = false;
                } else if (e.type == 'TAentire') {
                    // 全都显示
                    this.entireAdd = this.entireAdd ? 'ture' : 'false';
                    this.activeAdd = false;
                    this.completedAdd = false;
                } else if (e.type == 'TAcompleted') {
                    // 复选框没有选中的显示 选中的则隐藏
                    this.completedAdd = this.completedAdd ? 'ture' : 'false';
                    this.activeAdd = false;
                    this.entireAdd = false;
                }
            },
        },
        computed: {
            // 计算复选框有几个没有选中  展示在页面
            genuine() {
                var res = this.todos.filter(item => {
                    if (item.completed) {
                        return true;
                    }
                });
                // console.log(this.todos.length);
                // 计算复选框都选中的 就让全选按钮也变成选中的状态
                if (this.todos.length - res.length == 0) {
                    this.flag = true;
                } else if (this.todos.length - res.length >= 1) {
                    // 计算复选框都有个或者多个没有选中的 就让全选按钮变成不选中的状态
                    this.flag = false;
                }
                // console.log(res.length);
                // 计算属性需要 return 返回出去
                return this.todos.length - res.length;
            }
        }
    });
    const vm = new Vue({
        el: "#todoapp",
        data: {},

    })
})(Vue)