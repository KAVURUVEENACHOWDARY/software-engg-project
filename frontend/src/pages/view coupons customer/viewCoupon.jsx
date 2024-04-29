import React, { useState, useEffect } from 'react'
import axios from "../../axios";
import { useParams } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import PopUp from '../../components/popup/popup';
import { Container, Row, Col, Card, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import imageScratch1 from '../../images/6233915.jpg'
import imageScratch2 from '../../images/9652987.jpg'
import ScratchCard from '../../components/ScratchCard';

export default function ViewCoupon() {
    const navigate = useNavigate();
    const { customerId, userType, userName } = useParams();

    const [scratchedCoupons, setScratchedCoupons] = useState([]);
    const [unScratchedCoupons, setUnScratchedCoupons] = useState([]);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popUpText, setpopUpText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
    const [textColor, setTextColor] = useState('#000');
    const [text, setText] = useState('');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/coupon/get-coupons/customer/${customerId}`);
            setScratchedCoupons(response.data.filter(coupon => coupon.scratched));
            setUnScratchedCoupons(response.data.filter(coupon => !coupon.scratched));
        } catch (error) {
            setIsPopUpOpen(true);
            setpopUpText("Error fetching coupons");
        } finally {
            setLoading(false);
        }
    };

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

    const handleComplete = async (id) => {
        try {
            const response = await axios.get(`/coupon/update-coupon/${id}`);
            if (response.status === 200) {
                setScratchedCoupons([...scratchedCoupons, unScratchedCoupons.find(coupon => coupon._id === id)]);
                setUnScratchedCoupons(unScratchedCoupons.filter(coupon => coupon._id !== id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className='dashboard-container'>
                <Navbar className="navbar">
                    <Container>
                        <Navbar.Brand className='nav-brand'>Savings Sphere</Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            {userType === "customer" && <Nav className="me-auto">
                                <Nav.Item className='nav-item' onClick={() => navigate(`/scan/${customerId}/${userName}/${userType}`)}>Verify Product</Nav.Item>
                                <Nav.Item className='nav-item' onClick={() => navigate(`/dashboard/${userType}/${customerId}/${userName}`)}>View Products</Nav.Item>
                            </Nav>}
                            <Navbar.Text className='nav-text'>
                                Signed in as: {userName}
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            <Container>
                <Row>
                    <Col md={12} className='mt-4'>
                        <h3 className='text-start'>Available Coupons</h3>
                    </Col>
                </Row>
                <hr />
                <Row>
                    {unScratchedCoupons.length > 0 && (
                        unScratchedCoupons.map((coupon, index) => (
                            <Col xs={12} sm={6} md={3} xl={3} key={coupon._id}>
                                <ScratchCard image={imageScratch2} finishPercent={0.5} brushSize={20} onComplete={() => handleComplete(coupon._id)}>
                                    <Card className="coupon-card my-3">
                                        {/* <Card.Img
                                            style={{ objectFit: 'contain', flex: 1, overflow: 'hidden'}}
                                            src={coupon.couponImageUrl}
                                            alt={coupon.couponName}
                                            className="coupon-image"
                                        /> */}
                                        <Card.Body style={{ flex: 1 }}>
                                            <Card.Title>{coupon.couponName}</Card.Title>
                                            <Card.Text>Coupon Code : {coupon._id}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </ScratchCard>
                            </Col>
                        ))
                    )}
                    {
                        unScratchedCoupons.length === 0 && (
                            <Row>
                                <p>Shop more to save more....</p>
                            </Row>
                        )
                    }
                </Row>
                <Row>
                    <Col md={12} className='mt-4'>
                        <h3 className='text-start'>Viewed Coupons</h3>
                    </Col>
                </Row>
                <hr />
                <Row>
                    {scratchedCoupons.length > 0 && (
                        scratchedCoupons.map((coupon, index) => (
                            <Col md={12} key={coupon._id}>
                                <Card style={{height: '300px'}} className="coupon-card my-3 d-flex flex-md-row" key={index}>
                                    <Card.Img style={{ objectFit: 'contain', flex: 1, overflow: 'hidden' }} src={coupon.couponImageUrl} alt={coupon.couponName} className="coupon-image" />
                                    <Card.Body style={{ flex: 1 }}>
                                        <Card.Title>{coupon.couponName}</Card.Title>
                                        <Card.Text>Coupon code : {coupon._id}</Card.Text>
                                        <p className='fw-bold'>Terms & conditions : </p>
                                        <Card.Text>{coupon.terms}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
                {
                    scratchedCoupons.length === 0 && (
                        <Row>
                            <p>No coupons to display.....</p>
                        </Row>
                    )
                }
            </Container>
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
        </>
    )
}
