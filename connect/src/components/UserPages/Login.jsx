import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Logo from '../../images/connect-logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { OrbitSpace } from 'orbit-space'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies();

const Login = () => {
  const [existUser, setExistUser] = useState
    ({
      username: '',
      password: '',
    })
  const nav = useNavigate();

  useEffect(() => {
    if (cookies.get('token') !== undefined)
      nav('/connect')
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExistUser({ ...existUser, [name]: value });
  };

  const checkUser = (e) => {
    e.preventDefault();
    e.preventDefault();
    axios.post('http://localhost:5000/check-user', existUser)
      .then((response) => {
        if (response.data.status === 'ok') {
          cookies.set('token', response.data.token)
          toast.success(`${response.data.message}`, {
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
            onOpen: () => {
              setTimeout(() => {
                nav('/connect');
              }, 3000);
            },
            onClose: () => {
              clearTimeout();
            }
          });
        }
        else {
          toast.warn(`${response.data.message}`, {
            position: 'top-right',
            autoClose: 3000,
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
      })
      .catch((err) => {
        toast.error(`Please refresh and try again`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style:
          {
            fontFamily: "'Josefin Sans', sans-serif",
          },
        });
      })
  }

  return (
    <OrbitSpace>
      <LoginStyles>
        <div className='full-background'>
          <div className="main-content">
            <div className='brand'>
              <h3 className='brand-first'>INFINITY</h3>
              <h3 className='brand-last'>CONNECT</h3>
              <img className='logo' src={Logo} alt='Not found' />
            </div>
            <form className='form' style={{ width: "100%" }}>
              <input name='username' value={existUser.username} onChange={handleChange} type='text' placeholder='User name' required />
              <input name='password' value={existUser.password} onChange={handleChange} type='password' placeholder='Password' required />
              <button onClick={checkUser} type='submit'><h3>Let's&nbsp;Chat</h3></button>
            </form>
            <div className='need'>
              <span style={{ color: "white" }}>Need an account&nbsp;</span>
              <Link to='/register'>Register</Link>
            </div>
          </div>
        </div>
      </LoginStyles>
      <ToastContainer />
    </OrbitSpace>
  )
}

const LoginStyles = styled.div`
  *{
    font-family: "Josefin Sans", sans-serif;
    font-optical-sizing: auto;
    padding: 0;
    margin: 0;
    text-decoration: none;
  }

  ::-webkit-scrollbar {
    width: 5px; /* Adjust the width as needed */
  }

  ::-webkit-scrollbar-track {
      background: #f1f1f1; /* Color of the track */
  }

  ::-webkit-scrollbar-thumb {
      background: #888; /* Color of the handle */
  }

  .full-background{
    // background-color: #131324;
    width : 100vw;
    height : 100vh;
    display : flex;
    align-items: center;
    justify-content: center;
    overflow-x: hidden;
  }
  .brand{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-first{
    background: linear-gradient(to right, white, darkblue); /* Define your gradient colors */
    -webkit-background-clip: text; /* Clip the background to the text */
    -webkit-text-fill-color: transparent; 
  }
  .brand-last{
    background: linear-gradient(to right, darkblue, white); /* Define your gradient colors */
    -webkit-background-clip: text; /* Clip the background to the text */
    -webkit-text-fill-color: transparent; 
  }
  .logo{
    width : 4rem;
    height: 4rem;
  }
  .main-content{
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .form{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    input:focus::placeholder{
      color: darkblue;
    }
    input:focus{
      color: darkblue;
      background-color : white;
      outline: none;
    }
    input{
      width: 70%;
      background-color: transparent;
      border: 0.1rem solid darkblue;
      border-radius: 0.5rem;
      padding: 1rem;
      color: white;
    }
    input::placeholder{
      color: white;
    }
    button{
      width: 70%;
      background-color: darkblue;
      border-style: none;
      border-radius: 0.5rem;
      padding: 1rem;
      color: white;
      transition: 0.3s ease-out;
    }
    button:hover{
      cursor: pointer;
      background: linear-gradient(to left, white, darkblue);
      h3{
        background: linear-gradient(to left, darkblue, white); /* Define your gradient colors */
        -webkit-background-clip: text; /* Clip the background to the text */
        -webkit-text-fill-color: transparent; 
      }
    }
  }
  .need{
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export default Login