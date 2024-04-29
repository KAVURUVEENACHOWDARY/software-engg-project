import React, { useState, useEffect } from 'react'
import axios from "../../axios";
import { useParams } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import PopUp from '../../components/popup/popup';
import { Container, Row, Col, Card, Navbar, Nav, Image } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function VerifyProduct() {
    const navigate = useNavigate();
    const { productId, randomNumber, customerId, userType, userName } = useParams();

    const [result, setResult] = useState({ message: "" });
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popUpText, setpopUpText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
    const [textColor, setTextColor] = useState('#000');
    const [text, setText] = useState('');

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

    const fetchResult = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/product/verify-product/${productId}/${randomNumber}`, { customerId });
            setResult(res.data);
            if (res.data.message === "Authentic") {
                setTextColor('#04572a')
                setText("This is a authentic product....You can proceed to buy...")
            }
            if (res.data.message === "owned") {
                setTextColor('#FEAC32')
                setText("Congratulations....You own this product")
            }
            if (res.data.message === "fake") {
                setTextColor('#FF4949')
                setText("This is a fake product....Please do not buy...")
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            if (error?.response?.data?.message) {
                setpopUpText(error?.response?.data?.message);
            }
            else {
                setpopUpText("Something Went Wrong")
            }
            setIsPopUpOpen(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchResult();
    }, []);

    return (
        <div>
            <div className='dashboard-container'>
                <Navbar className="navbar">
                    <Container>
                        <Navbar.Brand className='nav-brand'>Savings Sphere</Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            {userType === "customer" && <Nav className="me-auto">
                                <Nav.Item className='nav-item' onClick={() => navigate(`/scan/${customerId}`)}>Verify Product</Nav.Item>
                                <Nav.Item className='nav-item' onClick={() => navigate(`/dashboard/${userType}/${customerId}/${userName}`)}>View Products</Nav.Item>
                                <Nav.Item className='nav-item' onClick={() => navigate(`/view-coupons/${customerId}/${userName}/${userType}`)}>View Rewards</Nav.Item>
                            </Nav>}
                            <Navbar.Text className='nav-text'>
                                Signed in as: {userName}
                            </Navbar.Text>
                        </Navbar.Collapse>
                        {userType === "customer" &&
                            <div className='cart'>
                                <FontAwesomeIcon icon={faShoppingCart} size="2x" style={{ color: 'white' }} />
                            </div>
                        }
                    </Container>
                </Navbar>
            </div>
            <Container className='my-5' fluid>
                <Row>
                    <Col className='my-2 d-flex justify-content-center' md={6} >
                        <Image variant="top" src={result.imageUrl} alt="Product Image" className="img-fluid" thumbnail fluid style={{ width: '50%', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }} />
                    </Col>
                    <Col className='my-2 d-flex justify-content-center' md={6} >
                        <Card className="p-2 details-card" style={{ width: '80%', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
                            <Card.Body>
                                <h1 className='my-3' style={{ fontWeight: 700, textTransform: 'uppercase', color: textColor, fontFamily: 'Roboto', textAlign: 'center' }}>{result.message}</h1>
                                <Card.Title>{result.name}</Card.Title>
                                <Card.Text>{result.description}</Card.Text>
                                <Card.Text>Price: {result.price}</Card.Text>
                                <Card.Text>Category: {result.category}</Card.Text>
                                {
                                    result.message === "owned" && <Card.Text>Purchase Date: {result.purchaseDate}</Card.Text>
                                }
                                <div className="scrolling-text-container">
                                    <Card.Text style={{ color: textColor }} className="scrolling-text">{text}</Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
                {loading && <Loader />}
                <PopUp
                    isOpen={isPopUpOpen}
                    close={() => {
                        setIsPopUpOpen(false)
                    }
                    }
                    text={popUpText}
                />
            </Container>
        </div>

    )
}
