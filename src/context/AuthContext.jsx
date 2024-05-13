import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";



    export let AuthContext = createContext(null);
    export default function AuthContextProvider(props) {

        const[currentUser, setCurrentUser]= useState({});
        const[isLoading,setLoading] = useState(true);
        const[showCircle, setShowCricle] = useState(false);

        let requestHeaders = {Authorization: `Bearer ${localStorage.getItem('token')}`};
        let baseUrl = 'https://upskilling-egypt.com:3006/api/v1'

        let [loginData, setLoginData] = useState(null);

        let saveLoginData = ()=> {
            let encodedToken = localStorage.getItem('token');
            let decodedToken = jwtDecode(encodedToken);
          // console.log(decodedToken);
            setLoginData(decodedToken);
        }
        
        useEffect(()=> {
            if(localStorage.getItem('token')) {
            saveLoginData();
            }
        }, [])


            

        const getCurrentUser = async()=> {
            try{
            let response = await axios.get(`${baseUrl}/Users/currentUser`,
            {
                headers: requestHeaders,
            }
            );
            // console.log(response.data)
        setCurrentUser(response.data);
            }
            catch(error) {
            console.log(error)
            }
        }

        useEffect(()=> {
            if(loginData) {
            getCurrentUser();
            setTimeout(() => {
                setLoading(false);
            }, 2500);
            }
        },[loginData])


        return(
            <AuthContext.Provider value={{requestHeaders, baseUrl, loginData, saveLoginData, currentUser, isLoading, showCircle, setShowCricle}}>
                {props.children}
            </AuthContext.Provider>
        )
    }