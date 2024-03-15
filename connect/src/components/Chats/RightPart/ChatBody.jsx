import { ThemeProvider, Tooltip, createTheme } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput';

const ChatBody = (props) => {
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });
  const [messages, setMessages] = useState(undefined);
  const [arrival, setArrival] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const allMessages = async () => {
      if (props.userInfo !== undefined && props.selectedChat !== undefined) {
        await axios.post('http://localhost:5000/retrieve-msg', { from: props.userInfo._id, to: props.selectedChat._id })
          .then((response) => {
            setMessages(response.data.messages)
          })
          .catch((err) => {
            console.log(err.message)
          })
      }
    }
    allMessages();
  }, [props.selectedChat, props.userInfo])

  useEffect(() => {
    if (props.socket.current && props.userInfo !== undefined && props.selectedChat !== undefined) {
      props.socket.current.on("recieve-msg", (data) => {
        setArrival({ from: props.selectedChat._id, to: props.userInfo._id, message: data.message, time: data.time })
      })
    }
  }, [props])

  useEffect(() => {
    arrival && setMessages((prev) => [...prev, arrival])
  }, [arrival])

  const sendMessage = async (message) => {
    await axios.post('http://localhost:5000/send-message', { from: props.userInfo._id, to: props.selectedChat._id, message: message, time: new Date() })
      .then((response) => {
        setMessages(response.data.store)
      })
      .catch((err) => {
        console.log(err.message)
      })
    props.timeUpdated()
    props.socket.current.emit("send-msg", {
      from: props.userInfo._id,
      to: props.selectedChat._id,
      message: message
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        {props.userInfo && props.selectedChat && messages && props.socket &&
          <Messages>
            <div className='chatting'>
              {messages.map((element, index) =>
                <React.Fragment key={index}>
                  <div ref={scrollRef} className={element.from === props.userInfo._id ? 'me message' : 'friend message'}>
                    <Tooltip title={new Date(element.time).toLocaleString()} placement='top'>
                      <p className={element.from === props.userInfo._id ? 'me-message' : 'friend-message'}><span style={{ wordBreak: "break-word" }}>{element.message}</span></p>
                    </Tooltip>
                  </div>
                </React.Fragment>
              )}
            </div>
          </Messages>
        }
        <ChatInput userInfo={props.userInfo} selectedChat={props.selectedChat} sendMessage={sendMessage} />
      </>
    </ThemeProvider>
  )
}

const Messages = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  justify-content: end;
  .chatting{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 96%;
    color: black;
    width: 97%;
    max-width: 97%;
    border-radius: 12.5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow-y: scroll;
    &::-webkit-scrollbar{
      width: 0.2rem;
      &-thumb{
        background-color: #938e8e;
        width: 0.2rem
      }
    }
  }
  .message{
    
    width: 100%;
  }
  .me{
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
  }
  .friend{
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
  }
  .me-message{
    max-width: 45%;
    background-color: #0d2b6e;
    color: white;
    display: flex;
    overflow:hidden;
    justify-content: end;
    padding: 10px;
    border-radius: 10px;
  }
  .friend-message{
    max-width: 45%;
    background-color: #4f04ff21;
    color: white;
    display: flex;
    justify-content: start;
    padding: 10px;
    border-radius: 10px;
  }
`

export default ChatBody