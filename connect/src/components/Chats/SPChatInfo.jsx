import { Card, CardContent, CardMedia, ThemeProvider, Tooltip, createTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import styled from 'styled-components';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SPChatInfo = ({ openClose, selectedChat, userInfo, timeUpdated1 }) => {

  const [selectedTheme, setSelectedTheme] = useState(-1);
  const [themes, setThemes] = useState(undefined)

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  useEffect(() => {
    const getThemes = async () => {
      await axios.post('http://localhost:5000/retrieve-themes')
        .then((response) => {
          setThemes(response.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getThemes();
  }, [])

  const checkDisable = () => {
    if (selectedTheme === -1) {
      toast.warn('Please select any theme', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style:
        {
          fontFamily: "'Josefin Sans', sans-serif",
        },
      });
    }
    else {
      const funcWrite = async () => {
        if (themes !== undefined && userInfo !== undefined && selectedChat !== undefined) {
          await axios.post('http://localhost:5000/update-theme', { themeId: themes[selectedTheme]._id, from: userInfo._id, to: selectedChat._id })
            .then((response) => {
              if(response.data.status){
                if(timeUpdated1 !== undefined && openClose !== undefined && selectedChat !== undefined){
                  timeUpdated1(selectedChat, response.data.link)
                }
              }
            })
            .catch((err) => {
              console.log(err.message)
            })
        }
      }
      funcWrite()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {selectedChat &&
        <SPChat>
          <Scrollbars>
            <div className='sp-chatinfo'>
              <div className='hover-item close' onClick={() => openClose(false)}>
                <Tooltip title="Close" placement='left'>
                  <CloseIcon />
                </Tooltip>
              </div>
              <div className='avatar-name'>
                {
                  selectedChat.userAvatar.length === 0 &&
                  <div className='avatar'>
                    <PersonIcon fontSize='large' className='empty-photo' />
                  </div>
                }
                <h2>{selectedChat.name}</h2>
                <p style={{ fontSize: "1rem" }}>{selectedChat.email}</p>
              </div>
              <div className='themes-wallpaper'>
                <div>
                  <h3>Themes</h3>
                  <hr style={{ borderColor: "whitesmoke" }} />
                </div>
                {themes &&
                  <>
                    {themes.map((element, index) =>
                      <div key={index} className='hover-item' onClick={() => setSelectedTheme(index)}>
                        <Card className={selectedTheme === index ? "card selected" : "card"}>
                          <div className='theme-effect'>
                            <CardMedia
                              component="img"
                              style={{ width: "20%" }}
                              image={`${element.themeUrl}`}
                              alt="No image"
                            />
                            <CardContent style={{ padding: "1rem", display: "flex", justifyContent: "center", }}>
                              <h4 style={{ color: "white" }}>Feel the love</h4>
                            </CardContent>
                          </div>
                        </Card>
                      </div>
                    )}
                  </>}
              </div>
              <div className='apply-changes'>
                <button onClick={checkDisable} className='hover-item apply-button'><h4>Apply Changes</h4></button>
              </div>
            </div>
          </Scrollbars>
        </SPChat>
      }
      <ToastContainer />
    </ThemeProvider>
  )
}

const SPChat = styled.div`
  *{
    padding: 0;
    margin: 0;
    font-family: 'Josefin Sans', sans-serif
  }

  color: white;
  width: 40%;
  height: 100%;
  background-color: black;

  .apply-changes button{
    padding: 1rem;
  }

  .apply-button{
    border-style: solid;
    border-color: grey;
    background-color: black;
    color: whitesmoke;
  }

  .apply-changes{
    display: flex;
    justify-content: center;
  }

  .card{
    display: flex;
    flex-wrap: wrap;
    background-color: transparent;
    width: 100%; 
    justify-content: space-between;
    border-style: solid;
    border-color: grey;
    border-width: 0.02rem;
    border-radius: 0rem;
    transition: 0.5s ease-in-out;
  }

  .selected{
    background-color: grey;
  }

  .sp-chatinfo{
    display: flex;
    flex-direction: column;
    padding: 2%;
    padding-top: 2%;
    min-height: fit-content;
    gap: 3rem;
    overflow: hidden;
  }

  .hover-item{
    cursor: pointer;
  }

  .close{
    width: 100%;
    display: flex;
    justify-content: end;
  }

  .theme-effect{
    display: flex;
    padding: 0.7%;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .empty-photo{
    background-color: grey;
    border-radius: 50%;
    padding: 5px;
    outline: none;
  }

  .avatar-name{
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    align-items: center;
  }

  .themes-wallpaper{
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

`

export default SPChatInfo