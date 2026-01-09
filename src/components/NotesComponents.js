import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotesCard = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (currentNote.trim()) {
      setNotes([...notes, currentNote.trim()]);
      setCurrentNote("");
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsAdding(!isAdding)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Add Note Section */}
      {isAdding && (
        <View style={styles.addNoteSection}>
          <TextInput
            style={styles.input}
            placeholder="Write a note..."
            value={currentNote}
            onChangeText={setCurrentNote}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Display Notes */}
      <FlatList
        scrollEnabled={false}
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteText}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes added yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  iconButton: {
    backgroundColor: "#007BFF",
    borderRadius: 16,
    padding: 8,
  },
  addNoteSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#28A745",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  noteItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginTop: 16,
  },
});

export default NotesCard;
