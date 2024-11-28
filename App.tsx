import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import TodoListSQLite from "./ToDoListSQLite/TodoListSQLite";

async function initializeDB(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, sort_order INTEGER, completed BOOLEAN NOT NULL);
    `);
  } catch (error) {
    console.log(error);
  }
}

export default function App() {
  return (
    <SQLiteProvider databaseName="todoList" onInit={initializeDB}>
      <TodoListSQLite />
    </SQLiteProvider>
  );
}
