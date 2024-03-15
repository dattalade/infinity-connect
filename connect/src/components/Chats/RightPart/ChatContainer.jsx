import { Drawer, ThemeProvider, createTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import SelectedContactHeader from './SelectedContactHeader';
import ChatBody from './ChatBody';
import { OrbitSpace } from 'orbit-space'

const ChatContainer = (props) => {

  const [selectedChat, setSelectedChat] = useState(undefined)
  const [open, setOpen] = useState(false);

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  useEffect(() => {
    setSelectedChat(props.currentChat);
  }, [selectedChat, props])

  const openClose = (value) => {
    setOpen(value);
  }

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        {props.userInfo && props.currentChat && props.socket &&
          <Container>
            <SelectedContactHeader selectedChat={selectedChat} openClose={openClose} />
            <ChatBody userInfo={props.userInfo} selectedChat={selectedChat} socket={props.socket} timeUpdated={props.timeUpdated} />
            <Drawer
              anchor="right"
              open={open} style={{ width: "100%", }}
              onClose={() => openClose(false)}
            >
              <div style={{ width: "100%", height: "100%", backgroundColor: "whitesmoke" }}>
                <h1 style={{ fontFamily: 'Josefin Sans, sans-serif' }}>Da</h1>
              </div>
            </Drawer>
          </Container>
        }
      </ThemeProvider>
    </React.Fragment>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export default ChatContainer