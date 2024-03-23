import { ThemeProvider, createTheme } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components'
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import { Scrollbars } from 'react-custom-scrollbars';
import axios from 'axios';

const AddContact = ({ height, userInfo, width, timeUpdated }) => {

  const [allUsers, setAllUsers] = useState(undefined)
  const [search, setSearch] = useState("")
  const [loadedUsers, setLoadedUsers] = useState(true);

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  const searchUsers = (e) => {
    setSearch(e.target.value.trim())
    getSearchUsers(e.target.value);
  }

  const getSearchUsers = async (str) => {
    if (userInfo !== undefined && str.trim() !== '') {
      setLoadedUsers(true);
      await axios.post('http://localhost:5000/search-users', { searchValue: str.trim(), userId: userInfo._id })
        .then((response) => {
          setAllUsers(response.data)
          setLoadedUsers(false)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }

  const addToContacts = async (item) => {
    await axios.post('http://localhost:5000/add-contact', { contact: item, userInfo: userInfo })
      .then((response) => {
        if (response.data.status) {
          setAllUsers((prevUsers) => {
            return prevUsers.map(element => {
              if (element.username === item.username) {
                return { ...element, alreadyContact: true }
              }
              return element;
            });
          });
          timeUpdated()
        }
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Contact height={height} width={width}>
        <div className='flexes'>
          <div className='contacts'>
            <div className='search-div'>
              <div className='second-div' style={{ width: "100%", display: "flex", alignItems: "center" }}>
                <SearchIcon style={{ width: "5%" }} />
                <input onChange={(e) => searchUsers(e)} type='search' className='search-bar' placeholder=' Search by username' />
              </div>
            </div>
            {search === '' &&
              <Scrollbars>
                <div className='no-search' style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "92.5%" }}>
                  <p style={{ fontSize: "2rem" }}>Search for any user</p>
                </div>
              </Scrollbars>
            }
            {search !== '' && loadedUsers &&
              <div className='no-search' style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "92.5%" }}>
                <p style={{ fontSize: "2rem" }}>Loading Contacts</p>
              </div>
            }
            {search !== '' && allUsers &&
              <Scrollbars renderTrackVertical={({ style }) => (
                <div
                  style={{ ...style, width: '0px' }} // Set the width of the scrollbar
                  className="track-vertical"
                />
              )}
              >
                <div className='all-users'>
                  {allUsers.map((item, index) =>
                    <React.Fragment key={index}>
                      <div className='specific-user'>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          {item.userAvatar === '' &&
                            <PersonIcon fontSize='medium' className='empty-photo' />
                          }
                          <p style={{ fontWeight: "600" }}>{item.name.toUpperCase()}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.7rem" }}>{item.username}</span>
                          {item.alreadyContact &&
                            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                              <p style={{ fontWeight: "300" }}>Friends</p>
                              <CheckIcon fontSize='small' color='success' />
                            </div>
                          }
                          {!item.alreadyContact &&
                            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                              <button onClick={() => addToContacts(item)} className='contact-btn hover-item'>Add&nbsp;to&nbsp;Contact</button>
                            </div>
                          }
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </Scrollbars>
            }
            {search !== '' && typeof allUsers === 'string' &&
              <Scrollbars>
                <div className='no-search' style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "92.5%" }}>
                  <p style={{ fontSize: "2rem" }}>No User found</p>
                </div>
              </Scrollbars>
            }
          </div>
        </div>
      </Contact>
    </ThemeProvider>
  )
}

const Contact = styled.div`
  *{
    font-family: 'Josefin Sans', sans-serif;
    padding: 0;
    margin: 0;
  }
  width: ${props => props.height !== undefined ? `${props.width}%` : 'none'};
  height: ${props => props.height !== undefined ? `${props.height}px` : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  .flexes{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .empty-photo{
    background-color: lightgrey;
    border-radius: 50%;
    padding: 5px;
    outline: none;
  }

  .contact-btn{
    padding: 0.5rem;
    background: transparent;
    outline: none;
    border-width: 0.05rem;
  }

  .hover-item{
    cursor: pointer;
  }

  .contacts{
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: white;
    gap: 2rem;
    padding: 1rem;
  }

  .search-div{
    display: flex;
    justify-content: center;
    height: 7.5%;
    position: sticky;
    width: 100%;
  }

  .search-bar{
    outline: none;
    border: none;
    background-color: whitesmoke;
    width: 95%;
    color: gray;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
    height: 2rem;
    padding: 0;
    font-size: 1rem;
  }

  .search-bar::placeholder{
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 300;
  }

  .second-div{
    background-color: whitesmoke;
    padding: 0.5rem;
    border-radius: 1rem;
  }

  .all-users{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: center;
  }

  .specific-user{
    background-color: whitesmoke;
    padding: 0.5rem;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
  }
`

export default AddContact