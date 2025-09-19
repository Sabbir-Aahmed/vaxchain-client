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
import CampaignPage from '../Pages/CampaignPage';
import CampaignDetailsPage from '../Pages/CampaignDetailsPage';
import PrivateRoute from './PrivateRoute';
import Dashboard from "../Dashboard/DashboardOverview"
import DashboardLayout from '../Layouts/DashboardLayout';
import Bookings from '../Dashboard/Bookings';
import Reviews from '../Dashboard/Reviews';
import Payment from '../Payment/Payment';
import AddSchedule from '../Dashboard/Campaign/AddSchedule';
import UpdateCampaign from '../Dashboard/Campaign/UpdateCampaign';
import DashboardCampaign from '../Dashboard/Campaign/DashboardCampaign';
import CreateCampaigns from '../Dashboard/Campaign/CreateCampaigns';
import RoleRoute from './RoleRoute';
import ProfilePage from '../Profile/ProfilePage';

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
                    <Route path="campaigns" element={<CampaignPage/>} />
                    <Route path="campaigns/details/:id" element={<CampaignDetailsPage/>} />                        
                    <Route path="profile" element={<ProfilePage/>} />                        
                    
                </Route>
                
                <Route path="dashboard/*" element={
                    <PrivateRoute>
                        <DashboardLayout/>
                    </PrivateRoute>
                }>
                <Route path="user" element={<Bookings />} />
                <Route index element={
                    <RoleRoute allowedRoles={["DOCTOR", "is_staff"]}>
                        <Dashboard />
                    </RoleRoute>
                }/>
                <Route path="campaigns" element={
                    <RoleRoute allowedRoles={["DOCTOR", "is_staff"]}>
                        <DashboardCampaign />
                    </RoleRoute>
                } />
                <Route path="create/campaigns" element={
                    <RoleRoute allowedRoles={["DOCTOR", "is_staff"]}>
                        <CreateCampaigns />
                    </RoleRoute>
                } />
                <Route path="bookings" element={<Bookings />} />
                <Route path="reviews" element={
                    <RoleRoute allowedRoles={["DOCTOR", "is_staff"]}>
                        <Reviews />
                    </RoleRoute>
                } />
                <Route path="payment" element={<Payment />} />
                <Route path="campaigns/:campaignId/schedule" element={
                    <RoleRoute allowedRoles={["DOCTOR", "is_staff"]}>
                        <AddSchedule />
                    </RoleRoute>
                } />
                <Route path="campaigns/update/:campaignId" element={
                    <RoleRoute allowedRoles={["DOCTOR", "is_staff"]}>
                        <UpdateCampaign />
                    </RoleRoute>
                } />
                <Route path="analytics" element={
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
                    <p className="text-gray-600">Detailed analytics and reporting features coming soon...</p>
                </div>
                } />
                <Route path="reports" element={
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Export Reports</h2>
                    <p className="text-gray-600">Exporting reports features coming soon...</p>
                </div>
                } />
                <Route path="notifications" element={
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Notifications</h2>
                    <p className="text-gray-600">Sending notifications features coming soon...</p>
                </div>
                } />
                <Route path="Settings" element={
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                    <p className="text-gray-600">Configure system preferences feature coming soon...</p>
                </div>
                } />
                </Route>
            </Routes>
        </div>
    );
};

export default AppRoute;