import React, { useContext, useEffect, useState } from 'react';
import logo from '../../../../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { ToastContext } from '../../../../context/ToastContext';



export default function LogIn() {

  let {baseUrl,saveLoginData} = useContext(AuthContext);
  let {getToastValue} = useContext(ToastContext);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const[isLoading,setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const navigate = useNavigate();

  let {register,
      handleSubmit,
      formState:{errors}} = useForm();

  const onSubmit = async (data)=> {
    // console.log(data);
    setLoading(true);
    try {
      let response = await axios.post(`${baseUrl}/Users/Login`, data);
      // console.log(response.data.token);
      localStorage.setItem('token',response.data.token);
      saveLoginData();
      getToastValue('success','Login Successfully')
      navigate('/dashboard');
      setLoading(false);
      // window.history.replaceState(state, title, url);
      // window.history.replaceState(null, null, '/dashboard');
    }
    catch(error) {
      console.log(error.response.data);
      getToastValue('error',error.response.data.message);
      setErrorMessage(error.response.data.message);
      setLoading(false);
    }
  }

  useEffect(()=> {
    if(localStorage.getItem('token')) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [])


  return (
    <div className="auth-container">
      <div className="container-fluid vh-100 bg-overlay">
        <div className="row vh-100 justify-content-center align-items-center">
          <div style={{borderRadius:'16px'}} className="col-md-6 bg-white p-sm-5 border-2 auth-width">
            <div className='text-center mb-2'>
              <img src={logo} className='logo' alt="authLogo" />
            </div>
            <div style={{fontFamily: '"Inter", sans-serif'}} className="form-content">
              <h3 className='auth-title'>Log In</h3>
              <p className='auth-headtitle'>Welcome Back! Please enter your details</p>
              <form onSubmit={handleSubmit(onSubmit)}>
              <div className={`input-group mb-3 border-1 ${errors.email || errorMessage.startsWith('Cannot')?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-mobile-screen"></i>
                </span>
                <input type="email"
                className="form-control inputForm"
                placeholder='Enter your E-mail'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid mail'
                  }
                })}/>
              </div>
              {errors.email && <p className='alert alert-danger'>{errors.email.message}</p>}
              <div className={`input-group mb-3 border-1 ${errors.password || errorMessage === "Invalid password"?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type={showPassword ? 'text' : 'password'}
                className="form-control inputForm"
                placeholder='Password'
                {...register('password', {
                  required: 'Password is required',
              /*    pattern: {
                    value: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? ]).*$/i, 
                    message: 'Invalid password'
                  } */
                })}/>
                <span onClick={togglePasswordVisibility} className="input-group-text">
                  <i style={{color: '#6a737e'}} className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
              </div>
              {errors.password && <p className='alert alert-danger'>{errors.password.message}</p>}
              <div style={{fontWeight:'500', lineHeight:'19.36px'}} className="links d-flex justify-content-between my-3">
                <Link to='/register' style={{color: '#3A3A3D'}} className='text-decoration-none fs-sm-link'>Register Now?</Link>
                <Link to='/forgotpass' style={{color: '#4AA35A'}} className='text-decoration-none fs-sm-link'>Forgot Password?</Link>
              </div>
              <button className='btn btn-auth w-100 fs-sm'>Login
              {isLoading?
                <span>
                  <i className='fa-solid text-light mx-2 fa-spinner fa-spin'></i>
              </span>
              : ''
            }
              </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
