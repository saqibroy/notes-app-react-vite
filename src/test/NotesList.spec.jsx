import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { NotesList } from '../components/NotesList';
import { MantineProvider } from '@mantine/core';
const notes = require('./notes.json');

// Helper to wrap components with MantineProvider
const renderWithMantine = (ui) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('NotesList Component', () => {
  it('should show list of notes', () => {
    // given
    renderWithMantine(<NotesList notes={notes} />);

    // then
    const items = screen.getAllByTestId('note-item');
    expect(items).toHaveLength(notes.length);
  });

  it('should call onSelect function after note was clicked', () => {
    // given
    const onSelect = jest.fn();
    renderWithMantine(<NotesList notes={notes} onSelect={onSelect} />);

    // when
    const item = screen.getAllByTestId('note-item')[1];
    fireEvent.click(item);

    // then
    expect(onSelect).toHaveBeenCalledWith(notes[1]);
  });

  it('should add `active` class to a note after it was selected', () => {
    // given
    const note = notes[1];
    renderWithMantine(<NotesList notes={notes} selected={note} />);

    // then
    const item = screen.getAllByTestId('note-item')[1];
    expect(item).toHaveAttribute('aria-current', 'true');
  });

  it('should be accessible to screen readers', () => {
    // given
    renderWithMantine(<NotesList notes={notes} />);

    // then
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', 'List of notes');
  });

  it('should display loading state', () => {
    // given
    renderWithMantine(<NotesList notes={[]} loading={true} />);

    // then
    const skeleton = screen.getByRole('alert'); // Assuming you use Skeleton for loading
    expect(skeleton).toBeInTheDocument();
  });
});