import React, { useContext, useState } from 'react';
import logo from '../../../../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller  } from 'react-hook-form';
import axios from 'axios';
import { DropzoneArea } from "mui-file-dropzone";
import { AuthContext } from '../../../../context/AuthContext';
import { ToastContext } from '../../../../context/ToastContext';

export default function Register() {
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
    control,
    formState:{errors}} = useForm();

    const appendToFormData = (data) => {
      const formData = new FormData();
      formData.append('userName', data.userName);
      formData.append('country', data.country);
      formData.append('password', data.password);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('profileImage', data.profileImage[0]);
      return formData;
  }

  const onSubmit = async (data)=> {
    let registerFormData = appendToFormData(data);
    // console.log(registerFormData);
    setLoading(true);
    try {
      let response = await axios.post(`${baseUrl}/Users/Register`, registerFormData);
      // console.log(response.data.message);
      getToastValue('success', response.data.message);
      navigate('/verifyAccount');
      setLoading(false);
    }
    catch(error) {
      // console.log(error.response.data.message);
      getToastValue('error', error.response.data.message);
      setLoading(false);
    }
  }



  return (
    <div className="auth-container register">
    <div className="container-fluid vh-100 bg-overlay overflow-auto">
      <div className="row vh-100 justify-content-center align-items-center">
        <div style={{borderRadius:'16px'}} className="col-md-6 bg-white p-sm-5 border-2 auth-width registerWidth">
          <div className='text-center mb-2'>
            <img src={logo} className='logo' alt="authLogo" />
          </div>
          <div style={{fontFamily: '"Inter", sans-serif'}} className="form-content">
            <h3 className='auth-title'>Register</h3>
            <p className='auth-headtitle'>Welcome Back! Please enter your details</p>
          
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">

                  <div className={`input-group ${errors.userName?'mb-2' : 'mb-3'} border-1 ${errors.userName?'error' : ''}`}>
                      <span className="input-group-text" id="basic-addon1">
                        <i style={{color: '#6a737e'}} className="fa-solid fa-circle-user"></i>
                    </span>
                  <input type="text"
                    className="form-control inputForm"
                    placeholder='UserName'
                    {...register('userName', {
                      required: 'UserName is required',
                      pattern: {
                      value: /^[A-Za-z]{4,8}\d+$/i,
                      message: 'start with a letter, contain only letters and digits, must ends with a single digit and have a length between 4 and 8 characters'
                      }
                    })}/>
                  </div>
                  {errors.userName && <p className='alert alert-danger reset-alert'>{errors.userName.message}</p>}

                  <div className={`input-group ${errors.country?'mb-2' : 'mb-3'} border-1 ${errors.country?'error' : ''}`}>
                      <span className="input-group-text" id="basic-addon1">
                        <i style={{color: '#6a737e'}} className="fa-solid fa-earth-africa"></i>
                    </span>
                  <input type="text"
                    className="form-control inputForm"
                    placeholder='Country'
                    {...register('country', {
                      required: 'Country is required',
                      pattern: {
                        value: /^[A-Za-z][a-z]+([A-Z][a-z]+)*$/i,
                        message: 'Invalid Country'
                      }
                    })}/>
                  </div>
                  {errors.country && <p className='alert alert-danger reset-alert'>{errors.country.message}</p>}

                  <div className={`input-group ${errors.password?'mb-2' : 'mb-3'} border-1 ${errors.password?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type={showPassword[0] ? 'text' : 'password'}
                className="form-control inputForm reset-height"
                placeholder='Password'
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
                  </div>

                  <div className="col-md-6">
                  <div className={`input-group ${errors.email?'mb-2' : 'mb-3'} border-1 ${errors.email?'error' : ''}`}>
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
            {errors.email && <p className='alert alert-danger reset-alert'>{errors.email.message}</p>}

            <div className={`input-group ${errors.phoneNumber?'mb-2' : 'mb-3'} border-1 ${errors.phoneNumber?'error' : ''}`}>
                      <span className="input-group-text" id="basic-addon1">
                        <i style={{color: '#6a737e'}} className="fa-solid fa-phone"></i>
                    </span>
                  <input type="tel"
                    className="form-control inputForm"
                    placeholder='PhoneNumber'
                    {...register('phoneNumber', {
                      required: 'Phone Number is required',
                      pattern: {
                        value: /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/i,
                        message: 'Invalid Phone Number'
                      }
                    })}/>
                  </div>
                  {errors.phoneNumber && <p className='alert alert-danger reset-alert'>{errors.phoneNumber.message}</p>}

                  <div className={`input-group ${errors.confirmPassword?'mb-2' : 'mb-3'} border-1 ${errors.confirmPassword?'error' : ''}`}>
                <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#6a737e'}} className="fa-solid fa-lock"></i>
                </span>
                <input type={showPassword[1] ? 'text' : 'password'}
                className="form-control inputForm reset-height"
                placeholder='Confirm-password'
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: (value) => value === watch('password') || 'Confirm Password not matched',
                })}
                />
                <span onClick={() => togglePasswordVisibility(2)} className="input-group-text">
                  <i style={{color: '#6a737e'}} className={`fa-regular ${showPassword[1] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
              </div>
              {errors.confirmPassword && <p className='alert alert-danger reset-alert'>{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div className={`${errors.profileImage?'mb-2' : 'mb-3'}`}>
            <Controller
                name="profileImage"
                control={control}
                rules={{ required: 'Profile Image is required' }}
                render={({ field }) => (
                    <DropzoneArea
                        acceptedFiles={['image/*']}
                        dropzoneText="Drag & Drop or Choose an Item Image to Upload"
                        filesLimit={1}
                        onChange={(files) => {
                            // console.log('Files:', files);
                            field.onChange(files);
                        }}
                    />
                )}
            />
                {errors.profileImage && <p className='alert alert-danger reset-alert text-start mt-2'>{errors.profileImage.message}</p>}
                </div>

                <div style={{fontWeight:'500', lineHeight:'19.36px'}} className="links d-flex justify-content-end my-3">
                <Link to='/login' style={{color: '#4AA35A'}} className='text-decoration-none fs-sm-link'>Login Now?</Link>
              </div>
            <button className='btn btn-auth w-100 fs-sm'>Register
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
