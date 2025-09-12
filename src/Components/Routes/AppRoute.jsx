import React from 'react';
import { Route, Routes } from 'react-router';
import MainLayouts from '../Layouts/MainLayouts';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import ActivateAccount from '../Registration/ActivateAccount';

const AppRoute = () => {
    return (
        <div>
            <Routes>
                <Route element={<MainLayouts/>}>
                    <Route path='/' element = {<Home/>} />
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route path='activate/:uid/:token' element={<ActivateAccount/>}/>
                </Route>
                
            </Routes>
        </div>
    );
};

export default AppRoute;