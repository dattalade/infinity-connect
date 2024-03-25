import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'
import styled from 'styled-components';
import PersonIcon from '@mui/icons-material/Person';

const Profile = ({ tabIndex, index, userInfo, timeUpdated, changeTab }) => {

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  if (tabIndex !== undefined && index !== undefined) {
    if (tabIndex === index) {
      return (
        <ThemeProvider theme={theme}>
          {userInfo &&
            <CSSProfile>
              <div className='heading'>
                <h3>Profile&nbsp;Card</h3>
              </div>
              <div className='profile'>
                <div style={{ backgroundColor: "whitesmoke", padding: "5rem" }}>
                  {userInfo.userAvatar.imageUrl === "" &&
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <PersonIcon className='empty-photo' style={{ fontSize: '2rem' }} />
                    </div>
                  }
                  <div>
                    <h2>{userInfo.name}</h2>
                    <p style={{ fontSize: "1rem", display: "flex", justifyContent: "center" }}>
                      <span>{userInfo.email}</span>
                    </p>
                    <p style={{ fontSize: "1rem", display: "flex", justifyContent: "center" }}>
                      <span>{userInfo.username}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={() => changeTab(1)} className='hover-item'><span>Change Avatar</span></button>
              </div>
            </CSSProfile>
          }
        </ThemeProvider>
      )
    }
    else {
      return (
        <></>
      )
    }
  }
}

const CSSProfile = styled.div`
  *{
    font-family: "Josefin Sans", sans-serif;
    padding: 0;
  }

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction:column;
  justify-content: space-evenly;
  gap: 1rem;

  .heading{
    display: flex;
    justify-content: center;
    text-transform: uppercase;
  }

  .hover-item{
    cursor: pointer;
  }

  .empty-photo{
    background-color: lightgrey;
    border-radius: 50%;
    padding: 1rem;
    outline: none;
  }

  .profile{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button{
    padding: 1rem;
    background: linear-gradient(to right, #00FFFF, #0077FF);
    border: none;
    color: white;
    border-radius: 5rem;
  }

  button:hover {
    background: linear-gradient(to right, #0077FF, #00FFFF); /* Transition to different color stops */
  }

`

export default Profile