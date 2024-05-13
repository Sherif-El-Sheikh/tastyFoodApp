import React, { useContext, useState } from 'react';
import logo from '../../../../assets/images/logo.png';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { ToastContext } from '../../../../context/ToastContext';


export default function ResetPass() {
  let {baseUrl} = useContext(AuthContext);
  let {getToastValue} = useContext(ToastContext);

  const [showPassword, setShowPassword] = useState([false, false]);
  const[isLoading,setLoading] = useState(false);

  const togglePasswordVisibility = (spanNumber) => {
    const updatedShowPassword = [...showPassword];
    // console.log(updatedShowPassword);
    updatedShowPassword[spanNumber - 1] = !updatedShowPassword[spanNumber - 1];
    setShowPassword(updatedShowPassword);
    // console.log(updatedShowPassword);
  }

  const navigate = useNavigate();

  let {register,
    handleSubmit,
    watch,
    formState:{errors}} = useForm();

    const onSubmit = async (data)=> {
      // console.log(data);
      setLoading(true);
      try {
        let response = await axios.post(`${baseUrl}/Users/Reset`, data);
        // console.log(response);
        getToastValue('success', response.data.message);
        navigate('/login');
        setLoading(false);
      }
      catch (error) {
        // console.log(error.response.data.message);
        getToastValue('error', error.response.data.message);
        setLoading(false);
      }
    }

  return (
    <div className="auth-container">
    <div className="container-fluid vh-100 bg-overlay">
      <div className="row vh-100 justify-content-center align-items-center">
        <div style={{borderRadius:'16px'}} className="col-md-6 bg-white border-2 auth-width reset-p ">
          <div className='text-center mb-2'>
            <img src={logo} className='logo' alt="authLogo" />
          </div>
          <div style={{fontFamily: '"Montserrat", sans-serif'}} className="form-content">
            <h3 style={{fontWeight: '600'}} className='auth-title'> Reset  Password</h3>
            <p className='auth-headtitle'>Please Enter Your Otp  or Check Your Inbox</p>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`input-group mb-3 border-1 ${errors.email?'error' : ''}`}>
              <span className="input-group-text" id="basic-addon1">
              <i style={{color: '#6a737e'}} className="fa-regular fa-envelope"></i>
              </span>
              <input type="email"
              className="form-control inputForm reset-height"
              placeholder='Email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid mail'
                }
              })}
              />
            </div>
            {errors.email && <p className='alert alert-danger reset-alert'>{errors.email.message}</p>}
            <div className={`input-group mb-3 border-1 ${errors.seed?'error' : ''}`}>
              <span className="input-group-text" id="basic-addon1">
              <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
              </span>
              <input type="text"
              className="form-control inputForm reset-height"
              placeholder='OTP'
              {...register('seed', {
                required: 'verification code is required',
              })}
              />
            </div>
            {errors.seed && <p className='alert alert-danger reset-alert'>{errors.seed.message}</p>}
            <div className={`input-group mb-3 border-1 ${errors.password?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type={showPassword[0] ? 'text' : 'password'}
                className="form-control inputForm reset-height"
                placeholder='New Password'
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? ]).*$/i, 
                    message: 'at least 8 characters long, contain at least one letter, at least one digit, and at least one special character.'
                  }
                })}
                />
                <span onClick={() => togglePasswordVisibility(1)} className="input-group-text">
                  <i style={{color: '#6a737e'}} className={`fa-regular ${showPassword[0] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
              </div>
              {errors.password && <p className='alert alert-danger reset-alert'>{errors.password.message}</p>}
            <div className={`input-group mb-3 border-1 ${errors.confirmPassword?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type={showPassword[1] ? 'text' : 'password'}
                className="form-control inputForm reset-height"
                placeholder='Confirm New Password'
                {...register('confirmPassword', {
                  required: 'Confirm New Password is required',
                  validate: (value) => value === watch('password') || 'Confirm New Password not matched',
                })}
                />
                <span onClick={() => togglePasswordVisibility(2)} className="input-group-text">
                  <i style={{color: '#6a737e'}} className={`fa-regular ${showPassword[1] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
              </div>
              {errors.confirmPassword && <p className='alert alert-danger reset-alert'>{errors.confirmPassword.message}</p>}
            <button style={{fontFamily: '"Inter", sans-serif'}} className='btn btn-auth w-100 fs-sm mb-4'>Reset Password
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
