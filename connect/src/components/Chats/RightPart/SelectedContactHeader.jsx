import React from 'react'
import { ThemeProvider, Tooltip, createTheme } from '@mui/material';
import styled from 'styled-components';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import DuoIcon from '@mui/icons-material/Duo';
import MenuIcon from '@mui/icons-material/Menu';

const SelectedContactHeader = (props) => {
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
      {props.selectedChat &&
        <Header>
          <div className='header-details'>
            <div className='avatar-name'>
              {props.selectedChat.userAvatar === "" &&
                <div className='avatar'>
                  <PersonIcon fontSize='medium' className='empty-photo' />
                </div>
              }
              <Tooltip title={props.selectedChat.name} placement='right'>
                <p className='contact-name'>{props.selectedChat.name}</p>
              </Tooltip>
            </div>
            <div className='calls-details'>
              <Tooltip title="Call" placement='top'>
                <div className='hover-item'>
                  <CallIcon />
                </div>
              </Tooltip>
              <Tooltip title="Video Call" placement='top'>
                <div className='hover-item'>
                  <DuoIcon />
                </div>
              </Tooltip>
              <Tooltip title="Info" placement='top'>
                <div className='hover-item' onClick={() => { props.openClose(true) }}>
                  <MenuIcon />
                </div>
              </Tooltip>
            </div>
          </div>

        </Header>
      }
    </ThemeProvider>
  )
}

const Header = styled.div`
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: end;  
  .hover-item{
    cursor: pointer;
  }
  .header-details{
    height: 100%;
    width: 97%;
    display: flex;
    justify-content: space-between;
    background-color: #0d2b6e;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 12.5px;
  }
  .empty-photo{
    background-color: grey;
    border-radius: 50%;
    padding: 5px;
    outline: none;
  }
  .avatar{
    min-width: fit-content;
  }
  .avatar-name{
    display: flex;
    align-items: center;
    max-width: 55%;
    gap: 1rem;
  }
  .contact-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }
  .calls-details{
    display: flex;
    gap: 2.5rem;
    min-width: fit-content;
    max-width: 45%;
  }
`

export default SelectedContactHeader