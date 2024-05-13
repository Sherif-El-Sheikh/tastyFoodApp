import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';

export default function RecipesListHeader() {

    let {loginData} = useContext(AuthContext);

    const navigate = useNavigate();

    const goToRecipeData = ()=> {
        navigate('/dashboard/recipes');
    }
    
    return (
    <div className='recipeHeader-container  mx-3'>
        <div className="row">
            <div className="col-md-6">
                {loginData?.userGroup === 'SuperAdmin' ?
                <>
                <h5>Fill the <span>Recipes</span> !</h5>
                <p>
                you can now fill the meals easily using the table and form , click here and sill it with the table !
                </p>
                </>
            :
            <>
            <h5>Show the <span>Recipes</span> !</h5>
                <p>
                you can now show the meals easily using the table and form , click here and show it with the table !
                </p>
            </>
            
            }
                
            </div>
            <div className="col-md-6 d-flex justify-content-end align-items-center">
                <button onClick={goToRecipeData} className='btn btn-fill'>
                All Recipes <i className="fa-solid fa-arrow-right mx-3"></i>
                </button>
            </div>
        </div>

    </div>
    )
}
