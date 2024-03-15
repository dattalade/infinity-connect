import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ThemeProvider, createTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const Contacts = (props) => {

  const [userInfo, setUserInfo] = useState(undefined);
  const [userContacts, setUserContacts] = useState(undefined)
  const [selectedChat, setSelectedChat] = useState(undefined);

  useEffect(() => {
    setUserInfo(props.userInfo);
    setUserContacts(props.userContacts);
    setSelectedChat(props.currentChat);
  }, [props])

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <UserContacts style={{ height: "70%" }}>
        {userInfo &&
          <div className={userInfo.userContacts.length === 0 ? "empty-page" : "all-contacts"}>
            {userInfo.userContacts.length === 0 &&
              <div>
                <h2 style={{ fontWeight: "300" }}>No Chats Available</h2>
              </div>
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
        }
      </UserContacts>
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
    height: 60px;
    padding: 5px;
    padding-left: 7px;
    padding-right: 7px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 90%;
    border-radius: 15px;
    transition: 0.5s ease-in-out;
    cursor: pointer;
    margin-bottom: 20px;
  }

  .selected{
    background-color: #0d2b6e;
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

export default Contacts