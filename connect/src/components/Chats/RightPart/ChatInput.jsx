import { ThemeProvider, Tooltip, createTheme } from '@mui/material';
import React, { useState } from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = (props) => {

  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  const addToMessage = (emoji) => {
    let mes = message;
    mes += emoji.emoji;
    setMessage(mes);
  }

  const sendChat = (event) => {
    event.preventDefault();
    if (message.length > 0) {
      props.sendMessage(message);
      setMessage("");
    }
  };

  const enterKey = (e) => {
    if (e.key === "Enter")
      sendChat(e)
  }

  return (
    <ThemeProvider theme={theme}>
      {props.userInfo && props.selectedChat &&
        <Input bg={props.theme}>
          <div className='inputs'>
            <div className='emoji-message'>
              <div className='hover-item' onClick={() => setShowPicker(!showPicker)}>
                <InsertEmoticonIcon />
              </div>
              {showPicker &&
                <Picker className='emoji-picker' onEmojiClick={addToMessage}
                  style={{ width: "300px", height: "400px", backgroundColor: "#080420", position: "absolute", top: "30%" }}
                />
              }
            </div>
            <div className='message'>
              <input className='text-message' type='text' onKeyPress={(e) => enterKey(e)} autoFocus
                placeholder='Send a message' value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div onClick={sendChat}>
              <Tooltip title='Send Message' placement='left'>
                <SendIcon className='hover-item' />
              </Tooltip>
            </div>
          </div>
        </Input>
      }
    </ThemeProvider>
  )
}

const Input = styled.div`
  height: 8%;
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: end;
  .hover-item{
    cursor: pointer;
  }
  
  .inputs{
    height: 80%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: transparent;
    background-color: ${props => props.bg === '' ? `#0d2b6e` : 'none'};
    align-items: center;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    border-radius: 0.3rem;
  }
  .text-message::placeholder{
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
  }
  .message{
    width: 80%;
  }
  .text-message{
    border-radius: 0.5rem;
    border-width: 0.01rem;
    border-style: none;
    width: 100%;
    padding: 0.5rem;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 600;
  }
  .text-message:focus{
    outline: none;
  }
`

export default ChatInput