import React, {useState} from 'react'

import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

import axios from "../../axios"

import { useParams } from "react-router-dom"
import { Form, Button, Col, Row, Container } from 'react-bootstrap';


export default function AddCoupons() {

    const { userId } = useParams();
    const [couponName, setCouponName] = useState();
    const [terms, setTerms] = useState();
    const [quantity, setQuantity] = useState();
    const [couponImage, setCouponImage] = useState(null);

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setpopUpText] = useState("")
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'couponName':
                setCouponName(value);
                break;
            case 'terms':
                setTerms(value);
                break;
            case 'quantity':
                setQuantity(value);
                break;
        }
    }

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setLoading(true);
        setIsBackgroundBlurred(true);
        const formData = new FormData();
        formData.append('couponName', couponName);
        formData.append('terms', terms);
        formData.append('quantity', quantity);
        formData.append('couponImage', couponImage);
        formData.append('supplierId', userId);
        try {
            const response = await axios.post(`/coupon/add-coupon`, formData);
            setpopUpText(response.data.message);
            setCouponName("");
            setTerms("");
            setQuantity("");
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.message) {
                setpopUpText(error?.response?.data?.message);
            }
            else {
                setpopUpText("Something Went Wrong")
            }
        }finally{
            setLoading(false);
            setIsBackgroundBlurred(false);
            setIsPopUpOpen(true);
        }
    }
    return (
        <>
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <Container>
                <Row>
                    <Col >
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="name">
                                    <Form.Label>Coupon Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the coupon name"
                                        name="couponName"
                                        value={couponName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group controlId="stock">
                                    <Form.Label>Quantity:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter the required number of coupons"
                                        name="quantity"
                                        value={quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label>Terms & Conditions:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter the terms and conditions of the coupon"
                                    name="terms"
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="imageUrl">
                                <Form.Label>Image URL:</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setCouponImage(e.target.files[0])}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" className="submit-btn">Add Coupons</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </>
    )
}
