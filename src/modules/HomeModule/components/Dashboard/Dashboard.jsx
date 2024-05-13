import React from 'react'
import Header from '../../../SharedModule/components/Header/Header';
import homeAvatar from '../../../../assets/images/home-avatar.svg'
import RecipesListHeader from '../../../SharedModule/components/RecipesListHeader/RecipesListHeader';

export default function Dashboard({loginData}) {
  return (

    <>
      <Header title={'Welcome'} description={'This is a welcoming screen for the entry of the application , you can now see the options'} imgUrl={homeAvatar} userName={`${loginData?.userName} !`}/>
    <RecipesListHeader loginData={loginData}/>
    </>
  )
}
