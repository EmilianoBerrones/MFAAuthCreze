import React from 'react';

const EnableMFA = () => {
    return (
        <iframe
            src="http://localhost:8000/account/two_factor/setup/"
            title="QR Code for 2FA"
            style={{
                width: '100%',
                height: '90vh',
                border: 'none',
            }}
        />
    );
};

export default EnableMFA;

// EnableMFA
