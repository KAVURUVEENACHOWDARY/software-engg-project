import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from '../../axios';
import Loader from '../../components/loader/loader';
import PopUp from '../../components/popup/popup';
import { useNavigate } from "react-router"

const CartPage = ({ cartItems, customerId, userName, setShowCart }) => {

    const navigate = useNavigate();
    const [totalCost, setTotalCost] = useState(0);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            products: cartItems,
            name: formData.get('name'),
            address: formData.get('address'),
            cardNumber: formData.get('cardNumber'),
            totalCost
        }
        try {
            setLoading(true);
            const response = await axios.post(`/product/buy-product/${customerId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setLoading(false);
            setIsPopUpOpen(true);
            setpopUpText("Products Purchased Successfully");
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
        }
    }

    const calculateTotalCost = () => {
        let cost = 0;
        for (let i = 0; i < cartItems.length; i++) {
            cost += cartItems[i].productPrice * cartItems[i].quantity
        };
        setTotalCost(cost);
    }

    useEffect(() => {
        calculateTotalCost();
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col md={6} style={{ height: '80vh', overflowY: 'auto' }}>
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <Row>
                                        <Col md={3}>
                                            <img src={item.productImage} alt={item.name} style={{ maxWidth: '100%' }} />
                                        </Col>
                                        <Col md={6}>
                                            <h5>{item.productName}</h5>
                                            <p>Price: ${item.productPrice}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No items in the cart</p>
                    )}
                    <p>Total Cost: ${totalCost}</p>
                </Col>
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='my-3' controlId="formName">
                            <Form.Label>Name(as on card)</Form.Label>
                            <Form.Control name="name" type="text" placeholder="Enter your name" required />
                        </Form.Group>
                        <Form.Group className='my-3' controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control name="address" type="text" placeholder="Enter your address" required />
                        </Form.Group>
                        <Form.Group className='my-3' controlId="formCardNumber">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control name="cardNumber" type="text" placeholder="Enter your card number" required />
                        </Form.Group>
                        <Row className='my-3'>
                            <Col md={6}>
                                <Form.Label>Expiry date</Form.Label>
                                <Form.Control type="date" placeholder="Enter your card number" required />
                            </Col>
                            <Col md={6}>
                                <Form.Label>CVV</Form.Label>
                                <Form.Control type="password" placeholder="Enter your cvv" required />
                            </Col>
                        </Row>
                        <Row className='my-3'>
                            <Button type="submit"> Proceed to Buy </Button>
                        </Row>
                    </Form>
                </Col>
            </Row>
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <PopUp
                isOpen={isPopUpOpen}
                close={() => {
                    setIsPopUpOpen(false)
                    setShowCart(false);
                }
                }
                text={popUpText}
            />
        </Container>
    );
};

export default CartPage;
