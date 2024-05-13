import React, { useContext, useState } from 'react';
import logo from '../../../../assets/images/logo.png';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { ToastContext } from '../../../../context/ToastContext';


export default function ForgetPass() {

  let {baseUrl} = useContext(AuthContext);
  let {getToastValue} = useContext(ToastContext);

  let [emailError, setEmailError] = useState(false);
  const[isLoading,setLoading] = useState(false);

  const navigate = useNavigate();

  let {register,
    handleSubmit,
    formState:{errors}} = useForm();

    const onSubmit = async (data)=> {
      // console.log(data);
      setLoading(true);
      try {
        let response = await axios.post(`${baseUrl}/Users/Reset/Request`, data);
        // console.log(response.data.message);
        getToastValue('success', response.data.message);
        navigate('/resetpass');
        setEmailError(false);
        setLoading(false);
      }
      catch (error) {
        // console.log(error);
        getToastValue('error', error.response.data.message);
        setEmailError(true);
        setLoading(false);
      }
    }

  return (
    <div className="auth-container">
    <div className="container-fluid vh-100 bg-overlay">
      <div className="row vh-100 justify-content-center align-items-center">
        <div style={{borderRadius:'16px'}} className="col-md-6 bg-white border-2 auth-width p-auth">
          <div className='text-center mb-4'>
            <img src={logo} className='logo' alt="authLogo" />
          </div>
          <div style={{fontFamily: '"Inter", sans-serif'}} className="form-content">
            <h3 className='auth-title'>Forgot Your Password?</h3>
            <p className='auth-headtitle mb-5'>No worries! Please enter your email and we will send a password reset link</p>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`input-group mb-5 border-1 ${errors.email || emailError?'error' : ''}`}>
              <span className="input-group-text" id="basic-addon1">
              <i style={{color: '#6a737e'}} className="fa-solid fa-mobile-screen"></i>
              </span>
              <input type="email"
              className="form-control inputForm"
              placeholder='Enter your email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid mail'
                }
              })}/>
            </div>
            {errors.email && <p className='alert alert-danger'>{errors.email.message}</p>}
            <button className='btn btn-auth w-100 fs-sm mb-4'>Submit
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
