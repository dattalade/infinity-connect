import { ThemeProvider, createTheme } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Avatar = ({ tabIndex, index, userInfo, timeUpdated }) => {

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Josefin Sans',
        'sans-serif',
      ].join(','),
    },
  });

  const [file, setFile] = useState(undefined);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    console.log(file)
  };

  const uploadImage = async () => {
    if (file === undefined) {
      toast.warn('Please select any image', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style:
        {
          fontFamily: "'Josefin Sans', sans-serif",
          textTransform: 'capitalize'
        },
      });
    }
    else if (userInfo !== undefined) {
      const formData = new FormData()
      formData.append('name', file.name)
      formData.append('image', file)
      formData.append('id', userInfo._id)

      await axios.post('https://infinity-connect.onrender.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response) => {
          console.log(response.data)
          setFile(undefined)
          timeUpdated()
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }

  const updateAvatar = async () => {
    if (file === undefined) {
      toast.warn('Please select any image', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style:
        {
          fontFamily: "'Josefin Sans', sans-serif",
          textTransform: 'capitalize'
        },
      });
    }
    else if (userInfo !== undefined) {
      const formData = new FormData()
      formData.append('name', file.name)
      formData.append('image', file)
      formData.append('id', userInfo._id)
      formData.append('public', userInfo.userAvatar.cloudinaryId)

      console.log(formData)
      await axios.post('https://infinity-connect.onrender.com/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response) => {
          console.log(response.data)
          if (response.data.status)
            timeUpdated()
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }

  const removeAvatar = async () => {
    if (userInfo !== undefined) {
      await axios.post('https://infinity-connect.onrender.com/delete-avatar', { id: userInfo._id, public: userInfo.userAvatar.cloudinaryId },)
        .then((response) => {
          console.log(response.data)
          if (response.data.status) {
            timeUpdated()
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }

  if (tabIndex !== undefined && index !== undefined) {
    if (tabIndex === index) {
      return (
        <ThemeProvider theme={theme}>
          <ToastContainer />
          {userInfo &&
            <>
              <CSSAvatar>
                {userInfo.userAvatar.imageUrl === '' &&
                  <div className='no-avatar'>
                    <h2>Upload any image</h2>
                    <input className='button' type="file" onChange={handleFileChange}
                      name="file" accept='image/*' />
                    <button onClick={uploadImage} className='hover-item'>Upload Image</button>
                  </div>
                }
              </CSSAvatar>
              {userInfo.userAvatar.imageUrl !== '' &&
                <FullCSS>
                  <img src={userInfo.userAvatar.imageUrl} alt='Not found' />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <input className='button' type="file" onChange={handleFileChange}
                      name="file" accept='image/*' />
                    <button className='hover-item' onClick={updateAvatar}><span>Change Avatar</span></button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                    <button className='hover-item' onClick={removeAvatar}><span>Remove Avatar</span></button>
                  </div>
                </FullCSS>
              }
            </>
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

const CSSAvatar = styled.div`
  *{
    font-family: "Josefin Sans", sans-serif;
    padding: 0;
    margin: 0;
  }

  h2{
    text-transform: uppercase;
  }

  .no-avatar{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  button{
    padding: 1rem;
    background: linear-gradient(to right, #00FFFF, #0077FF);
    border: none;
    color: white;
    border-radius: 5rem;
    display: flex;
  }

  button:hover {
    background: linear-gradient(to right, #0077FF, #00FFFF); /* Transition to different color stops */
  }

  .hover-item{
    cursor: pointer;
  }

  input[type=file]::file-selector-button{
    font-family: "Josefin Sans", sans-serif;
    cursor: pointer;
    border: none;
    padding: 1rem;
    border-radius: 1rem;
  }
`

const FullCSS = styled.div`
  *{
    font-family: "Josefin Sans", sans-serif;
    padding: 0;
    margin: 0;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  img{
    width: 20rem;
    height: 20rem;
  }

  .hover-item{
    cursor: pointer;
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

  input[type=file]::file-selector-button{
    font-family: "Josefin Sans", sans-serif;
    cursor: pointer;
    border: none;
    padding: 1rem;
    border-radius: 1rem;
  }
`

export default Avatar