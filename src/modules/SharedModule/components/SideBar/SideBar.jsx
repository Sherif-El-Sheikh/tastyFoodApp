import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import toggler from '../../../../assets/images/3.png';
import Modal from 'react-bootstrap/Modal';
import ChangePass from '../../../AuthenticationModule/components/ChangePass/ChangePass';
import { AuthContext } from '../../../../context/AuthContext';







export default function SideBar() {
  let {loginData} = useContext(AuthContext);

  const[isCollapse, setIsCollapse] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleCollapse = ()=> {
    if (window.innerWidth > 576) {
      setIsCollapse(!isCollapse);
    }
  }

  useEffect(()=> {
  if (window.innerWidth <= 576) {
    setIsCollapse(!isCollapse);
  }
  },[])

  const navigate = useNavigate();
  const logOut = ()=> {
    localStorage.removeItem('token');
    localStorage.removeItem('notification');
    navigate('/login')
  }



  return (

    <>
    <Modal show={show} onHide={handleClose}>
        <Modal.Body>
        <ChangePass logOut={logOut}/>
        </Modal.Body>
      </Modal>
      
    <div style={{fontFamily: '"Inter", sans-serif'}} className='sidebar-container'>
    <Sidebar collapsed={isCollapse}>
      <Menu>
        <MenuItem className={`${!isCollapse? 'ms-5':''} pt-3 pb-3 mt-4 mb-4`} onClick={toggleCollapse} icon={<img className={`${isCollapse? 'imgCollapse':''}`} src={toggler} alt="togglerMenu" />}></MenuItem>
        <MenuItem className='mb-3 mb1' icon={<i className="fa-solid fa-house fs-5"></i>} component={<Link to="/dashboard" />} active={window.location.hash === '#/dashboard' && show == false}> Home </MenuItem>
        
        {loginData?.userGroup === 'SuperAdmin' ?
        <MenuItem className='mb-3 mb1' icon={<i className="bi bi-people fs-5"></i>} component={<Link to="/dashboard/users" />} active={window.location.hash === '#/dashboard/users' && show == false}> Users </MenuItem>
        :
        ''
        }

        <MenuItem className='mb-3 mb1' icon={<i className="bi bi-columns-gap fs-5"></i>} component={<Link to="/dashboard/recipes" />} active={window.location.hash === '#/dashboard/recipes' && show == false}> Recipes </MenuItem>
        
        {loginData?.userGroup === 'SuperAdmin' ?
        <MenuItem className='mb-3 mb1' icon={<i className="fa-regular fa-calendar-days fs-5"></i>} component={<Link to="/dashboard/categories" />} active={window.location.hash === '#/dashboard/categories' && show == false}> Categories </MenuItem>
        :
        ''
      }
      {loginData?.userGroup === 'SystemUser' ?
            <MenuItem className='mb-3 mb1' icon={<i className="fa-regular fa-heart fs-5"></i>} component={<Link to="/dashboard/favs" />} active={window.location.hash === '#/dashboard/favs' && show == false}> Favorites </MenuItem>
      
    :
    ''
    
    }
        <MenuItem onClick={handleShow} className='mb-3 mb1' icon={<i className="fa-solid fa-unlock-keyhole fs-5"></i>} active={show == true}> Change Password </MenuItem>
        <MenuItem onClick={logOut} icon={<i className="fa-solid fa-right-from-bracket fs-5"></i>}> Logout </MenuItem>
      </Menu>
    </Sidebar>
    </div>
    </>
  
  )
}
