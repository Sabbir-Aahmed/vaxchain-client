import React from 'react';
import { Route, Routes } from 'react-router';
import MainLayouts from '../Layouts/MainLayouts';
import Home from '../Pages/Home';

const AppRoute = () => {
    return (
        <div>
            <Routes>
                <Route element={<MainLayouts/>}>
                    <Route path='/' element = {<Home/>} />
                </Route>
                
            </Routes>
        </div>
    );
};

export default AppRoute;