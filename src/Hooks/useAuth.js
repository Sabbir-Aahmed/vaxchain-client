import { useEffect, useState } from "react";
import apiClient from "../Services/apiClient";



const useAuth = () => {
    const [user,setUser] = useState(null)
    const [errorMsg, setErrorMsg] = useState("")
    const [authLoading, setAuthLoading] = useState(true);

    const getToken = () => {
        const token = localStorage.getItem("authTokens")
        return token ? JSON.parse(token) : null;
    }

    const [authTokens, setAuthTokens] = useState(getToken())

    useEffect(() => {
        if (authTokens) {
            fetchUserProfile().finally(() => setAuthLoading(false));
        } else {
            setAuthLoading(false);
        }
    }, [authTokens]);

    const handleAPIError = (error,defaultMessage= "Something went wrong! Try Again") => {
        if(error.response && error.response.data){
                const errrorMessage = Object.values(error.response.data).flat().join("\n")
                setErrorMsg(errrorMessage)
                return {success: false, message: errrorMessage}
            }
            setErrorMsg(defaultMessage)
            return {success: false, message: defaultMessage}
    }
    // fetch user profile 
    const fetchUserProfile = async() => {
        try{
            const response = await apiClient.get("/auth/users/me/", {
                headers: {Authorization: `JWT ${authTokens?.access}`},
            })
            setUser(response.data)
        }catch(error){
            console.log("Error fetching user", error)
        }
    }

         // login user 
    const loginUser = async (userData) => {
        setErrorMsg("")
        try {
            const response = await apiClient.post("/auth/jwt/create/", userData);

            setAuthTokens(response.data);
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            
            // after login fetch user 
            await fetchUserProfile()
            return {success: true}
        } catch (error) {
            setErrorMsg("Login failed:", error.response.data?.detail);
            return {success: false}
        }
    };

        //register
    const registerUser = async(userData) => {
        setErrorMsg("")
        try{
             await apiClient.post("/auth/users/", userData)
             return { success: true, message: "Registration successful!. Check your email to activate your account." };
        }catch(error){
            return handleAPIError(error, "Registration Failed! Try Again")
        }
    }

    // update user profile 
    const updateUserProfile = async(data) => {
        setErrorMsg("")
        try{
            await apiClient.put("/auth/users/me/", data,{
                headers: {Authorization: `JWT ${authTokens?.access}`},
            })
        }catch(error){
            return handleAPIError(error)
        }
    }

    // change password(authenticate)

    const changePassword = async(data)=>{
        setErrorMsg("")
        try{
            await apiClient.post("/auth/users/set_password/", data, {
                headers: {Authorization: `JWT ${authTokens?.access}`},
            })
        }catch(error){
            return handleAPIError(error)
        }
    }

    // forgot password 
    const forgotPassword = async (data) => {
        setErrorMsg("");
        try {
            await apiClient.post("/auth/users/reset_password/", data); 
            return { success: true, message: "Password reset link sent to your email" };
        } catch (error) {
            return handleAPIError(error, "Failed to Send Reset Link! Try Again.");
        }
    };

    // reset password 
    const resetPassword = async({uid,token,new_password}) =>{
        setErrorMsg("")
        try{
            await apiClient.post("/auth/users/reset_password_confirm/",{
                uid,
                token,
                new_password
            })
            return {success:true, message: "Password reset successful"}

        }catch(error){
            return handleAPIError(error, "Failed to Reset Password! Try Again")
        }
    }
       

    //resend activation mail
    const resentActivation = async(userData) => {
        setErrorMsg("")
        try{
             await apiClient.post("/auth/users/resend_activation/", userData)
             return { success: true, message: "Activation email has been sent." };
        }catch(error){
            return handleAPIError(error, "Failed to Resend Activation Email! Try Again")
        }
    }

    //logout user

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        window.location.href = "/login"
    }
    return {user,authLoading,errorMsg,loginUser, registerUser, logoutUser, updateUserProfile, changePassword, forgotPassword, resetPassword, resentActivation}
    
}

export default useAuth