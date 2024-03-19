import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'
import styled from 'styled-components';

const SPChatInfo = ({ openClose, selectedChat }) => {
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });
  return (
    <ThemeProvider theme={theme}>
      {selectedChat &&
        <SPChat>
          <h1>{selectedChat.name}</h1>
          <button onClick={() => openClose(false)}>Wrong</button>
        </SPChat>
      }
    </ThemeProvider>
  )
}

const SPChat = styled.div`
  *{
    padding: 0;
    margin: 0;
    font-family: 'Josefin Sans', sans-serif
  }
  height: 96%;
  width: 40%;
  background-color: whitesmoke;
  padding: 1%;
`

export default SPChatInfo