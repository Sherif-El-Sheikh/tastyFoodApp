import React, { useContext, useEffect, useRef, useState } from 'react';
import navbarLogo from '../../../../assets/images/avatar.png'
import { AuthContext } from '../../../../context/AuthContext';


export default function Navbar() {
  
  let {loginData, currentUser, showCircle, setShowCricle} = useContext(AuthContext);


  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const[showCircle, setShowCricle] = useState(true)
  const dropdownRef = useRef(null);

  let notification = localStorage.getItem('notification')

  const handleBellClick = () => {
    setDropdownOpen(!isDropdownOpen);
    setShowCricle(false)
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setShowCricle(false)
    }
  };



  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if the notification state has changed (e.g., from local storage)
    const notificationState = localStorage.getItem('notification');
    if (notificationState === 'true') {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  }, []);

  return (

    <div className="nav-content">
<nav className="navbar navbar-expand-sm navbar-light mt-4 p-2 mx-3 mb-3">
      <div className="container">
      <div className="input-group flex-nowrap">
        {/* <span className="input-group-text" id="addon-wrapping"><i className="bi bi-search"></i></span> */}
        {/* <input type="text" className="form-control" placeholder="Search Here" /> */}
        </div>
        
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <span className="nav-link" >
                {currentUser.imagePath? 
                <img  className='me-2 d-inline-flex rounded-circle' src={`https://upskilling-egypt.com:3006/${currentUser.imagePath}`} alt="user picture" />
                :
                <img className='me-2 d-inline-flex' src={navbarLogo} alt="navbarAvatar" />
              }
              
              <h6 className='navUserName d-inline mx-2'>{loginData?.userName}</h6>
              </span>
            </li>
            {/* <li className="nav-item dropdown mx-2">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropdownId"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                ></a>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownId"
              >
                <a className="dropdown-item" href="#"
                  >Action 1</a>
                <a className="dropdown-item" href="#"
                  >Action 2</a>
              </div>
            </li> */}
            {/* <li className="nav-item position-relative mx-2">
              <a className="nav-link" href="#">
                <i className="fa-solid fa-bell "></i>
                <span className="position-absolute bg-notification badge text-light">
                <i className="fa-solid fa-circle"></i>
                </span>
                </a>
            </li> */}
            <div className="notification-dropdown position-relative mt-3 mx-2" ref={dropdownRef}>
      <a className="bell-icon" onClick={handleBellClick}>
        <i style={{cursor:'pointer', color:'rgb(123 125 128) '}} className="fa-solid fa-bell"></i>
        {notification?
        <>
        {!isDropdownOpen && showCircle && (
    <span className={`position-absolute bg-notification badge text-light`}>
      <i className="fa-solid fa-circle"></i>
    </span>
  )}
        </>
  
          :
        ''
        }
      
        
      </a>
      {isDropdownOpen && (
        <div style={{width:'265px', border:'1px solid rgba(0, 0, 0, 0.175)'}} className="dropdown-content position-absolute bg-white p-3 rounded-2">
          <p style={{ color: '#009247', fontSize:'14px' }}>{notification}</p>
        </div>
      )}
    </div>
          </ul>
        </div>
      </div>
    </nav>
    </div>
    
    
  
  )
}
