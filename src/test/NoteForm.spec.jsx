import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { NoteForm } from '../components/NoteForm';
import { MantineProvider } from '@mantine/core';

// Helper to wrap components with MantineProvider
const renderWithMantine = (ui) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('NoteForm Component', () => {
  it('should display title and note form input fields after note is selected', () => {
    // given
    const note = { title: 'Test Title', text: 'Test Text' };
    renderWithMantine(<NoteForm note={note} />);

    // then
    expect(screen.getByTestId('input-title')).toHaveValue(note.title);
    expect(screen.getByTestId('input-text')).toHaveValue(note.text);
  });

  it('should call onChange with changed form values', () => {
    // given
    const onChange = jest.fn();
    const note = { title: '', text: '' };
    renderWithMantine(<NoteForm note={note} onChange={onChange} />);

    // when
    const titleInput = screen.getByTestId('input-title');
    fireEvent.change(titleInput, { target: { name: 'title', value: 'test' } });
    const noteInput = screen.getByTestId('input-text');
    fireEvent.change(noteInput, { target: { name: 'text', value: 'test' } });

    // then
    expect(onChange).toHaveBeenCalledWith({ text: '', title: 'test' });
    expect(onChange).toHaveBeenCalledWith({ text: 'test', title: '' });
  });

  it('should call onSubmit with changed note after the form is submitted', () => {
    // given
    const onSubmit = jest.fn();
    const note = { title: '', text: '' };
    renderWithMantine(<NoteForm note={note} onSubmit={onSubmit} />);

    // when
    fireEvent.click(screen.getByTestId('save-note'));

    // then
    expect(onSubmit).toHaveBeenCalledWith(note);
  });

  it('should display validation errors', () => {
    // given
    renderWithMantine(<NoteForm />);

    // when
    const titleInput = screen.getByTestId('input-title');
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.blur(titleInput);

    // then
    const errorMessage = screen.getByText('Title is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should close the form when Escape is pressed', () => {
    // given
    const onCancel = jest.fn();
    renderWithMantine(<NoteForm onCancel={onCancel} />);

    // when
    fireEvent.keyDown(document, { key: 'Escape' });

    // then
    expect(onCancel).toHaveBeenCalled();
  });
});