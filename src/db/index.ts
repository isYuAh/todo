import { Todo } from "@/types";
import Dexie from "dexie";

// export const db = new Dexie('todoDatabase');
// 创建继承自Dexie的TodoDatabase类  
class TodoDatabase extends Dexie {  
    // 定义todos表  
    todos: Dexie.Table<Todo, string>;  
    
    constructor() {  
      super('todoDatabase'); // 调用父类Dexie的构造函数，并传递数据库名称  
      // 定义和初始化表结构  
      this.version(1).stores({  
        todos: '&id, title, *status, *type, origin.origin'
      });
      this.todos = this.table('todos')
    }
 
    async getAllTodos() {
      return await this.todos.toArray()
    }
}
export const db = new TodoDatabase();