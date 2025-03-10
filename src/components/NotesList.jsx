import React, { memo, useState, useMemo } from "react";
import {
  Card,
  List,
  Text,
  TextInput,
  Skeleton,
  Group,
  Badge,
  ScrollArea,
  Paper,
  Box,
} from "@mantine/core";

export const NotesList = memo(({ notes, selected, onSelect, loading }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.text.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  if (loading) {
    return (
      <ScrollArea>
        {Array(5)
          .fill()
          .map((_, i) => (
            <Skeleton key={i} height={80} mb="md" radius="md" />
          ))}
      </ScrollArea>
    );
  }

  return (
    <Box p="md">
      <TextInput
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="md"
        radius="md"
      />

      <Group mb="md" justify="space-between">
        <Text size="sm" c="dimmed">
          Showing {filteredNotes.length} notes
        </Text>
        <Badge color="blue">{notes.length} total</Badge>
      </Group>

      <ScrollArea h={400}>
        <List spacing="sm">
          {filteredNotes.map((note) => (
            <Paper
              key={note.id}
              withBorder
              shadow={selected?.id === note.id ? "sm" : "xs"}
              p="md"
              radius="md"
              mb="xs"
              style={{
                cursor: "pointer",
                backgroundColor:
                  selected?.id === note.id ? "#e7f5ff" : "white",
                transition: "background-color 0.2s, transform 0.2s",
              }}
              onClick={() => onSelect(note)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Text fw={600} size="md">
                {note.title}
              </Text>
              <Text size="sm" c="dimmed" lineClamp={2}>
                {note.text || "No content available"}
              </Text>
            </Paper>
          ))}
        </List>
      </ScrollArea>
    </Box>
  );
});
