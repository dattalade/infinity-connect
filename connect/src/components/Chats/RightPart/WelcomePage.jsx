import { ThemeProvider, createTheme } from '@mui/material';
import React, { useEffect } from 'react'
import styled from 'styled-components'

const WelcomePage = ({ socket, timeUpdated, userInfo }) => {

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-msg", (data) => {
        console.log("Recieved Welcome Page")
        timeUpdated();
      })
    }
  }, [socket, timeUpdated])

  return (
    <ThemeProvider theme={theme}>
      {userInfo &&
        <Container style={{ height: "100%" }}>
          <div className='not-select'>
            <h1 style={{ fontWeight: "500" }}>Hello&#44;&nbsp;<span style={{ color: "#9a86f3" }}>{userInfo.name}</span></h1>
            <h2 style={{ fontWeight: "300" }}>Tap any Chat for messaging</h2>
          </div>
        </Container>
      }
    </ThemeProvider>
  )
}

const Container = styled.div`
  .not-select{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    height: 100%;
  }
`

export default WelcomePage