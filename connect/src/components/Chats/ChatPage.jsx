import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Contacts from './LeftPart/Contacts'
import UserDetails from './LeftPart/UserDetails'
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import { Drawer, ThemeProvider, createTheme } from '@mui/material';
import { io } from 'socket.io-client'
import axios from 'axios'
import ChatContainer from './RightPart/ChatContainer';
import WelcomePage from './RightPart/WelcomePage';
import Cookies from 'universal-cookie'
import AddContact from '../AddContact';
const cookies = new Cookies();

const ChatPage = () => {
  const nav = useNavigate();
  const socket = useRef();
  const [userInfo, setUserInfo] = useState(undefined);
  const [userContacts, setUserContacts] = useState(undefined);
  const [selectedChat, setSelectedChat] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      console.log(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      if (currentDate.getHours() === 0 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 1) {
        const getInfo = async () => {
          await axios.post('https://infinity-connect.onrender.com/retrieve-userinfo', { jwtToken: cookies.get('token') })
            .then((response) => {
              setUserInfo(response.data)
            })
            .catch((err) => {
              console.log(err.message)
            })
        }
        getInfo();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const openClose = (value) => {
    setOpen(value);
  }

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  useEffect(() => {
    if (cookies.get('token') === undefined)
      nav('/login')
  }, [nav])

  useEffect(() => {
    if (userInfo !== undefined) {
      socket.current = io('https://infinity-connect.onrender.com')
      socket.current.emit("add-user", userInfo._id)
    }
  }, [userInfo])

  useEffect(() => {
    const getInfo = async () => {
      await axios.post('https://infinity-connect.onrender.com/retrieve-userinfo', { jwtToken: cookies.get('token') })
        .then((response) => {
          setUserInfo(response.data)
        })
        .catch((err) => {
          console.log(err.message)
        })

      await axios.post('https://infinity-connect.onrender.com/retrieve-usercontacts', { jwtToken: cookies.get('token') })
        .then((response) => {
          if (response.data.length > 0)
            console.log(response.data)
            setUserContacts(response.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
      setLoading(false)
    }
    getInfo();
  }, [])

  const selectChat = (element) => {
    setSelectedChat(element);
    timeUpdated();
  }

  const timeUpdated = async () => {
    console.log("Time updated")
    await axios.post('https://infinity-connect.onrender.com/retrieve-userinfo', { jwtToken: cookies.get('token') })
      .then((response) => {
        setUserInfo(response.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
    await axios.post('https://infinity-connect.onrender.com/retrieve-usercontacts', { jwtToken: cookies.get('token') })
      .then((response) => {
        if (response.data.length > 0)
          setUserContacts(response.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const timeUpdated1 = async (selectedChat, link) => {
    await axios.post('https://infinity-connect.onrender.com/retrieve-userinfo', { jwtToken: cookies.get('token') })
      .then((response) => {
        setUserInfo(response.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
    await axios.post('https://infinity-connect.onrender.com/retrieve-usercontacts', { jwtToken: cookies.get('token') })
      .then((response) => {
        if (response.data.length > 0)
          setUserContacts(response.data)
      })
      .catch((err) => {
        console.log(err.message)
      })

    setSelectedChat((prevState) => ({
      ...prevState,
      theme: link
    }))
  }

  return (
    <>
      {width >= 1224 &&
        <ChattingLaptop>
          <div className='container'>
            <React.Fragment>
              <div className='left-part'>
                <ThemeProvider theme={theme}>
                  <div className='hover-item add-contact' style={{ height: "8%" }}>
                    <h4 style={{ textTransform: "uppercase" }}>Add&nbsp;a&nbsp;contact</h4>
                    <div onClick={() => setOpen(true)}>
                      <Tooltip title="Add User to Chat">
                        <AddIcon className='add-icon' fontSize='small' />
                      </Tooltip>
                    </div>
                  </div>
                </ThemeProvider>
                <Contacts userInfo={userInfo} userContacts={userContacts} changeChat={selectChat} loading={loading}
                  currentChat={selectedChat} socket={socket} timeUpdated={timeUpdated} />
                <UserDetails userInfo={userInfo} timeUpdated={timeUpdated} />
              </div>
              <div className='right-part'>
                {selectedChat === undefined && <WelcomePage userInfo={userInfo} socket={socket} timeUpdated={timeUpdated} />}
                {selectedChat &&
                  <ChatContainer userInfo={userInfo} currentChat={selectedChat} changeChat={selectChat}
                    socket={socket} timeUpdated={timeUpdated} timeUpdated1={timeUpdated1} />
                }
              </div>
            </React.Fragment>
          </div>
          <Drawer
            anchor="top" transitionDuration={{ enter: 750, exit: 750 }}
            PaperProps={{
              style: {
                minWidth: "100%", minHeight: `${height}`, display: "flex", flexDirection: "row", backgroundColor: "transparent",
                alignItems: "center", justifyContent: "center"
              }
            }}
            className='drawer'
            open={open}
            onClose={() => openClose(false)}
          >
            <div style={{ width: "30%", height: `${height}px`, backgroundColor: "transparent" }} onClick={() => { openClose(false) }}>Hello</div>
            <AddContact height={height} userInfo={userInfo} width={40} timeUpdated={timeUpdated} />
            <div style={{ width: "30%", height: `${height}px`, backgroundColor: "transparent" }} onClick={() => { openClose(false) }}></div>
          </Drawer>
        </ChattingLaptop>
      }
      {width > 1024 && width < 1224 &&
        <ChattingLT>
          <div className='container'>
            <React.Fragment>
              <div className='left-part'>
                <ThemeProvider theme={theme}>
                  <div className='hover-item add-contact' style={{ height: "8%" }}>
                    <h3>Add a contact</h3>
                    <div onClick={() => openClose(true)}>
                      <Tooltip title="Add User to Chat">
                        <AddIcon className='add-icon' fontSize='small' />
                      </Tooltip>
                    </div>
                  </div>
                </ThemeProvider>
                <Contacts userInfo={userInfo} userContacts={userContacts} changeChat={selectChat} loading={loading}
                  currentChat={selectedChat} socket={socket} timeUpdated={timeUpdated} />
                <UserDetails userInfo={userInfo} />
              </div>
              <div className='right-part'>
                {selectedChat === undefined && <WelcomePage userInfo={userInfo} socket={socket} timeUpdated={timeUpdated} />}
                {selectedChat &&
                  <ChatContainer userInfo={userInfo} currentChat={selectedChat} changeChat={selectChat}
                    socket={socket} timeUpdated={timeUpdated} timeUpdated1={timeUpdated1} />
                }
              </div>
            </React.Fragment>
          </div>
          <Drawer
            anchor="top" transitionDuration={{ enter: 750, exit: 750 }}
            PaperProps={{
              style: {
                minWidth: "100%", minHeight: `${height}`, display: "flex", flexDirection: "row", backgroundColor: "transparent",
                alignItems: "center", justifyContent: "center"
              }
            }}
            className='drawer'
            open={open}
            onClose={() => openClose(false)}
          >
            <div style={{ width: "25%", height: `${height}px`, backgroundColor: "transparent" }} onClick={() => { openClose(false) }}>Hello</div>
            <AddContact height={height} userInfo={userInfo} width={50} timeUpdated={timeUpdated} />
            <div style={{ width: "25%", height: `${height}px`, backgroundColor: "transparent" }} onClick={() => { openClose(false) }}></div>
          </Drawer>
        </ChattingLT>
      }
      {width >= 768 && width <= 1024 &&
        <ChattingTablet>
          <div className='container'>
            <React.Fragment>
              <div className='left-part'>
                <ThemeProvider theme={theme}>
                  <div className='hover-item add-contact' style={{ height: "8%" }}>
                    <h3>Add a contact</h3>
                    <div onClick={() => openClose(true)}>
                      <Tooltip title="Add User to Chat">
                        <AddIcon className='add-icon' fontSize='small' />
                      </Tooltip>
                    </div>
                  </div>
                </ThemeProvider>
                <Contacts userInfo={userInfo} userContacts={userContacts} changeChat={selectChat} loading={loading}
                  currentChat={selectedChat} socket={socket} timeUpdated={timeUpdated} />
                <UserDetails userInfo={userInfo} />
              </div>
              <div className='right-part'>
                {selectedChat === undefined && <WelcomePage userInfo={userInfo} socket={socket} timeUpdated={timeUpdated} />}
                {selectedChat &&
                  <ChatContainer userInfo={userInfo} currentChat={selectedChat} changeChat={selectChat}
                    socket={socket} timeUpdated={timeUpdated} timeUpdated1={timeUpdated1} />
                }
              </div>
            </React.Fragment>
          </div>
          <Drawer
            anchor="top" transitionDuration={{ enter: 750, exit: 750 }}
            PaperProps={{
              style: {
                minWidth: "100%", minHeight: `${height}`, display: "flex", flexDirection: "row", backgroundColor: "transparent",
                alignItems: "center", justifyContent: "center"
              }
            }}
            className='drawer'
            open={open}
            onClose={() => openClose(false)}
          >
            <div style={{ width: "20%", height: `${height}px`, backgroundColor: "transparent" }} onClick={() => { openClose(false) }}>Hello</div>
            <AddContact height={height} userInfo={userInfo} width={60} timeUpdated={timeUpdated} />
            <div style={{ width: "20%", height: `${height}px`, backgroundColor: "transparent" }} onClick={() => { openClose(false) }}></div>
          </Drawer>
        </ChattingTablet>
      }
    </>
  )
}

const ChattingLaptop = styled.div`
  *{
    padding: 0;
    margin: 0;
  }
  width: 100vw;
  height: 100vh;
  background-color: #131324;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Josefin Sans", sans-serif;
  font-optical-sizing: auto;
  .add-icon{
    background-color: blue;
    border-radius: 50%;
    padding: 5px;
  }
  .add-contact{
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-right: 5px;
    align-items: center;
  }
  .hover-item{
    cursor: pointer;
  }
  .container{
    width: 92%;
    height: 92%;
    background-color: rgb(2, 2, 38);
    color: white;
    display: flex;
    justify-content: space-between;
  }
  .left-part{
    width: 20%;
    height: 100%;
  }
  .right-part{
    width: 79%;
    height: 100%;
  }
`
const ChattingTablet = styled.div`
  *{
    padding: 0;
    margin: 0;
  }
  width: 100vw;
  height: 100vh;
  background-color: #131324;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Josefin Sans", sans-serif;
  font-optical-sizing: auto;
  .add-icon{
    background-color: blue;
    border-radius: 50%;
    padding: 5px;
  }
  .add-contact{
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-right: 5px;
    align-items: center;
  }
  .hover-item{
    cursor: pointer;
  }
  .container{
    width: 85%;
    height: 85%;
    background-color: rgb(2, 2, 38);
    color: white;
    display: flex;
  }
  .left-part{
    width: 35%;
    height: 100%;
  }
  .right-part{
    width: 64.5%;
    height: 100%;
  }
`
const ChattingLT = styled.div`
  *{
    padding: 0;
    margin: 0;
  }
  width: 100vw;
  height: 100vh;
  background-color: #131324;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Josefin Sans", sans-serif;
  font-optical-sizing: auto;
  .add-icon{
    background-color: blue;
    border-radius: 50%;
    padding: 5px;
  }
  .add-contact{
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-right: 5px;
    align-items: center;
  }
  .hover-item{
    cursor: pointer;
  }
  .container{
    width: 85%;
    height: 85%;
    background-color: rgb(2, 2, 38);
    color: white;
    display: flex;
  }
  .left-part{
    width: 30%;
    height: 100%;
  }
  .right-part{
    width: 69.5%;
    height: 100%;
  }
`
export default ChatPage