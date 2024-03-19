import { Drawer, ThemeProvider, createTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import SelectedContactHeader from './SelectedContactHeader';
import ChatBody from './ChatBody';
import SPChatInfo from '../SPChatInfo';

const backgroundLink = 'https://images7.alphacoders.com/736/736462.png';

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
          <React.Fragment>
            <Container>
              <div className='hello'>
                <SelectedContactHeader selectedChat={selectedChat} openClose={openClose} changeChat={props.changeChat} />
                <ChatBody userInfo={props.userInfo} selectedChat={selectedChat} socket={props.socket} timeUpdated={props.timeUpdated} />
              </div>
            </Container>
            <Drawer
              anchor="right" transitionDuration={{ enter: 750, exit: 750 }}
              PaperProps={{
                style: {
                  minWidth: "100%", display: "flex", flexDirection: "row", backgroundColor: "transparent",
                  alignItems: "center", justifyContent: "center"
                }
              }}
              className='drawer'
              open={open}
              onClose={() => openClose(false)}
            >
              <div style={{ width: "60%", height: "100%" }} onClick={() => { openClose(false) }}></div>
              <SPChatInfo selectedChat={selectedChat} userInfo={props.userInfo} openClose={openClose} />
            </Drawer>
          </React.Fragment>
        }
      </ThemeProvider>
    </React.Fragment>
  )
}

const Container = styled.div`
  *{
    padding: 0;
    margin: 0;
  }
  width: 100%;
  height: 100%;
  .hello{
    width: 100%;
    height: 100%;
    background: url(${backgroundLink}) no-repeat;
    background-size: cover;
    background-clip: border-box;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`

export default ChatContainer