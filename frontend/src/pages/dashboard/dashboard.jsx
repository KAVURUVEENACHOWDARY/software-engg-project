import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { useParams, useNavigate } from 'react-router-dom';
import AddProduct from '../addProduct/addProduct';
import AddCoupons from '../addCoupons/addCoupons';
import ViewProducts from '../viewProduct/viewProduct';
import ViewCoupons from '../View Coupons Supplier/viewCoupons';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Loader from '../../components/loader/loader';
import PopUp from '../../components/popup/popup';
import CartPage from '../cart/cart';

const Dashboard = () => {
    const { userName, userId, userType } = useParams();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('addProduct');
    const [cartNumber, setCartNumber] = useState(0);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popUpText, setpopUpText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
    const blurredBackgroundStyles = isBackgroundBlurred
        ? {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(100, 100, 100, 0.5)",
            backdropFilter: "blur(1.8px)",
            zIndex: 1,
        }
        : {};

    useEffect(() => {
        setCart([]);
        setCartNumber(0);
        setShowCart(false);
    }, [])

    const handleCartClick = () => {
        if (!cartNumber) {
            setpopUpText("Please add items to the cart...");
            setIsPopUpOpen(true);
        } else {
            setShowCart(true);
        }
    }

    return (
        <div className="dashboard-container">
            <Navbar className="navbar">
                <Container>
                    <Navbar.Brand className='nav-brand'>Savings Sphere</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        {userType === "supplier" && <Nav className="me-auto">
                            <Nav.Item className='nav-item' onClick={() => setCurrentView('addProduct')}>Add Product</Nav.Item>
                            <Nav.Item className='nav-item' onClick={() => setCurrentView('viewProducts')}>View Products</Nav.Item>
                            <Nav.Item className='nav-item' onClick={() => setCurrentView('addCoupons')}>Add Coupons</Nav.Item>
                            <Nav.Item className='nav-item' onClick={() => setCurrentView('viewCoupons')}>View Coupons</Nav.Item>
                        </Nav>}
                        {userType === "customer" && <Nav className="me-auto">
                            <Nav.Item className='nav-item' onClick={() => navigate(`/scan/${userId}/${userName}/${userType}`)}>Verify Product</Nav.Item>
                            <Nav.Item className='nav-item' onClick={() => navigate(`/view-coupons/${userId}/${userName}/${userType}`)}>View Rewards</Nav.Item>
                        </Nav>}
                        <Navbar.Text className='nav-text'>
                            Signed in as: {userName}
                        </Navbar.Text>
                    </Navbar.Collapse>
                    {userType === "customer" &&
                        <div className='cart' onClick={() => handleCartClick()}>
                            <FontAwesomeIcon icon={faShoppingCart} size="2x" style={{ color: 'white' }} />
                            {cartNumber > 0 && (
                                <Badge pill bg="danger" style={{ position: 'absolute', top: '-8px', right: '-8px' }}>
                                    {cartNumber}
                                </Badge>
                            )}
                        </div>
                    }
                </Container>
            </Navbar>
            {
                userType === "supplier" && <>
                    <div className="content-area">
                        { currentView === 'addProduct' && <AddProduct /> }
                        { currentView === 'viewProducts' &&  
                            <ViewProducts 
                                userType={userType} 
                                userId={userId} 
                                setCartNumber={setCartNumber} 
                                cart={cart} 
                                setCart={setCart} />}
                        { currentView === 'addCoupons' && <AddCoupons /> }
                        { currentView === 'viewCoupons' && <ViewCoupons /> }
                    </div>
                </>
            }

            {
                userType === "customer" && currentView !== 'verifyProduct' && !showCart && <>
                    <div className="content-area">
                        <div>
                            <ViewProducts userType={userType} userId={userId} setCartNumber={setCartNumber} cart={cart} setCart={setCart} />
                        </div>
                    </div>
                </>
            }

            {
                userType === "customer" && showCart && <>
                    <div className="content-area">
                        <div>
                            <CartPage cartItems={cart} customerId={userId} userName={userName} setShowCart={setShowCart} />
                        </div>
                    </div>
                </>
            }

            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </div>
    );
};

export default Dashboard;
