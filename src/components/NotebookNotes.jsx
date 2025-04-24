import React from 'react';
import { Button, TextField, Box } from '@radix-ui/themes';

const NotebookNotes = ({
  newNote,
  setNewNote,
  addNote,
  addTextOnlyNote,
}) => (
  <Box mb="3">
    <TextField.Root
      value={newNote}
      onChange={(e) => setNewNote(e.target.value)}
      placeholder="Add a note..."
      rows={3}
      style={{
        width: '100%',
        resize: 'vertical',
        borderRadius: 6,
        border: '1px solid #ddd',
        padding: 8,
        fontSize: 15,
      }}
      asChild
    />
    <Box mt="2" style={{ display: 'flex', gap: 8 }}>
      <Button size="1" onClick={addNote}>Note + State</Button>
      <Button size="1" onClick={addTextOnlyNote}>Note</Button>
    </Box>
  </Box>
);

export default NotebookNotes;
