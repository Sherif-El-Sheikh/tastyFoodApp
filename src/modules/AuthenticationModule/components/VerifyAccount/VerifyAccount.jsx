import React, { useContext, useState } from 'react';
import logo from '../../../../assets/images/logo.png';
import {useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { ToastContext } from '../../../../context/ToastContext';

export default function VerifyAccount() {
    let {baseUrl} = useContext(AuthContext);
    let {getToastValue} = useContext(ToastContext);

    const navigate = useNavigate();
    const[isLoading,setLoading] = useState(false);

    let {register,
        handleSubmit,
        formState:{errors}} = useForm();
    
    const onSubmit = async (data)=> {
        // console.log(data);
        setLoading(true);
    try {
        let response = await axios.put(`${baseUrl}/Users/verify`, data);
        // console.log(response.data.message);
        getToastValue('success', response.data.message);
        navigate('/login');
        setLoading(false);
    }
    catch(error) {
        // console.log(error.response.data.message);
        getToastValue('error', error.response.data.message);
        setLoading(false);
    }
    }

    return (
    <div className="auth-container">
    <div className="container-fluid vh-100 bg-overlay">
    <div className="row vh-100 justify-content-center align-items-center">
        <div style={{borderRadius:'16px'}} className="col-md-6 bg-white p-sm-5 border-2 auth-width">
            <div className='text-center mb-2'>
            <img src={logo} className='logo' alt="authLogo" />
        </div>
        <div style={{fontFamily: '"Inter", sans-serif'}} className="form-content">
            <h3 className='auth-title'>Verify Account</h3>
            <p className='auth-headtitle'>Welcome Back! Please enter your details</p>

            <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`input-group mb-3 border-1 ${errors.email?'error' : ''}`}>
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
            {errors.email && <p className='alert alert-danger p-sm-2'>{errors.email.message}</p>}

            <div className={`input-group mb-3 border-1 ${errors.code?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type='text'
                className="form-control inputForm"
                placeholder='Verify Code'
                {...register('code', {
                required: 'Verify Code is required',

            })}/>
            </div>
            {errors.code && <p className='alert alert-danger p-sm-2'>{errors.code.message}</p>}

            <button className='btn btn-auth w-100 fs-sm'>Verify
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
