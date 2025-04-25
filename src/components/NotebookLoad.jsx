import React from 'react';
import { Button, Box } from '@radix-ui/themes';
import NotebookListModal from './NotebookListModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faFolderOpen, faList } from '@fortawesome/free-solid-svg-icons';

const NotebookLoad = ({
  saveNotesToBackend,
  loadNotesFromBackend,
  listNotebooks,
  isModalOpen,
  setIsModalOpen,
  notebookList,
}) => (
  <Box mb="3">
    <Box
      mt="2"
      style={{
        display: 'flex',
        gap: 8,
        width: '100%',
      }}
    >
      <Button
        size="1"
        onClick={saveNotesToBackend}
        style={{ flex: 1 }}
      >
        <FontAwesomeIcon icon={faSave} style={{ marginRight: 4 }} />
        Guardar en servidor
      </Button>
      <Button
        size="1"
        onClick={() => loadNotesFromBackend(prompt('Ingrese el ID del cuaderno:'))}
        style={{ flex: 1 }}
      >
        <FontAwesomeIcon icon={faFolderOpen} style={{ marginRight: 4 }} />
        Cargar del servidor
      </Button>
      <Button
        size="1"
        onClick={listNotebooks}
        style={{ flex: 1 }}
      >
        <FontAwesomeIcon icon={faList} style={{ marginRight: 4 }} />
        Listar cuadernos
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
