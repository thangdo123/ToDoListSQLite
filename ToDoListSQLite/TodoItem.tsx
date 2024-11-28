import { useState } from "react";
import { Button, Keyboard, StyleSheet, TextInput, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TodoItem({
  value,
  onEdit,
  onDelete,
  onComplete,
  completedStatus,
}: {
  value: string;
  onEdit?: (value: string) => void;
  onDelete?: () => void;
  onComplete?: () => void;
  completedStatus: boolean;
}) {
  const [editStatus, setEditStatus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value);

  const handleEditTodo = () => {
    onEdit!(inputValue);
    setEditStatus(false);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, styles.shadowProp]}>
      {completedStatus ? (
        <MaterialIcons
          onPress={onComplete}
          name="radio-button-checked"
          size={24}
          color="black"
        />
      ) : (
        <MaterialIcons
          onPress={onComplete}
          name="radio-button-unchecked"
          size={24}
          color="black"
        />
      )}
      <TextInput
        onChangeText={(e) => setInputValue(e)}
        value={inputValue}
        onSubmitEditing={handleEditTodo}
        onPress={() => setEditStatus(true)}
        style={{
          flex: 1,
          textDecorationLine: completedStatus ? "line-through" : "none",
        }}
      ></TextInput>

      {editStatus && <Button title="Save" onPress={() => handleEditTodo()} />}
      <AntDesign onPress={onDelete} name="delete" size={24} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#DDDDDD",
    marginVertical: 5,
    padding: 8,
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
});
