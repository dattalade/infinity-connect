import { ThemeProvider, Tooltip, createTheme } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import validator from 'validator';
import styled from 'styled-components'
import ChatInput from './ChatInput';
import { Link } from 'react-router-dom';

var dateMap = new Map();
const months = { 1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December" }

const ChatBody = (props) => {
  dateMap = new Map();
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
  const [socketNeed, setSocketNeed] = useState(false)
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
        console.log("From body recieved")
        setArrival({ from: data.from, to: data.to, message: data.message, time: data.time })
        props.timeUpdated()
      })
    }
  }, [props.selectedChat, props.socket, props.userInfo, props])

  useEffect(() => {
    if (arrival !== null && props.selectedChat !== undefined && props.userInfo !== undefined) {
      if ((arrival.to === props.userInfo._id || arrival.to === props.selectedChat._id) && (arrival.from === props.userInfo._id || arrival.from === props.selectedChat._id)) {
        setMessages((prev) => [...prev, arrival])
      }
    }
  }, [arrival, props.selectedChat, props.userInfo,])

  const sendMessage = async (message) => {
    await axios.post('http://localhost:5000/send-message', { from: props.userInfo._id, to: props.selectedChat._id, message: message, time: new Date() })
      .then((response) => {
        setMessages(response.data.store)
        setSocketNeed(response.data.socketNeed)
      })
      .catch((err) => {
        console.log(err.message)
      })
    props.timeUpdated()
    props.socket.current.emit("send-msg", {
      from: props.userInfo._id,
      to: props.selectedChat._id,
      message: message,
      socketNeed: socketNeed,
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        {props.userInfo && props.selectedChat && messages && props.socket &&
          <Messages padding={props.theme}>
            <div className='chatting'>
              {messages.map((element, index) =>
                <React.Fragment key={index}>
                  <Data messageTime={new Date(element.time).toLocaleDateString()} presentMessageId={element._id} timeStamp={new Date(element.time)} />
                  <div ref={scrollRef} className={element.from === props.userInfo._id ? 'me message' : 'friend message'}>
                    <Tooltip title={new Date(element.time).toLocaleString()} placement='top'>

                      {validator.isURL(element.message) ?
                        <Link to={element.message} target='_blank'
                          className={element.from === props.userInfo._id ? 'me-message' : 'friend-message'}>
                          <span style={{ wordBreak: "break-word" }}>{element.message}</span>
                        </Link> :
                        <p className={element.from === props.userInfo._id ? 'me-message' : 'friend-message'}>
                          <span style={{ wordBreak: "break-word" }}>{element.message}</span>
                        </p>
                      }
                    </Tooltip>
                  </div>
                </React.Fragment>
              )}
            </div>
          </Messages>
        }
        <ChatInput userInfo={props.userInfo} selectedChat={props.selectedChat} sendMessage={sendMessage} theme={props.theme} />
      </>
    </ThemeProvider >
  )
}

const Data = ({ messageTime, timeStamp, presentMessageId }) => {
  const url = 'https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg'

  if (messageTime === new Date().toLocaleDateString()) {
    if (dateMap.get("Today") === undefined) {
      dateMap.set("Today", presentMessageId)
    }
    if (dateMap.get("Today") === presentMessageId) {
      return (
        <>
          <p style={{ color: "black", display: "flex", justifyContent: "center" }}>
            <span style={{
              background: `url(${url}) no-repeat`, backgroundSize: "cover",
              padding: "0.3rem 0.7rem 0.3rem 0.7rem", borderRadius: "0.2rem"
            }}>Today</span>
          </p>
        </>
      )
    }
    else {
      return (<></>)
    }
  }
  else if (timeStamp.getFullYear() === new Date().getFullYear() && timeStamp.getMonth() === new Date().getMonth() && timeStamp.getDate() + 1 === new Date().getDate()) {
    if (dateMap.get("Yesterday") === undefined) {
      dateMap.set("Yesterday", presentMessageId)
    }
    if (dateMap.get("Yesterday") === presentMessageId) {
      return (
        <>
          <p style={{ width: "100%", color: "black", display: "flex", justifyContent: "center" }}>
            <span style={{
              background: `url(${url}) no-repeat`, backgroundSize: "cover",
              padding: "0.3rem 0.7rem 0.3rem 0.7rem", borderRadius: "0.2rem"
            }}>Yesterday</span>
          </p>
        </>
      )
    }
    else {
      return (<></>)
    }
  }
  else {
    let str = months[timeStamp.getMonth() + 1] + " " + (timeStamp.getDate() <= 9 ? "0" + timeStamp.getDate() : timeStamp.getDate()) + ", " + timeStamp.getFullYear();
    if (dateMap.get(str) === undefined) {
      dateMap.set(str, presentMessageId)
    }
    if (dateMap.get(str) === presentMessageId) {
      return (
        <>
          <p style={{ color: "black", display: "flex", justifyContent: "center" }}>
            <span style={{
              background: `url(${url}) no-repeat`, backgroundSize: "cover",
              padding: "0.3rem 0.7rem 0.3rem 0.7rem", borderRadius: "0.2rem"
            }}>{str}</span>
          </p>
        </>
      )
    }
    else {
      return (<></>)
    }
  }
}

const Messages = styled.div`
  height: 84%;
  width: 100%;
  display: flex;
  justify-content: end;
  .chatting{
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding-top: ${props => props.padding === '' ? `1rem` : '0rem'};
    height: 96%;
    color: black;
    width: 97%;
    max-width: 97%;
    padding-left: 1rem;
    padding-right: 1rem;
    overflow-y: scroll;
    &::-webkit-scrollbar{
      width: 0.1rem;
      &-thumb{
        background-color: #938e8e;
        width: 0.1rem
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
    padding: 0.7rem;
    border-radius: 0.5rem;
  }
  .friend-message{
    max-width: 45%;
    background-color: whitesmoke; //#4f04ff21
    color: black;
    display: flex;
    justify-content: start;
    padding: 0.7rem;
    border-radius: 0.5rem;
  }
`

export default ChatBody