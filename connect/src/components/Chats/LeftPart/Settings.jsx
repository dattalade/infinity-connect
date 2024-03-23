import { ThemeProvider, createTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from 'styled-components'

const Settings = () => {

  const [height, setHeight] = useState(window.innerHeight);
  const [tabValue, setTabValue] = useState(0);
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Set height={height}>
        <div className='main-settings'>
          <Tabs sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#0d2b6e', // Set your custom color here
            },
            '& .MuiTab-root': {
              color: '#0d2b6e', // Set your custom text color here
            },
          }} centered scrollButtons="auto"
            value={tabValue} onChange={(e, nv) => setTabValue(nv)} aria-label="basic tabs example">
            <Tab label="Profile" />
            <Tab label="Avatar" />
            <Tab label="Invite" />
          </Tabs>
        </div>
      </Set>
    </ThemeProvider>
  )
}

const Set = styled.div`
  *{
    font-family: "Josefin Sans", sans-serif;
  }
  background-color: transparent;
  height: ${props => props.height !== undefined ? `${props.height}px` : '0px'};
  width: 60%;
  display: flex;
  align-items: center;

  .main-settings{
    width: 100%;
    height: 87.5%;
    background-color: white;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }
`

export default Settings