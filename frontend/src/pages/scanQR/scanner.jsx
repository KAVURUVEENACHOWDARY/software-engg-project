import React from 'react';
import { QrReader } from 'react-qr-reader'
import { useNavigate, useParams } from 'react-router-dom';

const QRScanner = () => {

    const { userId, userName, userType } = useParams();
    const navigate = useNavigate();

    const handleScan = (data) => {
        if (data) {
            console.log(data.text)
            navigate(`/verify${data.text.toString().split('3000')[1]}/${userId}/${userName}/${userType}`);
        }
    }

    const handleError = (err) => {
        console.error(err);
    }

    return (
        <QrReader
            delay={300}
            onError={handleError}
            onResult={handleScan}
            style={{ width: '100%', height: '100%' }}
        />
    );
}

export default QRScanner;
