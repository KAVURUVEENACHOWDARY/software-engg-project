import React, { useState } from 'react';
import './dashboard.css';

import { useParams } from 'react-router-dom';

import AddProduct from '../addProduct/addProduct';
import ViewProducts from '../viewProduct/viewProduct';

const Dashboard = () => {
    const { userName } = useParams();
    const [currentView, setCurrentView] = useState('addProduct');

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1>Welcome, {userName}!!!</h1>
                <button onClick={() => setCurrentView('addProduct')}>Add Product</button>
                <button onClick={() => setCurrentView('viewProducts')}>View Products</button>
                {/* Additional navigation items can be added here in the future */}
            </nav>
            <div className="content-area">
                {currentView === 'addProduct' ? (
                <div>
                    <AddProduct/>
                </div>
                ) : (
                <div>
                    <ViewProducts/>
                </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
