// src/components/Accessories.js
import React from 'react';

const Accessories = () => (
    <div>
        <h2>Accessories</h2>
        <div className="accessories-list">
            <div className="accessory-item">
                <h3>Laptop Bag</h3>
                <p>Price: $50</p>
                <button>Add to Cart</button>
            </div>
            <div className="accessory-item">
                <h3>Mouse</h3>
                <p>Price: $35</p>
                <button>Add to Cart</button>
            </div>
            {/* Continue to add more accessories */}
        </div>
    </div>
);

export default Accessories;
