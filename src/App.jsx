import { useContext } from 'react'
import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { AuthContext } from './context/AuthContext'
import ForgetPass from './modules/AuthenticationModule/components/ForgetPass/ForgetPass'
import LogIn from './modules/AuthenticationModule/components/LogIn/LogIn'
import Register from './modules/AuthenticationModule/components/Register/Register'
import ResetPass from './modules/AuthenticationModule/components/ResetPass/ResetPass'
import VerifyAccount from './modules/AuthenticationModule/components/VerifyAccount/VerifyAccount'
import CategoriesList from './modules/CategoriesModule/components/CategoriesList/CategoriesList'
import FavsList from './modules/FavsModule/components/FavsList/FavsList'
import Dashboard from './modules/HomeModule/components/Dashboard/Dashboard'
import RecipeData from './modules/RecipesModule/components/RecipeData/RecipeData'
import RecipesList from './modules/RecipesModule/components/RecipesList/RecipesList'
import AuthLayout from './modules/SharedModule/components/AuthLayout/AuthLayout'
import MasterLayout from './modules/SharedModule/components/MasterLayout/MasterLayout'
import Notfound from './modules/SharedModule/components/Notfound/Notfound'
import ProtectedRoute from './modules/SharedModule/components/ProtectedRoute/ProtectedRoute'
import UsersList from './modules/UsersModule/components/UsersList/UsersList'


function App() {

  let {loginData, saveLoginData} = useContext(AuthContext)


  let routes = createHashRouter([
    {
      path: 'dashboard',
      element:<ProtectedRoute loginData={loginData}><MasterLayout loginData={loginData}/></ProtectedRoute> ,
      errorElement: <Notfound/>,
      children: [
        {index: true, element: <Dashboard loginData={loginData}/>},
        {path: 'dashboard', element: <Dashboard loginData={loginData}/>},
        {path: 'recipes' , element: <RecipesList/> },
        {path: 'recipeData' , element: <RecipeData /> },
        {path: 'categories' , element: <CategoriesList/> },
        {path: 'users' , element: <UsersList/> },
        {path: 'favs' , element: <FavsList/> },
      ]
    },
    {
      path: '/',
      element: <AuthLayout/>,
      errorElement: <Notfound/>,
      children: [
        {index: true, element: <LogIn saveLoginData={saveLoginData}/>},
        {path: 'login', element: <LogIn saveLoginData={saveLoginData}/>},
        {path: 'register' , element: <Register/> },
        {path: 'verifyAccount' , element: <VerifyAccount/> },
        {path: 'forgotpass' , element: <ForgetPass/> },
        {path: 'resetpass' , element: <ResetPass/> },
      ]
    },
    {
      path: '/notfound',
      element: <Notfound/>,
      errorElement: <Notfound/>
    }
  ])

  return (
    <>
    <ToastContainer theme='colored'/>
    <RouterProvider router={routes}></RouterProvider>
    </>
  )
}

export default App
