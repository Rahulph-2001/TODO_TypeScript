var Todo = /** @class */ (function () {
    function Todo(text, complete) {
        if (complete === void 0) { complete = false; }
        this.text = text;
        this.complete = complete;
    }
    return Todo;
}());
var StorageService = /** @class */ (function () {
    function StorageService() {
        this.storageKey = "todos";
    }
    StorageService.prototype.save = function (todos) {
        localStorage.setItem(this.storageKey, JSON.stringify(todos));
    };
    StorageService.prototype.load = function () {
        var todoJson = localStorage.getItem(this.storageKey) || "[]";
        var parsed = JSON.parse(todoJson);
        return parsed.map(function (item) { return new Todo(item.text, item.complete); });
    };
    return StorageService;
}());
var TodoList = /** @class */ (function () {
    function TodoList(storageService) {
        this.todos = [];
        this.storage = storageService;
        this.todos = this.storage.load();
    }
    TodoList.prototype.save = function () {
        this.storage.save(this.todos);
    };
    TodoList.prototype.add = function (todo) {
        this.todos.push(todo);
        this.save();
    };
    TodoList.prototype.delete = function (index) {
        this.todos = this.todos.filter(function (_, i) { return i !== index; });
        this.save();
    };
    TodoList.prototype.toggleComplete = function (index) {
        if (this.todos[index]) {
            this.todos[index].complete = !this.todos[index].complete;
            this.save();
        }
    };
    TodoList.prototype.getAll = function () {
        return this.todos;
    };
    return TodoList;
}());
var TodoUI = /** @class */ (function () {
    function TodoUI(todoList) {
        var _this = this;
        this.todoForm = document.querySelector("form");
        this.todoInput = document.getElementById("todo-input");
        this.todoListUL = document.getElementById("todo-list");
        this.todoList = todoList;
        this.todoForm.addEventListener("submit", function (e) {
            e.preventDefault();
            _this.handleAddTodo();
        });
        this.renderList();
    }
    TodoUI.prototype.handleAddTodo = function () {
        var text = this.todoInput.value.trim();
        if (text.length > 0) {
            this.todoList.add(new Todo(text));
            this.todoInput.value = "";
            this.renderList();
        }
    };
    TodoUI.prototype.renderList = function () {
        var _this = this;
        this.todoListUL.innerHTML = "";
        this.todoList.getAll().forEach(function (todo, index) {
            var li = _this.createTodoElement(todo, index);
            _this.todoListUL.appendChild(li);
        });
    };
    TodoUI.prototype.createTodoElement = function (todo, index) {
        var _this = this;
        var todoId = "todo-".concat(index);
        var li = document.createElement("li");
        li.className = "todo";
        li.innerHTML = "\n            <input type=\"checkbox\" id=\"".concat(todoId, "\" ").concat(todo.complete ? "checked" : "", ">\n            <label for=\"").concat(todoId, "\" class=\"todo-text\">").concat(todo.text, "</label>\n            <button class=\"delete-button\">\uD83D\uDDD1\uFE0F</button>\n        ");
        var deleteBtn = li.querySelector(".delete-button");
        deleteBtn.addEventListener("click", function () {
            _this.todoList.delete(index);
            _this.renderList();
        });
        var checkBox = li.querySelector("input");
        checkBox.addEventListener("change", function () {
            _this.todoList.toggleComplete(index);
            _this.renderList();
        });
        return li;
    };
    return TodoUI;
}());
var storageService = new StorageService();
var todoList = new TodoList(storageService);
new TodoUI(todoList);
