import React from 'react';
import { Route, Routes } from 'react-router';
import MainLayouts from '../Layouts/MainLayouts';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import ActivateAccount from '../Registration/ActivateAccount';
import ForgotPassword from '../Registration/ForgotPassword';
import ResetPassword from '../Registration/ResetPassword';
import ResendActivation from '../Registration/ResendActivation';

const AppRoute = () => {
    return (
        <div>
            <Routes>
                <Route element={<MainLayouts/>}>
                    <Route path='/' element = {<Home/>} />
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route path='activate/:uid/:token' element={<ActivateAccount/>}/>
                    <Route path='forgot-password' element = {<ForgotPassword/>}/>
                    <Route path='password/reset/confirm/:uid/:token' element = {<ResetPassword/>}/>
                    <Route path="resend-activation" element={<ResendActivation/>} />
                </Route>
                
            </Routes>
        </div>
    );
};

export default AppRoute;