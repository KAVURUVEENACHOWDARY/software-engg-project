import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Button, Form } from 'react-bootstrap';
import PopUp from '../../components/popup/popup';
import Loader from '../../components/loader/loader';
import axios from "../../axios"
import { useParams } from "react-router-dom"

export default function ViewCoupons() {

    const { userId } = useParams();

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popUpText, setpopUpText] = useState("");
    const [coupons, setCoupons] = useState([]);
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
        fetchCoupons();
    }, [])

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/coupon/get-coupons/supplier/${userId}`);
            setCoupons(res.data);
        } catch (error) {
            setCoupons([]);
            console.error(error);
            setpopUpText("Failed to fetch coupons. Please try again later...");
            setIsPopUpOpen(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <Container>
                <Row>
                    {coupons.length > 0 ? (
                        coupons.map((coupon, index) => (
                            <Col md={12}>
                                <Card className="coupon-card my-3 d-flex flex-md-row" key={index}>
                                    <Card.Img style={{ objectFit: 'contain', flex:1, overflow:'hidden' }} src={coupon.couponImageUrl} alt={coupon.couponName} className="coupon-image" />
                                    <Card.Body style={{ flex: 1 }}>
                                        <Card.Title>{coupon.couponName}</Card.Title>
                                        <Card.Text>{coupon.couponTerms}</Card.Text>
                                        <Row>
                                            <Col md={6}>
                                                <Card.Text>Claimed: {coupon.claimed}</Card.Text>
                                            </Col>
                                            <Col md={6}>
                                                <Card.Text>Unclaimed: {coupon.notClaimed}</Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No Coupons added yet.</p>
                    )}
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
