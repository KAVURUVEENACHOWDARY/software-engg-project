import React, { useEffect, useState } from 'react';
import './viewProduct.css';
import { Card, Col, Container, Row, Button, Form } from 'react-bootstrap';
import PopUp from '../../components/popup/popup';
import Loader from '../../components/loader/loader';
import axios from "../../axios"

const ViewProducts = ({ userId, userType, setCartNumber, setCart, cart}) => {

    const [products, setProducts] = useState([]);
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

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const quantity = parseInt(formData.get('quantity'), 10);
        const productId = parseInt(formData.get('productId'), 10);
        const productName = formData.get('productName');
        const productPrice = formData.get('productPrice');
        const productImage = formData.get('productImage');

        const existingProductIndex = cart.findIndex((p) => p.productId === productId);
        if (existingProductIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingProductIndex] = {
                ...updatedCart[existingProductIndex],
                quantity: quantity
            };
            setCart(updatedCart);
        } else {
            setCart([...cart, { productId, quantity, productName, productPrice, productImage }]);
        }
    }

    useEffect(()=>{
        setCartNumber(cart.length);
    },[cart])

    const fetchproducts = async () => {
        setLoading(true);
        try {
            let res;
            if (userType === "customer") {
                res = await axios.get(`/product/get-products`);
            } else {
                res = await axios.get(`/product/get-products/${userId}`);
            }
            setProducts(res.data);
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
        setCartNumber(0);
        setCart([]);
        fetchproducts();
    }, []);

    return (
        <div className="products-container">
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <Container>
                <Row>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <Col md={3}>
                                <Card className="product-card my-3" key={index}>
                                    <Card.Img src={product.imageUrl} alt={product.name} className="product-image" />
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text>{product.description}</Card.Text>
                                        <Card.Text>Category: {product.category}</Card.Text>
                                        <Row>
                                            <Col md={6}>
                                                <Card.Text>Stock: {product.stock}</Card.Text>
                                            </Col>
                                            <Col md={6}>
                                                <Card.Text>Price: ${product.price}</Card.Text>
                                            </Col>
                                        </Row>
                                        {userType === "customer" &&
                                            <Form onSubmit={handleAddToCart} className='my-3' style={{ alignItems: 'center' }}>
                                                <input type="hidden" name="productId" value={product.productId} />
                                                <input type="hidden" name="productImage" value={product.imageUrl} />
                                                <input type="hidden" name="productName" value={product.name} />
                                                <input type="hidden" name="productPrice" value={product.price} />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} md={6}>
                                                        <Form.Control
                                                            type="number"
                                                            min={0}
                                                            max={product.stock}
                                                            placeholder="0"
                                                            name="quantity"
                                                            required
                                                        />
                                                    </Form.Group>

                                                    <Form.Group as={Col} md={6}>
                                                        <Button type="submit" className='cart-button'>Add to cart</Button>
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No products added yet.</p>
                    )}
                </Row>
            </Container>
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </div>
    );
};

export default ViewProducts;
