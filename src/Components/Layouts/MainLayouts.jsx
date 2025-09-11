import React from 'react';
import Navbar from './NavBar';
import { Outlet } from 'react-router';
import Footer from './Footer';

const MainLayouts = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default MainLayouts;