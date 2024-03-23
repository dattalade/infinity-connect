import { Drawer, ThemeProvider, createTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import SelectedContactHeader from './SelectedContactHeader';
import ChatBody from './ChatBody';
import SPChatInfo from '../SPChatInfo';

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
            <Container selectedChat={selectedChat}>
              <div className='hello'>
                <SelectedContactHeader selectedChat={selectedChat} openClose={openClose} changeChat={props.changeChat} theme={props.currentChat.theme} />
                <ChatBody userInfo={props.userInfo} selectedChat={selectedChat} socket={props.socket} timeUpdated={props.timeUpdated} theme={props.currentChat.theme} />
              </div>
            </Container>
            <Drawer
              anchor="right" transitionDuration={{ enter: 750, exit: 750 }}
              PaperProps={{
                style: {
                  minWidth: "100%", minHeight: "100%", display: "flex", flexDirection: "row", backgroundColor: "transparent",
                  alignItems: "center", justifyContent: "center"
                }
              }}
              className='drawer'
              open={open}
              onClose={() => openClose(false)}
            >
              <div style={{ width: "60%", height: "100%" }} onClick={() => { openClose(false) }}></div>
              <SPChatInfo selectedChat={selectedChat} userInfo={props.userInfo} openClose={openClose} timeUpdated1={props.timeUpdated1} />
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-image: ${props => props.selectedChat && props.selectedChat.theme !== '' ? `url(${props.selectedChat.theme})` : 'none'};
    background-repeat: ${props => props.selectedChat && props.selectedChat.theme !== '' ? `no-repeat` : 'none'};
    background-size: ${props => props.selectedChat && props.selectedChat.theme !== '' ? `cover` : 'none'};
    background-clip: ${props => props.selectedChat && props.selectedChat.theme !== '' ? `border-box` : 'none'};
    background-position: ${props => props.selectedChat && props.selectedChat.theme !== '' ? `center` : 'none'};
  }
`

export default ChatContainer