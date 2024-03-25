import { ThemeProvider, createTheme } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const uploadImage = () => {
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
    else{
      
    }
  }

  if (tabIndex !== undefined && index !== undefined) {
    if (tabIndex === index) {
      return (
        <ThemeProvider theme={theme}>
          <ToastContainer />
          {userInfo &&
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

export default Avatar