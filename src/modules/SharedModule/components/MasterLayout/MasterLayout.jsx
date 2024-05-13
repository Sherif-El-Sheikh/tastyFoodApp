import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './../Navbar/Navbar';
import SideBar from '../SideBar/SideBar'
import Loading from '../Loading/Loading';
import { AuthContext } from '../../../../context/AuthContext';


export default function MasterLayout() {

  let { isLoading, loginData} = useContext(AuthContext);
  

  const location = useLocation();
  if(location.pathname !== '/dashboard/recipeData') {
    localStorage.removeItem('recipeState');
    localStorage.removeItem('recipe');
  }
  return (
    
      <div className="d-flex">
        {!isLoading? 
        <>
          <div>
            <SideBar loginData={loginData}/>
          </div>
        <div className="w-100 overflow-y-auto vh-100">
            <Navbar loginData={loginData}/>
            <Outlet />
        </div>
        </>
        :
        <div className=" d-flex justify-content-center align-items-center vh-100 w-100">
          <Loading/>

        </div>
      }
        
      </div>
  )
}
