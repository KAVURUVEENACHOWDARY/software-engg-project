import React, { useState } from 'react';
import './addProduct.css';
import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

import axios from "../../axios"

import { useParams } from "react-router-dom"
import { Form, Button, Col, Row, Container } from 'react-bootstrap';

const AddProductForm = () => {
    const { userId } = useParams();
    const [name, setName] = useState();
    const [price, setPrice] = useState();
    const [category, setCategory] = useState();
    const [description, setDescription] = useState();
    const [stock, setStock] = useState();
    const [prodImage, setprodImage] = useState(null);
    const [expiry, setExpiry] = useState(null);
    const [warranty, setWarranty] = useState(null);

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
            case 'expiry':
                setExpiry(value);
                break;
            case 'warranty':
                setWarranty(value);
                break;
            case 'name':
                setName(value);
                break;
            case 'price':
                setPrice(value);
                break;
            case 'category':
                setCategory(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'stock':
                setStock(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('expiry', expiry);
        formData.append('warranty', warranty);
        formData.append('description', description);
        formData.append('stock', stock);
        formData.append('prodImage', prodImage);
        formData.append('supplier', userId);

        setLoading(true);
        axios.post('/product/add-product', formData, { responseType: 'arraybuffer' })
            .then(response => {
                setLoading(false);
                setIsPopUpOpen(true);
                setpopUpText("Product Added Successfully");
                setName('');
                setPrice('');
                setCategory('');
                setDescription('');
                setStock('');
                setprodImage('');
                setWarranty(null);
                setExpiry(null);
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'product_qrs.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                if (error?.response?.data?.message) {
                    setpopUpText(error?.response?.data?.message);
                }
                else {
                    setpopUpText("Something Went Wrong")
                }
                setIsPopUpOpen(true);
            });
    };

    return (
        <>
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <Container>
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="name">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        name="name"
                                        value={name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="category">
                                    <Form.Label>Category:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter category"
                                        name="category"
                                        value={category}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group controlId="price">
                                    <Form.Label>Price:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter price"
                                        name="price"
                                        value={price}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="stock">
                                    <Form.Label>Stock:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter stock"
                                        name="stock"
                                        value={stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group controlId="expiry">
                                    <Form.Label>Expiry Period(in days):</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter expiry(in days)"
                                        name="expiry"
                                        value={expiry}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="stock">
                                    <Form.Label>Warranty Period(in days):</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter warranty(in days)"
                                        name="warranty"
                                        value={warranty}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label>Description:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter description"
                                    name="description"
                                    value={description}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="imageUrl">
                                <Form.Label>Image URL:</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setprodImage(e.target.files[0])}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" className="submit-btn">Add Product</Button>
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
    );
};

export default AddProductForm;
