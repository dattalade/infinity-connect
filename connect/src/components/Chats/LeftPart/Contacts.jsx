import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider, createTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LinearProgress from '@mui/material/LinearProgress';

const NoContact = ({ socket, timeUpdated }) => {
  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-msg", (data) => {
        console.log("Recieved NoContact Page")
        timeUpdated();
      })
    }
  }, [socket, timeUpdated])
  return (
    <div>
      <h2 style={{ fontWeight: "300" }}>No Chats Available</h2>
    </div>
  )
}

const backgroundLink = 'https://images7.alphacoders.com/736/736462.png';

const Contacts = (props) => {

  const [userInfo, setUserInfo] = useState(undefined);
  const [userContacts, setUserContacts] = useState(undefined)
  const [selectedChat, setSelectedChat] = useState(undefined);

  useEffect(() => {
    setUserInfo(props.userInfo);
    setUserContacts(props.userContacts);
    setSelectedChat(props.currentChat);
  }, [props.userInfo, props.currentChat, props.userContacts])

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });
  console.log(props.userContacts)
  return (
    <ThemeProvider theme={theme}>
      {props.userContacts === undefined &&
        <Loading>
          <div style={{padding: "10%", width: "100%", display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", gap: "0.5rem"}}>
            <h3>Loading your contacts</h3>
            <LinearProgress style={{ width: "100%", backgroundColor: "darkslateblue" }} />
          </div>
        </Loading>
      }
      {userInfo && userContacts &&
        <UserContacts style={{ height: "70%" }}>
          <div className={userInfo.userContacts.length === 0 ? "empty-page" : "all-contacts"}>
            {userInfo.userContacts.length === 0 &&
              <NoContact socket={props.socket} timeUpdated={props.timeUpdated} />
            }
            {userInfo.userContacts.length !== 0 && userContacts &&
              <React.Fragment>
                {userContacts.map((element, index) =>
                  <div key={index} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <div className={selectedChat && selectedChat._id === element._id ? "contact selected" : "contact"} onClick={() => props.changeChat(element)} >
                      <div className='avatar-name'>
                        {
                          element.userAvatar.length === 0 &&
                          <div className='avatar'>
                            <PersonIcon fontSize='medium' className='empty-photo' />
                          </div>
                        }
                        <span className='contact-name'>{element.name}</span>
                      </div>
                      <div className='date-latest'>
                        <span>{element.latestMessage}</span>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            }
          </div>

        </UserContacts>
      }
      <hr style={{ borderColor: "darkslateblue" }} />
    </ThemeProvider>
  )
}

const UserContacts = styled.div`
  *{
    font-family: "Josefin Sans", sans-serif;
    font-optical-sizing: auto;
    padding: 0;
    margin: 0;
    text-decoration: none;
  }
  display: flex;
  flex-direction: column;
  
  overflow: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar{
    width: 0.1rem;
    &-thumb{
      background-color: #938e8e;
      width: 0.1rem
    }
  }
  .all-contacts{
    padding-right: 10px;
    padding-top: 15px;
    width: 100%;    
    transition: 0.5s ease-in-out;
  }

  .contact-name {
    max-width: 76%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .avatar-name{
    display: flex;
    align-items: center;
    gap: 0.5rem;
    .avatar{
      width: 15%;
    }
  }

  .empty-photo{
    background-color: grey;
    border-radius: 50%;
    padding: 5px;
    outline: none;
  }

  .contact{
    background-color: #ffffff39;
    height: 55px;
    padding: 5px;
    padding-left: 0.7rem;
    padding-right: 0.3rem;
    padding-top: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 90%;
    border-radius: 0.5rem;
    transition: 0.35s ease-in-out;
    cursor: pointer;
    margin-bottom: 20px;
  }

  .selected{
    // background-color: #0d2b6e;
    background: url(${backgroundLink}) no-repeat;
    background-size: cover;
    background-clip: border-box;
    background-position: center;
  }

  .hover-item:hover{
    cursor: pointer;
  }
  .add-icon{
    background-color: blue;
    border-radius: 50%;
    padding: 10px;
  }

  .empty-page{
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }

  .empty-page h3{
    word-break: break-all;
  }

  .date-latest{
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-right: 15px;
    padding-bottom: 5px;
    font-size: 12px;
    color: white;
  }
`
const Loading = styled.div`
  height: 70%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

`

export default Contacts