import { createContext } from "react";
import { toast } from "react-toastify";


    export let ToastContext = createContext(0);
    export default function ToastContextProvider(props) {

        let getToastValue = (type, message) => {
            return toast[type] (message, {
                position: "top-right",
                autoClose: 2600,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        }

        return (
            <ToastContext.Provider value={{getToastValue}}>
                {props.children}
            </ToastContext.Provider>
        )
    }
