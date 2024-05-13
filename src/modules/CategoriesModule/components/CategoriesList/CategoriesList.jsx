import React, { useContext, useEffect, useState } from 'react';
import categoriesAvatar from '../../../../assets/images/header.png';
import Header from '../../../SharedModule/components/Header/Header';
import axios from 'axios';
import NoData from '../../../SharedModule/components/NoData/NoData';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import DeleteData from '../../../SharedModule/components/DeleteData/DeleteData';
import Loading from '../../../SharedModule/components/Loading/Loading';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../../../context/ToastContext';



export default function CategoriesList() {

  let{baseUrl, requestHeaders, loginData, setShowCricle} = useContext(AuthContext);
  let {getToastValue} = useContext(ToastContext);

  const navigate = useNavigate();

  const [activePage, setActivePage] = useState(1); 
  const[nameValue, setNameValue] = useState('');
  const[arrayOfPages, setArrayOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();

  const[categoriesList, setCategoriesList] = useState([]);
  const[isLoading,setLoading] = useState(false);
  const[isLoadingSpinner,setLoadingSpinner] = useState(false);

  const[categoryId, setCategoryId] = useState();

  const [modalState, setModalState] = useState();

  const [showDelete, setShowDelete] = useState(false);
  
  const [showUpdate, setUpdateShow] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setValue("name", null);
    setShow(true)
  };

  const handleUpdateShow = (category) => {
    setCategoryId(category.id);
    // console.log(category.id)
      setValue("name", category.name);
      setUpdateShow(true);
  }

const handleUpdateClose = () => setUpdateShow(false);

  const handleDeleteClose = () => setShowDelete(false);

  const handleDeleteShow = (id) =>{
    setCategoryId(id);
    setShowDelete(true);
    } 



  const getCategoriesList = async(name, pageSize, pageNumber)=> {
    setLoading(true);
    try{
      let response = await axios.get(`${baseUrl}/Category/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        headers: requestHeaders,
        params: {
          'name': name
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
    setCategoriesList(response.data.data);
    setTimeout(() => {
      setLoading(false);
    }, 1800);
    }
    catch(error) {
      console.log(error)
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    }
  }


  let {register,
    handleSubmit,
    setValue,
    formState:{errors}} = useForm();

    const onSubmit = async (data)=> {
      // console.log(data);
      if(modalState !== 'update') {
        setLoadingSpinner(true);
        try {
          let response = await axios.post(`${baseUrl}/Category/`, data,
          {headers: requestHeaders}
        );
          // console.log(response.data);
          handleClose();
          getCategoriesList();
          getToastValue('success', 'Category Added Successfully');
          setLoadingSpinner(false);
          localStorage.setItem('notification', 'you create one category')
          setShowCricle(true);
        }
        catch (error) {
          console.log(error);
          setLoadingSpinner(false);
        }
      }else {
        setLoadingSpinner(true);
        try {
          let response = await axios.put(`${baseUrl}/Category/${categoryId}`, data,
          {headers: requestHeaders}
        );
          // console.log(response);
          handleUpdateClose();
          getCategoriesList();
          getToastValue('success', 'Category Updated Successfully');
          setLoadingSpinner(false);
          localStorage.setItem('notification', 'you update one category')
          setShowCricle(true);
        }
        catch (error) {
          console.log(error);
          setLoadingSpinner(false);
        }
      }
    }

    const onDeleteSubmit = async ()=> {
      // console.log(categoryId)
      setLoadingSpinner(true);
      try {
        let response = await axios.delete(`${baseUrl}/Category/${categoryId}`,
        {headers: requestHeaders}
      );
        // console.log(response);
        handleDeleteClose();
        getCategoriesList();
        getToastValue('success', 'Category Deleted Successfully');
        setLoadingSpinner(false);
        localStorage.setItem('notification', 'you deleted one category')
        setShowCricle(true);
      }
      catch (error) {
        console.log(error);
        setLoadingSpinner(false);
      }
    }

    const getNameValue = (input)=> {
      setNameValue(input.target.value);
      getCategoriesList(input.target.value, 5, 1)
    }

  useEffect(()=> {
    if(loginData.userGroup === 'SystemUser' ) {
      navigate('/notfound')
    }else {
      getCategoriesList('', 5, 1);
    }
    
    
  },[])


  return (
    <>
    <Header title={'Categories'} description={'You can now add your items that any user can order it from the Application and you can edit'} imgUrl={categoriesAvatar} userName={'Itme'}/>
    
    <Modal show={modalState === 'update'? showUpdate: show} onHide={()=>{handleClose() ,handleUpdateClose()}}>
        <Modal.Header closeButton>
          <h3 className='modalTitle'>{modalState === 'update'? 'Update': 'Add'} Category</h3>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='input-group mb-3 border-1 px-3'>
              <input type="text"
              className="form-control inputForm"
              placeholder='Category Name'
              {...register('name', {
                required: 'Category name is required',
              })}/>
            </div>
            {errors.name && <div className='px-3'><p className='alert alert-danger'>{errors.name.message}</p></div>}
            {modalState !== 'update'?
                <div className=" d-flex justify-content-end borderLine">
                <button className='btn btn-auth fs-sm mb-3 mt-4'>Save
                {isLoadingSpinner?
                <span>
                    <i className='fa-solid text-light mx-2 fa-spinner fa-spin'></i>
                </span>
                : ''
                }
                </button>
                </div>
            :
            <div className=" d-flex justify-content-end borderLine">
            <button className='btn btn-auth fs-sm mb-3 mt-4'>Update
            {isLoadingSpinner?
                <span>
                    <i className='fa-solid text-light mx-1 fa-spinner fa-spin'></i>
                </span>
                : ''
              }
            </button>
            </div>}
            </form>
        </Modal.Body>
      </Modal>

    <Modal show={showDelete} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <h3 className='modalTitle'>Delete Category</h3>
        </Modal.Header>
        <Modal.Body>
              <DeleteData deleteItem ='Category' />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className='delete' onClick={onDeleteSubmit}>Delete this item
          {isLoadingSpinner?
                <span>
                    <i className='fa-solid text-danger mx-2 fa-spinner fa-spin'></i>
                </span>
                : ''
                }
          </Button>
        </Modal.Footer>
      </Modal>
    
    
    <div className="categories-container">
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-6">
          <h4 className='head-title'>Categories Table Details</h4>
          <p className='sub-description'>You can check all details</p>
        </div>
        <div className="col-md-6 d-flex justify-content-end btnAdd">
          <button onClick={()=> {setModalState(''), handleShow()}} className='btn btn-main me-2'>Add New Category</button>
        </div>
      </div>


      <div className="filteration mb-2">
        <div className="row ">
          <div className="col-md-12 ">
          <div className={`input-group border-1 mb-2 `}>
          <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#45474a'}} className="fa-solid fa-magnifying-glass"></i>
                </span>
            <input type="text"
            className="form-control inputForm"
            placeholder='Search by category name'
            onChange={getNameValue}
          />
        </div>
          </div>
        </div>
        </div>
      {!isLoading?
    <>
          {categoriesList.length >0 ?
          <>

            <table className="table table-striped table-borderless table-responsive">
            <thead className='table-light'>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Category Name</th>
                <th className='ms-3' scope="col">Creation Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
                {categoriesList.map((item, index) => (
                <tr key={item.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{new Date(item.creationDate).toLocaleString('en-US')}</td>
                        <td>
                        <div className="dropdown">
                            <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="fa-solid fa-ellipsis"></i>
                            </button>
                          <ul className="dropdown-menu">
                              <li onClick={()=>{setModalState('update'),handleUpdateShow(item)}} className='dropdown-item'> <i className="fa-solid fa-pen-to-square mb-2 text-warning me-2"></i> <span>Edit</span> </li>
                              <li onClick={()=> handleDeleteShow(item.id)} className='dropdown-item'><i className="fa-solid fa-trash text-danger me-2"></i> <span>Delete</span></li>
                          </ul>
                      </div>
                        </td>
                        {/* <td><i className="fa-solid fa-pen-to-square text-warning mx-2"></i> <i className="fa-solid fa-trash text-danger"></i></td> */}
                      </tr>
                      )
                )}
            </tbody>
              </table>


              <nav aria-label="Page navigation example" className='d-flex justify-content-end mt-4 padding '>
          <ul className="pagination" >
              <li className= {` page-item prev ${currentPage <=1 ? "disabled" : ""}`} 
            onClick={() => {
                  if (currentPage > 1) {
                    setActivePage(currentPage - 1);
                    getCategoriesList(nameValue, 5, currentPage - 1);
                      }
                    }}>
            <a className={`page-link ${currentPage <=1 ? "disabled" : ""}`} aria-label="Previous">
                <span aria-hidden="true">Previous</span>
          </a>
          </li>
          {/* {arrayOfPages.map((pageNo) =>  
          <li onClick={()=> getRecipesList(nameValue,tagValue,catValue,5, pageNo)} key={pageNo} className="page-item"><a className="page-link" >{pageNo}</a></li> )
          } */}
          {arrayOfPages.map((pageNo) => (
          <li
          onClick={() => {
          setActivePage(pageNo); // Set the active page
          getCategoriesList(nameValue, 5, pageNo);
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
          getCategoriesList(nameValue, 5, currentPage + 1);
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
                <th scope="col">Category Name</th>
                <th className='ms-3' scope="col">Creation Date</th>
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
