import React, { useState, useEffect, useCallback } from "react";
import {
  Badge,
  Container,
  Grid,
  Group,
  Text,
  Title,
  Button,
  LoadingOverlay,
  MantineProvider,
  Paper,
  Flex,
  Stack,
  Center,
  Alert,
} from "@mantine/core";
import { NotesList } from "./components/NotesList";
import { NoteForm } from "./components/NoteForm";
import { NotesService } from "./services/notes";

import "@mantine/core/styles.css";

const notesData = [
  { id: "1", title: "Important Note", text: "" },
  { id: "2", title: "Some note", text: "" },
  { id: "3", title: "Test note", text: "" },
  { id: "4", title: "Secret Note", text: "" },
  { id: "5", title: "Notes about React", text: "" },
];

const service = new NotesService(notesData);

function App() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const loadedNotes = await service.getNotes();
        setNotes(loadedNotes);
      } catch (err) {
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleSelect = useCallback((note) => setSelected(note), []);
  const handleNewNote = useCallback(() => setSelected({ title: "", text: "" }), []);
  const handleCancel = useCallback(() => setSelected(null), []);

  const handleSubmit = useCallback(async (note) => {
    setLoading(true);
    try {
      await service.saveNote(note);
      setNotes(await service.getNotes());
      setSelected(null);
    } catch (err) {
      setError("Failed to save note");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MantineProvider>
      <Container p="lg" aria-busy={loading}>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <header>
          <Flex justify="space-between" align="center" mb="xl">
            <Flex align="center" gap="md">
              <Group align="center" gap="xs">
                <Text
                  size={36}
                  fw={700}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                  style={{ lineHeight: 1 }}
                  tabIndex={0}
                  aria-label="Notes heading"
                >
                  Notes
                </Text>
                {notes.length > 0 && (
                  <Badge color="blue" size="lg" variant="light" aria-label={`Total notes: ${notes.length}`}> 
                    {notes.length}
                  </Badge>
                )}
              </Group>
            </Flex>
            <Button 
              onClick={handleNewNote} 
              size="md" 
              disabled={loading} 
              aria-label="Create new note"
              autoFocus
            >
              New Note
            </Button>
          </Flex>
        </header>

        <main>
          <Grid gutter="xl">
            <Grid.Col md={4} sm={12}>
              <Paper shadow="xs" p="md" radius="md" withBorder>
                <NotesList
                  notes={notes}
                  selected={selected}
                  onSelect={handleSelect}
                  loading={loading}
                />
              </Paper>
            </Grid.Col>

            <Grid.Col md={8} sm={12}>
              <Paper shadow="xs" p="md" radius="md" withBorder>
                {selected ? (
                  <NoteForm 
                    note={selected} 
                    onSubmit={handleSubmit} 
                    onCancel={handleCancel} 
                  />
                ) : (
                  <Center style={{ height: "100%" }}>
                    <Stack align="center">
                      <Title order={3} c="dimmed" tabIndex={0} aria-label="Select or create a note">
                        Select or Create a Note
                      </Title>
                      <Button onClick={handleNewNote} size="md" disabled={loading}>
                        New Note
                      </Button>
                    </Stack>
                  </Center>
                )}
              </Paper>
            </Grid.Col>
          </Grid>
        </main>

        {error && (
          <Alert
            title="Error"
            color="red"
            mt="lg"
            variant="light"
            role="alert"
          >
            {error}
          </Alert>
        )}
      </Container>
    </MantineProvider>
  );
}

export default React.memo(App);
