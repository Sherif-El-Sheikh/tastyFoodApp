import React from 'react';
import notfoundLogo from '../../../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';

export default function Notfound() {

  const navigate = useNavigate();

  const goHome = ()=> {
    navigate('/')
  }

  return (
    <div className="not-found">
      <div className="container-fluid">
          <div className="logo p-4 mb-3">
        <img src={notfoundLogo} className='img-fluid' alt="notfoundLogo" />
        </div>
        <div className="notFound-content">
            <h2>Oops<span className="dot"></span> </h2>
            <h3>Page  not found </h3>
            <div className="dots">
            <span className="dot"></span> <span className="dot"></span> <span className="dot"></span>
            </div>
            <p>This Page doesn’t exist or was removed! We suggest you  back to home.</p>
            <button onClick={goHome} className='btn btn-notfound d-flex justify-content-center align-items-center'> <i className="fa-solid fa-arrow-left mx-3"></i> <span className='w-25 d-inline-block'> Back To Home</span> </button>
        </div>
          </div>
        </div>



  )
}
