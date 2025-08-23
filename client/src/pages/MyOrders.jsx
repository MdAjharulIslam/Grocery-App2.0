import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const { currency, axios, user } = useAppContext();
    const [loading, setLoading] = useState(true);

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user');
            if (data.success) {
                setMyOrders(data.orders);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyOrders();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <p className="text-primary text-xl font-semibold">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="mt-16 pb-16">
            <div className="flex flex-col items-end w-max mb-8">
                <p className="text-2xl font-medium uppercase">My Orders</p>
                <div className="w-16 h-0.5 bg-primary rounded-full"></div>
            </div>

            {myOrders.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No orders found!</p>
            ) : (
                myOrders.map((order, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
                        <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
                            <span>OrderId: {order._id}</span>
                            <span>Payment: {order.paymentType}</span>
                            <span>Total Amount: {currency} {order.amount}</span>
                        </p>

                        {/* Map through the order items */}
                        {order.items.map((item, itemIndex) => (
                            <div
                                key={itemIndex}
                                className={`relative bg-white text-gray-500/70 ${
                                    order.items.length !== itemIndex + 1 && 'border-b'
                                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                            >
                                <div className="flex items-center mb-4 md:mb-0">
                                    <div className="bg-primary/10 p-4 rounded-lg">
                                        {/* Safely check for item.product */}
                                        {item.product && item.product.image && (
                                            <img
                                                src={item.product.image[0]}
                                                alt=""
                                                className="w-16 h-16 object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        {/* Safely check for item.product */}
                                        <h2 className="text-xl font-medium text-gray-800">
                                            {item.product ? item.product.name : 'Product not found'}
                                        </h2>
                                        <p>Category: {item.product ? item.product.category : 'Unknown'}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                                    <p>Quantity: {item.quantity || '1'}</p>
                                    <p>Status: {order.status}</p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>

                                <p className="text-primary text-lg font-medium">
                                    Amount: {currency}{' '}
                                    {item.product ? item.product.offerPrice * item.quantity : 0}
                                </p>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrders;
