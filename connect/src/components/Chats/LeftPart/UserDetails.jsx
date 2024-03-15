import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, Tooltip, createTheme } from '@mui/material';

const cookies = new Cookies();

const UserDetails = (props) => {

  const nav = useNavigate();
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  const [userInfo, setUserInfo] = useState(undefined);

  useEffect(() => {
    setUserInfo(props.userInfo)
  }, [props])

  useEffect(() => {
    if (cookies.get('token') === undefined)
      nav('/login')
  }, [nav])

  const removeToken = () => {
    cookies.remove('token')
    nav('/login')
  }

  return (
    <ThemeProvider theme={theme}>
      <Info>
        {userInfo !== undefined &&
          <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2rem" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                {userInfo.userAvatar === "" &&
                  <Tooltip title="Set Avatar">
                    <PersonIcon fontSize='medium' className='empty-photo hover-item' />
                  </Tooltip>
                }
                <h4>{userInfo.name}</h4>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3rem" }}>
              <Tooltip title="Settings">
                <div className='settings hover-item' onClick={() => nav('/settings')}>
                  <SettingsSuggestIcon fontSize='medium' color='warning' />
                  <span>Settings</span>
                </div>
              </Tooltip>
              <Tooltip title="Logout">
                <div className='logout hover-item' onClick={removeToken}>
                  <LogoutIcon fontSize='medium' style={{ color: "#9a86f3" }} />
                  <span>Logout</span>
                </div>
              </Tooltip>
            </div>
          </div>
        }
      </Info>
    </ThemeProvider>
  )
}

const Info = styled.div`
  *{
    font-family: "Josefin Sans", sans-serif;
    font-optical-sizing: auto;
    padding: 0;
    margin: 0;
    text-decoration: none;
    outline: none;
  }
  width: 100%;
  height: 22%;
  .empty-photo{
    background-color: grey;
    border-radius: 50%;
    padding: 5px;
    outline: none;
  }
  .hover-item:hover{
    cursor: pointer;
  }
  .settings, .logout{
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }
`

export default UserDetails