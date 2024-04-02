import React, { useState } from 'react';
import './addProduct.css';
import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

import axios from "../../axios"

import {useNavigate,useParams} from "react-router-dom"

const AddProductForm = () => {


    const {id} = useParams();
    const [name, setname] = useState();
    const [price, setprice] = useState();
    const [category, setcategory] = useState();
    const [description, setdescription] = useState();
    const [stock, setstock] = useState();
    const [prodImage, setprodImage] = useState(null);


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


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('stock', stock);
        formData.append('prodImage', prodImage);
        formData.append('supplier', id);
        try{
            setLoading(true);
            const response = await axios.post(`/product/add-product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response);
            setLoading(false);
            setIsPopUpOpen(true);
            setpopUpText("Product Added Successfully");
        }catch(error){
            console.log(error);
            setLoading(false);
            if(error?.response?.data?.message){
                setpopUpText(error?.response?.data?.message);
            }
            else{
                setpopUpText("Something Went Wrong")
            }
            setIsPopUpOpen(true);
        }
    };

    return (
        <form className="add-product-form" onSubmit={handleSubmit}>
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
        <div className="form-group">
            <label>Name:</label>
            <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
            />
        </div>
        <div className="form-group">
            <label>Price:</label>
            <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setprice(e.target.value)}
            required
            />
        </div>
        <div className="form-group">
            <label>Category:</label>
            <input
            type="text"
            name="category"
            value={category}
            onChange={(e) => setcategory(e.target.value)}
            required
            />
        </div>
        <div className="form-group">
            <label>Description:</label>
            <textarea
            name="description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            required
            ></textarea>
        </div>
        <div className="form-group">
            <label>Stock:</label>
            <input
            type="number"
            name="stock"
            value={stock}
            onChange={(e) => setstock(e.target.value)}
            required
            />
        </div>
        <div className="form-group">
            <label>Image URL:</label>
            <input
            type="file"
            name="imageUrl"
            onChange={(e) => setprodImage(e.target.files[0])}
            />
        </div>
        <button type="submit" className="submit-btn">Add Product</button>
        <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            />
        </form>
    );
};

export default AddProductForm;
