import React from 'react';
import { Button, Box, Heading } from '@radix-ui/themes';
import NotebookListModal from './NotebookListModal';

const NotebookLoad = ({
  saveNotesToBackend,
  loadNotesFromBackend,
  listNotebooks,
  isModalOpen,
  setIsModalOpen,
  notebookList,
}) => (
  <Box mb="3">
    <Box mt="2" style={{ display: 'flex', gap: 8 }}>
      <Button size="1" onClick={saveNotesToBackend}>Save to Backend</Button>
      <Button size="1" onClick={() => loadNotesFromBackend(prompt('Enter Notebook ID:'))}>
        Load from Backend
      </Button>
      <NotebookListModal
        listNotebooks={listNotebooks}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        notebookList={notebookList}
      />
    </Box>
  </Box>
);

export default NotebookLoad;
