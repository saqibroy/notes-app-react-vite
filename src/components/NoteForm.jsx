import React, { memo, useEffect } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Paper,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export const NoteForm = memo(({ note, onSubmit, onCancel }) => {
  const form = useForm({
    initialValues: {
      title: note.title || "",
      text: note.text || "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Title is required"),
      text: (value) => (value.trim() ? null : "Content is required"),
    },
  });

  useEffect(() => {
    form.setValues({ title: note.title || "", text: note.text || "" });
  }, [note]);

  return (
    <Paper
      component="form"
      onSubmit={form.onSubmit((values) => onSubmit(values))}
      withBorder
      shadow="sm"
      p="md"
      radius="md"
    >
      <Stack spacing="md">
        <TextInput
          label="Title"
          placeholder="Enter note title"
          {...form.getInputProps("title")}
          autoFocus
        />

        <Textarea
          label="Note"
          placeholder="Write your note here..."
          {...form.getInputProps("text")}
          minRows={5}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!form.isValid()}>
            Save
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
});
