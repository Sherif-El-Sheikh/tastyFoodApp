import React, { useContext, useEffect, useState } from 'react'
import Header from '../../../SharedModule/components/Header/Header';
import favoritesAvatar from '../../../../assets/images/header.png';
import axios from 'axios';
import NoData from '../../../SharedModule/components/NoData/NoData';
import noDataAvatar from '../../../../assets/images/no-data.png';
import Loading from '../../../SharedModule/components/Loading/Loading';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../../../context/ToastContext';


export default function FavsList() {

  let {baseUrl, requestHeaders, loginData} = useContext(AuthContext);
  let {getToastValue} = useContext(ToastContext);

  const [favList, setFavList] = useState([]);
  const[isLoading,setLoading] = useState(false);

  const navigate = useNavigate();

  const getUserFav = async ()=> {
    setLoading(true);
    try {
      let response = await axios.get(`${baseUrl}/userRecipe/?pageSize=100000&pageNumber=1`,
      {
        headers: requestHeaders,
        
      }
    );

      // console.log(response.data.data)
      setFavList(response.data.data)
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    
    }
    catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    }
  }


  
  const removeFromFavorites = async (favRecipeId)=> { 
    // console.log(recipeId)
  setLoading(true);
  try {
    let response = await axios.delete(`${baseUrl}/userRecipe/${favRecipeId}`,
    {
      headers: requestHeaders,
      
    }
  );

  // console.log(response)
  getUserFav()
  // console.log(response.data)
    getToastValue('success', 'Recipe Removed From Your Favorites Successfully');
    localStorage.setItem('notification', 'you remove one recipe from your Favorites')
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }
  catch (error) {
    console.log(error);
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }
}


  useEffect(()=> {
    if(loginData.userGroup === 'SuperAdmin' ) {
      navigate('/notfound')
    }else {
      getUserFav();
    }
    
  },[])

  return (
    <>
    <Header title={'Favorite'} description={'You can now show your favorites items '} imgUrl={favoritesAvatar} userName={'Itmes'}/>

      <div className="container-fluid p-4 fav-container">
        <div className="row">
        {!isLoading?
        <>
                  {favList.length >0 ?
          favList.map((item) => ( 
          <div key={item.id} className="col-md-4">
              <div className="card mb-4 position-relative" >
              {item.recipe.imagePath?
                        <img style={{ height: '220px' }} src={`https://upskilling-egypt.com:3006/${item.recipe.imagePath}`} className='img-fluid' alt="Recipe image" />
                        :
                        <img style={{ height: '220px' }} src={noDataAvatar} className='img-fluid' alt="nodata avatar" />
                      }
                  <div className="card-body" >
                  <h5 className="card-title">{item.recipe.name}</h5>
                  <p style={{ height: '105px' }} className="card-text align-content-center mt-2">{item.recipe.description}</p>
                  <span style={{ color: '#009247' }}>{item.recipe.price} EGP</span>
                  <div className=" position-absolute fav-button">
                    <button onClick={()=> {removeFromFavorites(item.id)}} className="btnAction"><i style={{ color: '#009247' }} className="fa-solid fa-heart fs-5"></i></button>
                    </div>
                  </div>
              </div>
        </div>
            
      ))
        :
        <NoData/>
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
