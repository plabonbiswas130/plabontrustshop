import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Check } from 'lucide-react';

interface ProfileDashboardProps {
  t: any;
}

export function ProfileDashboard({ t }: ProfileDashboardProps) {
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&h=140&fit=crop&crop=face');
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        localStorage.setItem('profileImage', result);
        
        setIsUpdated(true);
        setTimeout(() => setIsUpdated(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const orders = [
    {
      id: '#RPBD-001',
      date: '2024-01-15 14:30',
      product: 'Netflix Premium',
      image: 'https://images.unsplash.com/photo-1611593733186-2d6852fd7e0b?w=45&h=45&fit=crop',
      price: '৳599',
      status: t.statusDelivered,
      statusClass: 'status-delivered-profile'
    },
    {
      id: '#RPBD-002',
      date: '2024-01-12 09:15',
      product: 'Spotify Family',
      image: 'https://images.unsplash.com/photo-1571169272042-6d6b6b48c34f?w=45&h=45&fit=crop',
      price: '৳374',
      status: t.statusDelivered,
      statusClass: 'status-delivered-profile'
    },
    {
      id: '#RPBD-003',
      date: '2024-01-10 16:45',
      product: 'YouTube Premium',
      image: 'https://images.unsplash.com/photo-1615466566597-2c4c2c607412?w=45&h=45&fit=crop',
      price: '৳239',
      status: t.statusPending,
      statusClass: 'status-pending-profile'
    },
    {
      id: '#RPBD-004',
      date: '2024-01-08 11:20',
      product: 'Canva Pro',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=45&h=45&fit=crop',
      price: '৳199',
      status: t.statusCancelled,
      statusClass: 'status-cancelled-profile'
    }
  ];

  const handleAction = (label: string, status: string) => {
    alert(`📋 ${label}:\nStatus: ${status}\nFull invoice & tracking info loading...`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-dashboard"
    >
      {/* User Profile Card */}
      <div className="user-card-profile">
        <div className="profile-pic-container-profile">
          <img src={profileImage || null} id="profileDisplay" alt="User Profile" />
          <input 
            type="file" 
            id="imageUploadProfile" 
            hidden 
            accept="image/*"
            onChange={handleImageUpload}
          />
          <label 
            htmlFor="imageUploadProfile" 
            className="upload-btn-profile"
            style={isUpdated ? { background: 'linear-gradient(45deg, #27ae60, #2ecc71)' } : {}}
          >
            {isUpdated ? <Check size={16} /> : <Camera size={16} />}
            {isUpdated ? 'Updated!' : t.changePhoto}
          </label>
        </div>
        
        <div className="user-details">
          <h2 id="userName">MD Plabon Biswas</h2>
          <p id="userEmail">plabon@example.com</p>
          <div className="user-stats-profile">
            <div className="stat-item-profile">
              <div className="stat-number-profile">12</div>
              <div className="stat-label-profile">{t.totalOrders}</div>
            </div>
            <div className="stat-item-profile">
              <div className="stat-number-profile">৳8,450</div>
              <div className="stat-label-profile">{t.totalSpent}</div>
            </div>
            <div className="stat-item-profile">
              <div className="stat-number-profile">4.9</div>
              <div className="stat-label-profile">{t.rating}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="order-section-profile">
        <h3>{t.myOrderHistory}</h3>
        
        <div className="order-table-container">
          <table className="profile-table">
            <thead>
              <tr>
                <th>{t.orderId}</th>
                <th>{t.dateTime}</th>
                <th>{t.product}</th>
                <th>{t.price}</th>
                <th>{t.status}</th>
                <th>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td className="order-id-profile">{order.id}</td>
                  <td className="order-date-profile">{order.date}</td>
                  <td className="order-product-profile">
                    <img src={order.image || null} alt={order.product} className="product-mini-img-profile" />
                    <div className="product-name-profile">{order.product}</div>
                  </td>
                  <td className="order-price-profile">{order.price}</td>
                  <td><span className={`order-status-badge ${order.statusClass}`}>{order.status}</span></td>
                  <td>
                    <button 
                      className="action-btn-profile"
                      onClick={() => handleAction(index === 2 ? t.track : index === 3 ? t.details : t.view, order.status)}
                    >
                      {index === 2 ? t.track : index === 3 ? t.details : t.view}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
