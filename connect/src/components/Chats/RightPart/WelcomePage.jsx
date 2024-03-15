import { ThemeProvider, createTheme } from '@mui/material';
import React from 'react'
import styled from 'styled-components'

const WelcomePage = (props) => {

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
      {props.userInfo &&
        <Container style={{ height: "100%" }}>
          <div className='not-select'>
            <h1 style={{ fontWeight: "500" }}>Hello&#44;&nbsp;<span style={{ color: "#9a86f3" }}>{props.userInfo.name}</span></h1>
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