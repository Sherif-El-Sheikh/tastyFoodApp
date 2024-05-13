import React, { useContext, useEffect, useState } from 'react';
import usersAvatar from '../../../../assets/images/header.png';
import Header from '../../../SharedModule/components/Header/Header';
import NoData from '../../../SharedModule/components/NoData/NoData';
import Loading from '../../../SharedModule/components/Loading/Loading';
import axios from 'axios';
import noDataAvatar from '../../../../assets/images/no-data.png';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DeleteData from '../../../SharedModule/components/DeleteData/DeleteData';
import {ThreeDots } from 'react-loader-spinner';
import { AuthContext } from '../../../../context/AuthContext';
import {useNavigate } from 'react-router-dom';
import { ToastContext } from '../../../../context/ToastContext';



export default function UsersList() {

  let {requestHeaders, baseUrl, loginData, setShowCricle} = useContext(AuthContext);
  let {getToastValue} = useContext(ToastContext);

  const navigate = useNavigate();

  const[arrayOfPages, setArrayOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [activePage, setActivePage] = useState(1); 

  const[nameValue, setNameValue] = useState('');
  const[emailValue, setEmailValue] = useState('');
  const[groupValue, setGroupValue] = useState('');

  const[usersList, setUsersList] = useState([]);
  const[isLoading,setLoading] = useState(false);
  const[isLoadingSpinner,setLoadingSpinner] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const[userId, setUserId] = useState();

  const [showUser, setShowUser] = useState(false);
  const [userDetails, setuserDetails] = useState(null);


  const handleViewUserClose = () => setShowUser(false);
    
  const handleViewUserShow = (id) =>{
    getUserDetails(id);
    setShowUser(true);
    } 


  const handleDeleteClose = () => setShowDelete(false);
  

  const handleDeleteShow = (id) =>{
    setUserId(id);
    // console.log(id)
    setShowDelete(true);
    } 

  const getUsersList = async(userName, email, groups, pageSize, pageNumber)=> {
    setLoading(true);
    try{
      let response = await axios.get(`${baseUrl}/Users/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        headers: requestHeaders,
        params:{
          'userName': userName,
          'email': email,
          'groups': groups
        }
      }
    );
    setArrayOfPages(Array(response.data.totalNumberOfPages)
    .fill()
    .map((_, i) => i+1)
  );
  setCurrentPage(response.data.pageNumber)
  setTotalPages(response.data.totalNumberOfPages)
    // console.log(response.data.data)
    setUsersList(response.data.data);
    setTimeout(() => {
      setLoading(false);
    }, 1800);
    }
    catch(error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    }
  }


  const getUserDetails = async (userId)=> {
    // console.log(categoryId)
    setLoadingSpinner(true);
    try {
      let response = await axios.get(`${baseUrl}/Users/${userId}`,
      {headers: requestHeaders}
    );
      // console.log(response.data);
      setuserDetails(response.data);
      setLoadingSpinner(false);
      // console.log(userDetails)
    }
    catch (error) {
      console.log(error);
      setLoadingSpinner(false);
    }
  }

  const onDeleteSubmit = async ()=> {
    
    setLoadingSpinner(true);
    try {
      let response = await axios.delete(`${baseUrl}/Users/${userId}`,
      {headers: requestHeaders}
    );
      // console.log(response.data.message);
      handleDeleteClose();
      getUsersList('','','', 15, 1);
      getToastValue('success', response.data.message);
      setLoadingSpinner(false);
      localStorage.setItem('notification', 'you deleted a user')
      setShowCricle(true);
    }
    catch (error) {
      // console.log(error);
      getToastValue('error', 'Cannot delete admin');
      setLoadingSpinner(false);
      handleDeleteClose();
    }
  }

  const getNameValue = (input)=> {
    setNameValue(input.target.value);
    getUsersList(input.target.value, emailValue, groupValue, 15, 1)
  }
  const getEmailValue = (input)=> {
    setEmailValue(input.target.value);
    getUsersList(nameValue, input.target.value, groupValue, 15, 1)
  }
  const getGroupValue = (input)=> {
    setGroupValue(input.target.value);
    getUsersList(nameValue, emailValue, input.target.value, 15, 1)
  }

  useEffect(()=> {
    if(loginData.userGroup === 'SystemUser' ) {
      navigate('/notfound')
    }else {
      getUsersList('','','', 15, 1);
    }
    
  },[])


  return (
    <>
    <Header title={'Users'} description={'You can now add your items that any user can order it from the Application and you can edit'} imgUrl={usersAvatar} userName={'List'}/>
    

    <Modal show={showDelete} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <h3 className='modalTitle'>Delete Recipe</h3>
        </Modal.Header>
        <Modal.Body>
              <DeleteData deleteItem ='User' />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onDeleteSubmit} className='delete'>Delete this item
          {isLoadingSpinner?
                <span>
                  <i className='fa-solid text-danger mx-2 fa-spinner fa-spin'></i>
              </span>
              : ''
            }
          </Button>
        </Modal.Footer>
      </Modal>

    <Modal show={showUser} onHide={handleViewUserClose}>
    {!isLoadingSpinner?
    <>
                <Modal.Header closeButton>
            <h3 style={{fontSize:'17px'}} className='modalTitle'><span style={{color:'#009247'}}><i className="fa-solid fa-circle-user me-1"></i>Name:</span> {userDetails?.userName}</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="recipeInfo ">
            <i style={{color:'#009247'}} className="bi bi-person-bounding-box ms-3"></i>
            <div className='text-center'>
            {userDetails && userDetails.imagePath?
                          <img style={{width:'242px', height:'168px', borderRadius:'8px'}} src={`https://upskilling-egypt.com:3006/${userDetails.imagePath}`} className='img-fluid mb-3' alt="user picture" />
                          :
                          <img style={{width:'242px', height:'168px', borderRadius:'8px'}} src={noDataAvatar} className='img-fluid mb-3' alt="nodata avatar" />
                        }
            </div>
            <p style={{color:'#000000', overflowWrap:'break-word'}} className='ms-3' ><span style={{color:'#009247'}}><i className="bi bi-envelope-at-fill me-1"></i>Email:</span> {userDetails?.email}</p>
            {userDetails && userDetails.phoneNumber && (
                <p style={{ color: '#000000' }}><span style={{color:'#009247'}} className='ms-3'><i className="fa-solid fa-mobile-screen me-1"></i>phone Number:</span> {userDetails.phoneNumber}</p>
                  )}
            {userDetails && userDetails.country && (
                <p style={{ color: '#000000' }}><span style={{color:'#009247'}} className='ms-3'><i className="fa-solid fa-earth-africa me-1"></i>Country:</span> {userDetails.country}</p>
                  )}
            {userDetails && userDetails.group.name && (
                <p style={{ color: '#000000' }}><span style={{color:'#009247'}} className='ms-3'><i className="bi bi-person-vcard me-1"></i>User Type:</span> {userDetails.group.name}</p>
                  )}
            {userDetails && userDetails.creationDate && (
                <p style={{ color: '#000000' }}><span style={{color:'#009247'}} className='ms-3'><i className="bi bi-calendar2-minus me-1"></i>Creation Date: </span>{new Date(userDetails.creationDate).toLocaleString('en-US')}</p>
                  )}
            </div>
          </Modal.Body>
    </>
      :
      <div style={{height:'500px'}} className=" d-flex justify-content-center align-items-center">
          <ThreeDots
  visible={true}
  height="80"
  width="80"
  color="#4fa94d"
  radius="9"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
  </div>
  
  }
        <Modal.Footer>
          <Button variant="danger" onClick={handleViewUserClose} className='delete'>Close</Button>
        </Modal.Footer>
      </Modal>




    <div className="recipes-container users-container">
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-6">
          <h4 className='head-title'>Users Table Details</h4>
          <p className='sub-description'>You can check all details</p>
        </div>
      </div>

      <div className="filteration mb-2">
        <div className="row ">
          <div className="col-md-4 ">
          <div className={`input-group border-1 mb-2 `}>
          <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#45474a'}} className="fa-regular fa-user"></i>
                </span>
            <input type="text"
            className="form-control inputForm"
            placeholder='Search by name'
            onChange={getNameValue}
          />
        </div>
          </div>
          <div className="col-md-4 ">
          <div className={`input-group border-1 mb-2 `}>
          <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#45474a'}} className="fa-regular fa-envelope"></i>
                </span>
            <input type="email"
            className="form-control inputForm"
            placeholder='Search by email'
            onChange={getEmailValue}
          />
        </div>
          </div>
          <div className="col-md-4 d-flex justify-content-center">
          <div className={`input-group  border-1 mb-2 `}>
        <select   className="form-select form-control inputForm " 
        onChange={getGroupValue}
        >
            <option value='' >Role</option>
            <option  value='1' >Admin</option>
            <option  value='2' >User</option>
        </select>
    </div>
          </div>
        </div>
        </div>
    
              {!isLoading?
      
      <>
            {usersList.length >0 ?
            <>
              <table className="table table-striped table-borderless table-responsive">
              <thead className='table-light'>
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Image</th>
                { window.innerWidth <= 576?''
                :
                <th scope="col">Email</th>
                }
                <th scope="col">Phone</th>
                <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {usersList.map((item) => (
                  <tr key={item.id}>
                          <td>{item.userName}</td>
                          <td>{item.imagePath?
                          <img src={`https://upskilling-egypt.com:3006/${item.imagePath}`}  alt="userimage" />
                          :
                          <img src={noDataAvatar} className='img-fluid' alt="nodata avatar" />
                        }
                        </td>
                        { window.innerWidth <= 576?''
                          :
                          <td>{item.email}</td>
                        }
                        <td>{item.phoneNumber}</td>
                          <td>
                          <div className="dropdown">
                            <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="fa-solid fa-ellipsis"></i>
                            </button>
                          <ul className="dropdown-menu">
                          <li onClick={()=> handleViewUserShow(item.id)} className='dropdown-item'> <i style={{color:'#009247'}} className="fa-regular fa-eye mb-2 me-2"></i> <span>View</span> </li>
                              <li onClick={()=> handleDeleteShow(item.id)} className='dropdown-item'><i className="fa-solid fa-trash text-danger me-2"></i> <span>Delete</span></li>
                          </ul>
                      </div>
                          </td>
                        </tr>
                        )
                  )}
              </tbody>
                </table>



                <nav aria-label="Page navigation example" className='d-flex justify-content-end mt-4  padding users'>
                <ul className="pagination" >
                    <li className= {` page-item prev ${currentPage <=1 ? "disabled" : ""}`} 
                  onClick={() => {
                        if (currentPage > 1) {
                          setActivePage(currentPage - 1);
                          getUsersList(nameValue, emailValue, groupValue, 15, currentPage - 1);
                            }
                          }}>
                  <a className={`page-link ${currentPage <=1 ? "disabled" : ""}`} aria-label="Previous">
                      <span aria-hidden="true">Previous</span>
                </a>
              </li>
              
              {arrayOfPages.map((pageNo) => (
    <li
      onClick={() => {
        setActivePage(pageNo); // Set the active page
        getUsersList(nameValue, emailValue, groupValue, 15, pageNo);
      }}
      key={pageNo}
      className={`page-item ${activePage === pageNo ? "active" : ""}`}
    >
      <a className="page-link">{pageNo}</a>
    </li>
    ))}
                      <li
            className={`page-item next ${currentPage >= totalPages ? "disabled" : ""}`}
            onClick={() => {
              if (currentPage < totalPages) {
                setActivePage(currentPage + 1);
                getUsersList(nameValue, emailValue, groupValue, 15, currentPage + 1);
              }
            }}
          >
            <a className={`page-link ${currentPage >= totalPages ? "disabled" : ""}`} aria-label="Next">
              <span aria-hidden="true">Next</span>
            </a>
          </li>
  </ul>
        </nav>



                </>

        :
        <>
        <table className="table table-striped table-borderless table-responsive">
              <thead className='table-light'>
                <tr>
                <th scope="col">#</th>
                <th scope="col">User Name</th>
                <th scope="col">Image</th>
                <th scope="col">Phone Number</th>
                { window.innerWidth <= 576?''
                :
                <th scope="col">Email</th>
                }
                <th scope="col">Actions</th>
                </tr>
              </thead>
                </table>
        <NoData/>
        </>
        }
      </>
      
      :
        <Loading/>
      
      }


    </div>
    </div>
    </>
  )
}
