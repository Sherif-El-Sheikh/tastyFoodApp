import React, { useContext, useState } from 'react';
import logo from '../../../../assets/images/logo.png';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { ToastContext } from '../../../../context/ToastContext';



export default function ChangePass({logOut}) {

  let {baseUrl} = useContext(AuthContext);
  let {getToastValue} = useContext(ToastContext);

  const [showPassword, setShowPassword] = useState([false, false]);
  const[isLoadingSpinner,setLoadingSpinner] = useState(false);

  const togglePasswordVisibility = (spanNumber) => {
    const updatedShowPassword = [...showPassword];
    // console.log(updatedShowPassword);
    updatedShowPassword[spanNumber - 1] = !updatedShowPassword[spanNumber - 1];
    setShowPassword(updatedShowPassword);
    // console.log(updatedShowPassword);
  }

  let {register,
    handleSubmit,
    watch,
    formState:{errors}} = useForm();

    const onSubmit = async (data)=> {
      // console.log(data);
      setLoadingSpinner(true);
      try {
        let response = await axios.put(`${baseUrl}/Users//ChangePassword`,
        data,
        {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
        );
        // console.log(response.data.message);
        getToastValue('success', response.data.message);
        logOut();
        setLoadingSpinner(false);
      }
      catch(error) {
        // console.log(error.response.data);
        getToastValue('error', error.response.data.message);
        setLoadingSpinner(false);
      }
    }
  

  return (
        <div className="auth-container">
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center ">
          <div  className="col-md-12 p-sm-3">
            <div className='text-center mb-2'>
              <img src={logo} className='logo w-50' alt="authLogo" />
            </div>
            <div style={{fontFamily: '"Montserrat", sans-serif'}} className="form-content">
              <h3 className='auth-title'>Change Your Password</h3>
              <p className='auth-headtitle'>Enter your details below</p>

              <form onSubmit={handleSubmit(onSubmit)}>

              <div className={`input-group mb-3 border-1 ${errors.oldPassword?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type={showPassword[0] ? 'text' : 'password'}
                className="form-control inputForm reset-height"
                placeholder='Old Password'
                {...register('oldPassword', {
                  required: 'Old password is required',
                })}
                />
                <span onClick={() => togglePasswordVisibility(1)} className="input-group-text">
                  <i style={{color: '#6a737e'}} className={`fa-regular ${showPassword[0] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
              </div>
              {errors.oldPassword && <p className='alert alert-danger reset-alert'>{errors.oldPassword.message}</p>}
              
              <div className={`input-group mb-3 border-1 ${errors.newPassword?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type={showPassword[1] ? 'text' : 'password'}
                className="form-control inputForm reset-height"
                placeholder='New Password'
                {...register('newPassword', {
                  required: 'New Password is required',
                  pattern: {
                    value: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? ]).*$/i, 
                    message: 'at least 8 characters long, contain at least one letter, at least one digit, and at least one special character.'
                  }
                })}
                />
                <span onClick={() => togglePasswordVisibility(2)} className="input-group-text">
                  <i style={{color: '#6a737e'}} className={`fa-regular ${showPassword[1] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
              </div>
              {errors.newPassword && <p className='alert alert-danger reset-alert'>{errors.newPassword.message}</p>}
            
            
            <div className={`input-group mb-3 border-1 ${errors.confirmNewPassword?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type={showPassword[2] ? 'text' : 'password'}
                className="form-control inputForm reset-height"
                placeholder='Confirm New Password'
                {...register('confirmNewPassword', {
                  required: 'Confirm New Password is required',
                  validate: (value) => value === watch('newPassword') || 'Confirm New Password not matched',
                })}
                />
                <span onClick={() => togglePasswordVisibility(3)} className="input-group-text">
                  <i style={{color: '#6a737e'}} className={`fa-regular ${showPassword[2] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
              </div>
              {errors.confirmNewPassword && <p className='alert alert-danger reset-alert'>{errors.confirmNewPassword.message}</p>}

              <button className='btn btn-auth w-100 fs-sm'>Change Password
              {isLoadingSpinner?
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
