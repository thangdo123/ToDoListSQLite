import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import TodoItem from "./TodoItem";
import { useSQLiteContext } from "expo-sqlite";

export default function TodoListSQLite() {
  const db = useSQLiteContext();

  const [inputValue, setInputValue] = useState<string>("");
  const [todos, setTodos] = useState<any[]>([]);

  const handleNewTodo = async () => {
    if (inputValue) {
      try {
        await db.runAsync("UPDATE todos SET sort_order = sort_order + 1");
        await db.runAsync(
          `INSERT INTO todos (value, sort_order, completed) VALUES ($value, $sort_order, $completed)`,
          {
            $value: inputValue,
            $sort_order: 1,
            $completed: false,
          }
        );
        await getAllTodos();
        setInputValue("");
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert("", "Please enter a task first");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await db.runAsync(`DELETE FROM todos WHERE id = $id`, { $id: id });
      getAllTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTodo = async (id: number, value: string) => {
    try {
      await db.runAsync(`UPDATE todos SET value = $value WHERE id = $id`, {
        $value: value,
        $id: id,
      });
      getAllTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompletedTodo = async (id: number, completedStatus: boolean) => {
    try {
      await db.runAsync(
        `UPDATE todos SET completed = $completed WHERE id = $id`,
        {
          $id: id,
          $completed: !completedStatus,
        }
      );
      getAllTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const clearAllTodos = async () => {
    try {
      await db.runAsync(`DELETE FROM todos`);
      getAllTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTodos = async () => {
    try {
      const allTodos = await db.getAllAsync(
        `SELECT * FROM todos ORDER BY sort_order ASC`
      );
      setTodos(allTodos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.appContainer, styles.shadowProp]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Todo List</Text>
        </View>
        <View>
          <View>
            <Text style={styles.text}>Enter your task:</Text>
            <TextInput
              style={[styles.input, styles.shadowProp]}
              onChangeText={(e) => setInputValue(e)}
              value={inputValue}
              blurOnSubmit={false}
              onSubmitEditing={handleNewTodo}
            ></TextInput>
          </View>
        </View>
        <Button
          color={"#6db2dd"}
          title="Add new task"
          onPress={() => handleNewTodo()}
        />

        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.text}>Your todo list:</Text>
            <Text
              style={[
                styles.text,
                {
                  textDecorationLine: "underline",
                },
              ]}
              onPress={clearAllTodos}
            >
              Clear
            </Text>
          </View>
          <FlatList
            style={styles.todoList}
            data={todos}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginVertical: 20 }}>
                You currently dont have any todo
              </Text>
            }
            renderItem={({ item }) => (
              <TodoItem
                value={item.value}
                key={item.id}
                completedStatus={item.completed}
                onEdit={(value) => handleEditTodo(item.id, value)}
                onDelete={() => handleDeleteTodo(item.id)}
                onComplete={() => handleCompletedTodo(item.id, item.completed)}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  appContainer: {
    backgroundColor: "#be95be",
    padding: 20,
    height: "auto",
    justifyContent: "center",
    gap: 20,
    borderRadius: 40,
  },
  input: {
    height: 40,
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  shadowProp: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#71a3c1",
  },
  todoList: {
    maxHeight: 400,
    overflow: "scroll",
  },
});
