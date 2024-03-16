import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Contacts from './LeftPart/Contacts'
import UserDetails from './LeftPart/UserDetails'
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider, createTheme } from '@mui/material';
import { io } from 'socket.io-client'
import Cookies from 'universal-cookie'
import axios from 'axios'
import ChatContainer from './RightPart/ChatContainer';
import WelcomePage from './RightPart/WelcomePage';

const cookies = new Cookies();
const ChatPage = () => {
  const nav = useNavigate();
  const socket = useRef();
  const [userInfo, setUserInfo] = useState(undefined);
  const [userContacts, setUserContacts] = useState(undefined);
  const [selectedChat, setSelectedChat] = useState(undefined);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
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
          await axios.post('http://localhost:5000/retrieve-userinfo', { jwtToken: cookies.get('token') })
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
      socket.current = io('http://localhost:5000')
      socket.current.emit("add-user", userInfo._id)
    }
  }, [userInfo])

  useEffect(() => {
    const getInfo = async () => {
      await axios.post('http://localhost:5000/retrieve-userinfo', { jwtToken: cookies.get('token') })
        .then((response) => {
          setUserInfo(response.data)
        })
        .catch((err) => {
          console.log(err.message)
        })

      await axios.post('http://localhost:5000/retrieve-usercontacts', { jwtToken: cookies.get('token') })
        .then((response) => {
          if (response.data.length > 0)
            setUserContacts(response.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getInfo();
  }, [])

  const selectChat = (element) => {
    setSelectedChat(element);
  }

  const timeUpdated = async () => {
    console.log("Time updated")
    await axios.post('http://localhost:5000/retrieve-usercontacts', { jwtToken: cookies.get('token') })
      .then((response) => {
        console.log(response.data)
        if (response.data.length > 0)
          setUserContacts(response.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  return (
    <>
      <Chatting>
        <div className='container'>
          {width >= 600 &&
            <React.Fragment>
              <div className='left-part'>
                <ThemeProvider theme={theme}>
                  <div className='hover-item add-contact' style={{ height: "8%" }}>
                    <h3>Add a contact</h3>
                    <div onClick={() => nav('/addContact')}>
                      <Tooltip title="Add User to Chat">
                        <AddIcon className='add-icon' fontSize='small' />
                      </Tooltip>
                    </div>
                  </div>
                  <hr style={{ borderColor: "darkslateblue" }} />
                </ThemeProvider>
                <Contacts userInfo={userInfo} userContacts={userContacts} changeChat={selectChat} currentChat={selectedChat} socket={socket} />
                <UserDetails userInfo={userInfo} />
              </div>
              <div className='right-part'>
                {selectedChat === undefined && <WelcomePage userInfo={userInfo} socket={socket} timeUpdated={timeUpdated} />}
                {selectedChat && <ChatContainer userInfo={userInfo} currentChat={selectedChat} socket={socket} timeUpdated={timeUpdated} />}
              </div>
            </React.Fragment>
          }
        </div>
      </Chatting>
    </>
  )
}

const Chatting = styled.div`
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
    width: 25%;
    height: 100%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      width: 35%;
    }
  }
  .right-part{
    width: 75%;
    height: 100%;
    
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      width: 65%;
    }
  }
`

export default ChatPage