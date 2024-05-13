import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {useNavigate } from 'react-router-dom';
import { DropzoneArea } from "mui-file-dropzone";
import RecipesListHeader from '../../../SharedModule/components/RecipesListHeader/RecipesListHeader';
import Loading from '../../../SharedModule/components/Loading/Loading';
import { AuthContext } from '../../../../context/AuthContext';
import { ToastContext } from '../../../../context/ToastContext';



export default function RecipeData() {

    let {baseUrl, requestHeaders, loginData, setShowCricle} = useContext(AuthContext);
    let {getToastValue} = useContext(ToastContext);
    
    let recipeUpdateData = JSON.parse(localStorage.getItem('recipe'))
    // console.log(recipeUpdateData)
    let recipeState = localStorage.getItem('recipeState');

    
    const navigate = useNavigate();

    const[isLoading,setLoading] = useState(false);
    

    const[categoriesList, setCategoriesList] = useState([]);
    const[tagsList, setTagsList] = useState([]);
    const[isLoadingSpinner,setLoadingSpinner] = useState(false);

    const getCategoriesList = async()=> {
        try{
        let response = await axios.get(`${baseUrl}/Category/?pageSize=10000&pageNumber=1`,
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
    
    let {register,
        handleSubmit,
        setValue,
        control,
        formState:{errors}} = useForm();

        const appendToFormData = (data) => {
            const formData= new FormData();
            formData.append('name', data.name);
            formData.append('tagId', data.tagId);
            formData.append('price', data.price);
            formData.append('categoriesIds', data.categoriesIds);
            formData.append('description', data.description);
            formData.append('recipeImage', data.recipeImage[0]);
            return formData;
        }

    const onSubmit = async (data)=> {
        let recipeFormData = appendToFormData(data);
        if(recipeState === 'add') {
            setLoadingSpinner(true);
            try {
                let response = await axios.post(`${baseUrl}/Recipe`,
                recipeFormData,
                {headers: requestHeaders}
                );
                // console.log(response.data.message);
                getToastValue('success', response.data.message);
                navigate('/dashboard/recipes');
                setLoadingSpinner(false);
                localStorage.setItem('notification', 'you create one recipe')
                setShowCricle(true);
            }
            catch(error) {
                console.log(error);
                setLoadingSpinner(false);
            }

        }else {
            setLoadingSpinner(true);
            try {
                let response = await axios.put(`${baseUrl}/Recipe/${recipeUpdateData.id}`,
                recipeFormData,
                {headers: requestHeaders}
                );
                // console.log(response);
                getToastValue('success', 'Recipe Updated Successfully');
                navigate('/dashboard/recipes');
                setLoadingSpinner(false);
                localStorage.setItem('notification', 'you update one recipe')
                setShowCricle(true);
            }
            catch(error) {
                console.log(error);
                setLoadingSpinner(false);
            }
        }
    }

    const onCancel = ()=> {
        navigate('/dashboard/recipes');
    }

    useEffect(()=> {
        if(loginData.userGroup === 'SystemUser' ) {
            navigate('/notfound')
        }else {
            getCategoriesList();
            getTagsList();
            updateRecipeData();
        }
    },[])

    const updateRecipeData = ()=> {
        if(recipeState === 'update') {
            setLoading(true)
            setValue('name', recipeUpdateData.name);
            setValue('tagId', recipeUpdateData.tag.id);
            setValue('price', recipeUpdateData.price );
            setValue('categoriesIds', recipeUpdateData.category[0]?.id);
            setValue('description', recipeUpdateData.description);
            setValue('recipeImage', `https://upskilling-egypt.com:3006/${recipeUpdateData.imagePath}` );
        }
        setTimeout(() => {
            setLoading(false);
        }, 1800);
    }

    return (

        <>
        
        <RecipesListHeader/>

    {isLoading?
    <Loading/>

    :
        <div className='recipe-data p-2 text-center mb-2 mt-4'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`input-group ${errors.name?'mb-2' : 'mb-3'}  border-1 ${errors.name?'error' : ''}`}>
            <input type="text"
            className="form-control inputForm"
            placeholder='Recipe Name'
            
            {...register('name', {
                required: 'Recipe name is required',
            })}/>
        
        </div>
        {errors.name && <p className='alert alert-danger reset-alert text-start'>{errors.name.message}</p>}

        <div className={`input-group ${errors.tagId?'mb-2' : 'mb-3'}  border-1 ${errors.tagId?'error' : ''}`}>
        <select className="form-select form-control inputForm "
        {...register('tagId', {
            required: 'Tag name is required',
        })}
        >
            <option value='' hidden>Tags</option>
            {tagsList.map((tag)=> <option key={tag.id} value={tag.id} >{tag.name}</option>)}
        </select>
    </div>
    {errors.tagId && <p className='alert alert-danger reset-alert text-start'>{errors.tagId.message}</p>}

        <div className={`input-group ${errors.price?'mb-2' : 'mb-3'}  border-1 ${errors.price?'error' : ''}`}>
        <input type='number'
        className="form-control inputForm"
        placeholder='Recipe Price'
        {...register('price', {
            required: 'Recipe price is required',
        pattern: {
            value: /^(?:\d{1,4}(?:[.,]\d{3})*(?:[.,]\d{2})?|10000(?:[.,]00)?)$/, 
            message: 'Invalid price'
        }
        })}/>
        <span className="input-group-text">
        EGP
        </span>
    </div>
    {errors.price && <p className='alert alert-danger reset-alert text-start'>{errors.price.message}</p>}

        <div className={`input-group ${errors.categoriesIds?'mb-2' : 'mb-3'}  border-1 ${errors.categoriesIds?'error' : ''}`}>
        <select  className="form-select form-control inputForm " 
        {...register('categoriesIds', {
            required: 'Category name is required',
        })}
        >
            <option value=''  hidden>Categories</option>
            {categoriesList.map((category)=> <option key={category.id} value={category.id} >{category.name}</option>)}

        </select>
    </div>
    {errors.categoriesIds && <p className='alert alert-danger reset-alert text-start'>{errors.categoriesIds.message}</p>}

        <div className={`input-group ${errors.description?'mb-2' : 'mb-3'} border-1 ${errors.description?'error' : ''}`}>
        <textarea
        className="form-control inputForm position-relative"
        placeholder='Description'
        {...register('description', {
            required: 'Recipe description is required',
        })}/>
        
    </div>
    {errors.description && <p className='alert alert-danger reset-alert text-start'>{errors.description.message}</p>}

        <div className={`${errors.recipeImage?'mb-2' : 'mb-3'}`}>

    <Controller
        name="recipeImage"
        control={control}
        rules={{ required: 'Recipe picture is required' }}
        render={({ field }) => (

            <>
            {recipeState === 'update'? 
                <DropzoneArea
                acceptedFiles={['image/*']}
                dropzoneText="Drag & Drop or Choose an Item Image to Upload"
                initialFiles={
                    recipeState === 'update' && recipeUpdateData.imagePath?
                    [`https://upskilling-egypt.com:3006/${recipeUpdateData.imagePath}`]
                    : []
                }
                filesLimit={1}
                // showPreviews={true}
                onChange={(files) => {
                    // console.log('Files:', files);
                field.onChange(files); 
                }}
            />
        :
        <DropzoneArea
        acceptedFiles={['image/*']}
        dropzoneText="Drag & Drop or Choose an Item Image to Upload"
        filesLimit={1}
        onChange={(files) => {
            // console.log('Files:', files);
        field.onChange(files); 
        }}
    />
        }
            
            </>
        
        )}
    />
    
        {errors.recipeImage && <p className='alert alert-danger reset-alert text-start mt-2'>{errors.recipeImage.message}</p>}
        </div>
        <div className='d-flex justify-content-end add-border mb-6'>
        <button onClick={onCancel} className='btn btn-auth btn-cancle fs-sm mx-5 mt-4'>Cancel</button>
        <button className='btn btn-auth btn-save fs-sm mt-4'>{recipeState === 'add'? 'Save' : 'Update'}
        {isLoadingSpinner?
        <span>
            <i className='fa-solid text-light mx-2 fa-spinner fa-spin'></i>
        </span>
        : ''
    }
        </button>
        </div>
    </form>
        </div>
        }
    
        </>
    )
}
