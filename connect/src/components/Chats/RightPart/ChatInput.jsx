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
    console.log(e.key)
    if (e.key === "Enter")
      sendChat(e)
  }

  return (
    <ThemeProvider theme={theme}>
      {props.userInfo && props.selectedChat &&
        <Input>
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
              <input className='text-message' type='text' onKeyPress={(e) => enterKey(e)}  
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
  height: 7%;
  width: 100%;
  display: flex;
  justify-content: end;
  .hover-item{
    cursor: pointer;
  }
  .inputs{
    height: 100%;
    width: 97%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #0d2b6e;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 12.5px;
  }
  .text-message::placeholder{
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
  }
  .message{
    width: 80%;
  }
  .text-message{
    background: whitesmoke;
    border-radius: 10px;
    border-width: 1px;
    border-style: none;
    width: 100%;
    padding: 9px;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 600;
  }
  .text-message:focus{
    outline: none;
  }
`

export default ChatInput