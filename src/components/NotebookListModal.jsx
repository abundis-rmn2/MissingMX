import React from 'react';
import { Button, Box, Heading } from '@radix-ui/themes';

const NotebookListModal = ({
  listNotebooks,
  isModalOpen,
  setIsModalOpen,
  notebookList,
}) => (
  <>
    {isModalOpen && (
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 24,
            minWidth: 320,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          }}
        >
          <Heading size="4" mb="3">Select a Notebook</Heading>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {notebookList.map((notebook) => (
              <li key={notebook} style={{ marginBottom: 8 }}>
                <a
                  href={`/dist/cuaderno/${notebook}`}
                  style={{
                    color: '#007bff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {notebook}
                </a>
              </li>
            ))}
          </ul>
          <Button mt="3" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Box>
      </Box>
    )}
  </>
);

export default NotebookListModal;
