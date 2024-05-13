import React, { useContext, useEffect, useState } from 'react';
import recipesAvatar from '../../../../assets/images/header.png';
import Header from '../../../SharedModule/components/Header/Header';
import axios from 'axios';
import noDataAvatar from '../../../../assets/images/no-data.png';
import NoData from '../../../SharedModule/components/NoData/NoData';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DeleteData from '../../../SharedModule/components/DeleteData/DeleteData';
import { useNavigate } from 'react-router-dom';
import {ThreeDots } from 'react-loader-spinner';
import Loading from '../../../SharedModule/components/Loading/Loading';
import { AuthContext } from '../../../../context/AuthContext';
import { ToastContext } from '../../../../context/ToastContext';





export default function RecipesList() {
 
  let {loginData, requestHeaders, baseUrl, setShowCricle} = useContext(AuthContext);
  let {getToastValue} = useContext(ToastContext);

  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [favList, setFavList] = useState([]);



  const [activePage, setActivePage] = useState(1); 

  const[nameValue, setNameValue] = useState('');
  const[tagValue, setTagValue] = useState('');
  const[catValue, setCatValue] = useState('');

  const[arrayOfPages, setArrayOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  
  const[categoriesList, setCategoriesList] = useState([]);
  const[tagsList, setTagsList] = useState([]);

  const navigate = useNavigate();

  const[recipesList, setRecipesList] = useState([]);
  const[recipeId, setRecipeId] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const[isLoading,setLoading] = useState(false);
  const[isLoadingSpinner,setLoadingSpinner] = useState(false);

  const handleDeleteClose = () => setShowDelete(false);



  const handleDeleteShow = (id) =>{
    setRecipeId(id);
    // console.log(id)
    setShowDelete(true);
    } 

    const handleViewRecipeClose = () => setShowRecipe(false);
    
  const handleViewRecipeShow = (id) =>{
    getRecipeDetails(id);
    setShowRecipe(true);
    } 

  const getRecipesList = async(name, tagId, catId, pageSize, pageNumber)=> {
    setLoading(true);
    try{
      let response = await axios.get(`${baseUrl}/Recipe/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        headers: requestHeaders,
      params:{
        'name': name,
        'tagId': tagId,
        'categoryId': catId
      }
      }
    );
    // console.log(response.data)
    // console.log(response.data.totalNumberOfPages)
    setArrayOfPages(Array(response.data.totalNumberOfPages)
    .fill()
    .map((_, i) => i+1)
  );
  setCurrentPage(response.data.pageNumber)
  setTotalPages(response.data.totalNumberOfPages)
    setRecipesList(response.data.data);
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


  const getCategoriesList = async()=> {
    try{
    let response = await axios.get(`${baseUrl}/Category/?pageSize=100000&pageNumber=1`,
    {headers: requestHeaders}
    );
    // console.log(response.data.data)
    setCategoriesList(response.data.data);
    }
    catch(error) {
    console.log(error)
    }
}


const getTagsList = async()=> {
  try{
  let response = await axios.get(`${baseUrl}/tag/`,
  {headers: requestHeaders}
  );
  // console.log(response.data)
  setTagsList(response.data);

  }
  catch(error) {
  console.log(error)
  }
}


  const getRecipeDetails = async (recipeId)=> {
    // console.log(categoryId)
    setLoadingSpinner(true);
    try {
      let response = await axios.get(`${baseUrl}/Recipe/${recipeId}`,
      {headers: requestHeaders}
    );
      // console.log(response.data);
      setRecipeDetails(response.data);
      setLoadingSpinner(false);
    }
    catch (error) {
      console.log(error);
      setLoadingSpinner(false);
    }
  }

  const onDeleteSubmit = async ()=> {
    // console.log(categoryId)
    setLoadingSpinner(true);
    try {
      let response = await axios.delete(`${baseUrl}/Recipe/${recipeId}`,
      {headers: requestHeaders}
    );
      // console.log(response);
      handleDeleteClose();
      getRecipesList();
      getToastValue('success', 'Recipe Deleted Successfully');
      setLoadingSpinner(false);
      localStorage.setItem('notification', 'you deleted one recipe')
      setShowCricle(true);
    }
    catch (error) {
      console.log(error);
      setLoadingSpinner(false);
    }
  }

  const updateRecipe = (item)=> {
    localStorage.setItem('recipe', JSON.stringify(item))
    localStorage.setItem('recipeState', 'update')
    navigate('/dashboard/recipeData');
  }


  const goToRecipeData = ()=> {
    localStorage.setItem('recipeState', 'add')
    navigate('/dashboard/recipeData');
  }


  const getNameValue = (input)=> {
    setNameValue(input.target.value);
    getRecipesList(input.target.value, tagValue, catValue, 5, 1)
  }
  const getTagValue = (input)=> {
    setTagValue(input.target.value);
    getRecipesList(nameValue, input.target.value, catValue, 5, 1)
  }
  const getCatValue = (input)=> {
    setCatValue(input.target.value);
    getRecipesList(nameValue, tagValue, input.target.value, 5, 1)
  }


  // userFavorites


  const getUserFav = async ()=> {

    try {
      let response = await axios.get(`${baseUrl}/userRecipe/?pageSize=100000&pageNumber=1`,
      {
        headers: requestHeaders,
        
      }
    );

      // console.log(response.data.data)
      setFavList(response.data.data)
      const favoriteRecipes = response.data.data;
      const recipeIds = favoriteRecipes.map((recipe) => recipe.recipe.id);
      // console.log(recipeIds)
      setSelectedRecipeIds(recipeIds);
    
    }
    catch (error) {
      console.log(error);
    }
  }


  const addToFavorites = async (recipeId)=> {
    // console.log(recipeId)
    setSelectedRecipeIds((prevIds) => [...prevIds, recipeId]);
    // setLoading(true);
    try {
      let response = await axios.post(`${baseUrl}/userRecipe/`,
      {
        'recipeId': recipeId
      }
      ,
      {
        headers: requestHeaders,
        
      }
    );

    // console.log(response.data)
      getUserFav();
      getToastValue('success', 'Recipe Added To Your Favorites Successfully');
      localStorage.setItem('notification', 'you add one recipe to your Favorites')
      setShowCricle(true);
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1800);
    }
    catch (error) {
      console.log(error);
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1800);
    }
  }



  const removeFromFavorites = async (recipeId)=> { 
      // console.log(recipeId)
    setSelectedRecipeIds((prevIds) => prevIds.filter((id) => id !== recipeId));
    // setLoading(true);
    try {
      let response = await axios.delete(`${baseUrl}/userRecipe/${recipeId}`,
      {
        headers: requestHeaders,
        
      }
    );

    // console.log(response)
    getUserFav()
    // console.log(response.data)
      getToastValue('success', 'Recipe Removed From Your Favorites Successfully');
      localStorage.setItem('notification', 'you remove one recipe from your Favorites')
      setShowCricle(true);
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1800);
    }
    catch (error) {
      console.log(error);
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1800);
    }
  }



  useEffect(()=> {
    if(loginData.userGroup === 'SystemUser' ) {
      getRecipesList('','','', 5, 1);
      getCategoriesList();
      getTagsList();
      getUserFav();
    }else {
      getRecipesList('','','', 5, 1);
      getCategoriesList();
      getTagsList();
    }
  },[])




  return (
    <>
    <Header title={'Recipes'} description={loginData?.userGroup === 'SuperAdmin' ?'You can now add your items that any user can order it from the Application and you can edit':'You can now add your items to your favorites'} imgUrl={recipesAvatar} userName={'Itmes!'}/>
    
    <Modal show={showDelete} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <h3 className='modalTitle'>Delete Recipe</h3>
        </Modal.Header>
        <Modal.Body>
              <DeleteData deleteItem ='Recipe' />
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

    <Modal show={showRecipe} onHide={handleViewRecipeClose}>
    {!isLoadingSpinner?
    <>
                <Modal.Header closeButton>
            <h3 className='modalTitle'>{recipeDetails?.name}</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="recipeInfo ">
            <div className='text-center'>
              {recipeDetails && recipeDetails.imagePath?
                          <img style={{width:'242px', height:'168px', borderRadius:'8px'}} src={`https://upskilling-egypt.com:3006/${recipeDetails.imagePath}`} className='img-fluid mb-3' alt="recipe picture" />
                          :
                          <img style={{width:'242px', height:'168px', borderRadius:'8px'}} src={noDataAvatar} className='img-fluid mb-3' alt="nodata avatar" />
                        }
            </div>
            <p style={{color:'#000000', overflowWrap:'break-word'}} className='ms-3' ><span style={{color:'#009247'}}><i className="fa-solid fa-file-lines me-1"></i>Description:</span> {recipeDetails?.description}</p>
            {recipeDetails && recipeDetails.category[0]?.name && (
                <p style={{ color: '#000000' }}><span style={{color:'#009247'}} className='ms-3'><i className="fa-regular fa-calendar-days me-1"></i>Category:</span> {recipeDetails.category[0]?.name}</p>
                  )}
            {recipeDetails && recipeDetails.tag.name && (
                <p style={{ color: '#000000' }}><span style={{color:'#009247'}} className='ms-3'><i className="fa-solid fa-tag me-1"></i>Tag:</span> {recipeDetails.tag.name}</p>
                  )}
            {recipeDetails && recipeDetails.price && (
                <p style={{ color: '#000000' }}><span style={{color:'#009247'}} className='ms-3'><i className="fa-solid fa-money-bills me-1"></i>Price:</span> {recipeDetails.price} EGP</p>
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
          <Button variant="danger" onClick={handleViewRecipeClose} className='delete'>Close</Button>
        </Modal.Footer>
      </Modal>

    <div className="recipes-container">
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-6">
          <h4 className='head-title'>Recipe Table Details</h4>
          <p className='sub-description'>You can check all details</p>
        </div>
        <div className="col-md-6 d-flex justify-content-end btnAdd">
        {loginData?.userGroup === 'SuperAdmin' ?
          <button onClick={goToRecipeData} className='btn btn-main me-2'>Add New Recipe</button>
        :
        ''
      }
        </div>
      </div>

      <div className="filteration mb-3">
        <div className="row ">
          <div className="col-md-6 d-flex justify-content-center">
          <div className={`input-group border-1 mb-2 `}>
          <span className="input-group-text" id="basic-addon1">
                <i style={{color: '#45474a'}} className="fa-solid fa-magnifying-glass"></i>
                </span>
            <input type="text"
            className="form-control inputForm"
            placeholder='Search by recipe name'
            onChange={getNameValue}
          />
        </div>
          </div>
          <div className="col-md-3 d-flex justify-content-center">
          <div className={`input-group  border-1 mb-2 `}>
        <select   className="form-select form-control inputForm " 
        onChange={getTagValue}
        >
            <option value='' >Tag</option>
            {tagsList.map((tag)=> <option key={tag.id} value={tag.id} >{tag.name}</option>)}
        </select>
    </div>
          </div>
          <div className="col-md-3 d-flex justify-content-center">
          <div className={`input-group  border-1 mb-2 `}>
        <select   className="form-select form-control inputForm " 
        onChange={getCatValue}
        >
            <option value='' >Category</option>
            {categoriesList.map((category)=> <option key={category.id} value={category.id} >{category.name}</option>)}
        </select>
    </div>
          </div>
        </div>
        </div>

      {!isLoading?
    <>
          {recipesList.length >0 ?
          <>
            <table className="table table-striped table-borderless table-responsive">
            <thead className='table-light'>
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col">Image</th>
                <th scope="col">Price</th>
                { window.innerWidth <= 576?''
                :
                <th scope="col">Description</th>
                }
                
                { window.innerWidth <= 576?''
                :
                <th scope="col">tag</th>
                }
                <th scope="col">Category</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
                {recipesList.map((item) => (
                <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.imagePath?
                        <img src={`https://upskilling-egypt.com:3006/${item.imagePath}`} alt="Recipe image" />
                        :
                        <img src={noDataAvatar} className='img-fluid' alt="nodata avatar" />
                      }
                      </td>
                      <td>{item.price}</td>
                { window.innerWidth <= 576? ''
                :
                <td>{item.description}</td>
                }
                { window.innerWidth <= 576? ''
                :
                <td>{item.tag.name}</td>
                }
                      
                      <td>{item.category[0]?.name}</td>
                        <td>
                        <div className="dropdown">
                            <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="fa-solid fa-ellipsis"></i>
                            </button>
                          <ul className="dropdown-menu">
                          {loginData?.userGroup === 'SuperAdmin' ?
                          <>
                          <li onClick={()=> handleViewRecipeShow(item.id)} className='dropdown-item'> <i style={{color:'#009247'}} className="fa-regular fa-eye mb-2 me-2"></i> <span>View</span> </li>
                          <li onClick={()=> updateRecipe(item)} className='dropdown-item'> <i className="fa-solid fa-pen-to-square mb-2 text-warning me-2"></i> <span>Edit</span> </li>
                          <li onClick={()=> handleDeleteShow(item.id)} className='dropdown-item'><i className="fa-solid fa-trash text-danger me-2"></i> <span>Delete</span></li>
                          </>
                      
                        :
                        <>
                        <li onClick={()=> handleViewRecipeShow(item.id)} className='dropdown-item'> <i style={{color:'#009247'}} className="fa-regular fa-eye mb-2 me-2"></i> <span>View</span> </li>
                        {selectedRecipeIds.includes(item.id) ?
                        <>
                  {favList.map((userFavRecipes) => {
                  if (userFavRecipes.recipe.id === item.id) {
                    return (
                      <li key={userFavRecipes.id} onClick={() => removeFromFavorites(userFavRecipes.id)} className='dropdown-item'>
                        <i style={{ color: '#009247' }} className="fa-solid fa-heart mb-2 me-2"></i>
                        <span>Remove from favorites</span>
                      </li>
                    );
                  }
                  return null;
                })}
                        </>
                      :
                      <li onClick={()=> addToFavorites(item.id)} className='dropdown-item'> <i style={{color:'#009247'}} className="fa-regular fa-heart mb-2 me-2"></i> <span>Add to favorites</span> </li>
                      }
                        </>
                        }
                        </ul>
                      </div>
                        </td>
                      </tr>
                      )
                )}
            </tbody>
              </table>

              <nav aria-label="Page navigation example" className='d-flex justify-content-end mt-4  padding'>
                <ul className="pagination" >
                    <li className= {` page-item prev ${currentPage <=1 ? "disabled" : ""}`} 
                  onClick={() => {
                        if (currentPage > 1) {
                          setActivePage(currentPage - 1);
                          getRecipesList(nameValue, tagValue, catValue, 5, currentPage - 1);
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
        getRecipesList(nameValue, tagValue, catValue, 5, pageNo);
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
                getRecipesList(nameValue, tagValue, catValue, 5, currentPage + 1);
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
              <th scope="col">Item Name</th>
                <th scope="col">Image</th>
                <th scope="col">Price</th>
                { window.innerWidth <= 576?''
                :
                <th scope="col">Description</th>
                }
                
                { window.innerWidth <= 576?''
                :
                <th scope="col">tag</th>
                }
                <th scope="col">Category</th>
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
