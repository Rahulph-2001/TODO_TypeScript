class Todo {
    constructor(public text: string, public complete: boolean = false) {}
}

class StorageService {
    private storageKey = "todos";

    public save(todos: Todo[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(todos));
    }

    public load(): Todo[] {
        const todoJson = localStorage.getItem(this.storageKey) || "[]";
        const parsed = JSON.parse(todoJson);
        return parsed.map((item: any) => new Todo(item.text, item.complete));
    }
}

class TodoList {
    private todos: Todo[] = [];
    private storage: StorageService;

    constructor(storageService: StorageService) {
        this.storage = storageService;
        this.todos = this.storage.load();
    }

    private save(): void {
        this.storage.save(this.todos);
    }

    public add(todo: Todo): void {
        this.todos.push(todo);
        this.save();
    }

    public delete(index: number): void {
        this.todos = this.todos.filter((_, i) => i !== index);
        this.save();
    }

    public toggleComplete(index: number): void {
        if (this.todos[index]) {
            this.todos[index].complete = !this.todos[index].complete;
            this.save();
        }
    }

    public getAll(): Todo[] {
        return this.todos;
    }
}

class TodoUI {
    private todoForm: HTMLFormElement;
    private todoInput: HTMLInputElement;
    private todoListUL: HTMLUListElement;
    private todoList: TodoList;

    constructor(todoList: TodoList) {
        this.todoForm = document.querySelector("form") as HTMLFormElement;
        this.todoInput = document.getElementById("todo-input") as HTMLInputElement;
        this.todoListUL = document.getElementById("todo-list") as HTMLUListElement;
        this.todoList = todoList;

        this.todoForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleAddTodo();
        });

        this.renderList();
    }

    private handleAddTodo(): void {
        const text = this.todoInput.value.trim();
        if (text.length > 0) {
            this.todoList.add(new Todo(text));
            this.todoInput.value = "";
            this.renderList();
        }
    }

    private renderList(): void {
        this.todoListUL.innerHTML = "";
        this.todoList.getAll().forEach((todo, index) => {
            const li = this.createTodoElement(todo, index);
            this.todoListUL.appendChild(li);
        });
    }

    private createTodoElement(todo: Todo, index: number): HTMLLIElement {
        const todoId = `todo-${index}`;
        const li = document.createElement("li");
        li.className = "todo";
        li.innerHTML = `
            <input type="checkbox" id="${todoId}" ${todo.complete ? "checked" : ""}>
            <label for="${todoId}" class="todo-text">${todo.text}</label>
            <button class="delete-button">🗑️</button>
        `;

        const deleteBtn = li.querySelector(".delete-button") as HTMLButtonElement;
        deleteBtn.addEventListener("click", () => {
            this.todoList.delete(index);
            this.renderList();
        });

        const checkBox = li.querySelector("input") as HTMLInputElement;
        checkBox.addEventListener("change", () => {
            this.todoList.toggleComplete(index);
            this.renderList();
        });

        return li;
    }
}

const storageService = new StorageService();
const todoList = new TodoList(storageService);
new TodoUI(todoList);
export{}
