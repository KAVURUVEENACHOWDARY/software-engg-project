import React,{useEffect,useState} from 'react';
import './viewProduct.css'; 

import axios from "../../axios"

const ViewProducts = ({ products }) => {

    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        try{
            const res = await axios.get("/product/get-products");
            setBooks(res.data);
            console.log(res.data)
        }catch(error){
            console.log(error);
        }
    }
    fetchBooks();
    return (
        <div className="products-container">
        {books.length > 0 ? (
            books.map((product, index) => (
            <div className="product-card" key={index}>
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock}</p>
                </div>
            </div>
            ))
        ) : (
            <p>No products added yet.</p>
        )}
        </div>
    );
};

export default ViewProducts;
