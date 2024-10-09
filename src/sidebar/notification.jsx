import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseApiURL, url } from '../contexts/ApiURL';
import { Link, useNavigate } from 'react-router-dom';
import bell from '../assets/images/bell-icon.svg';
// import io from 'socket.io-client';
import './notification.css';
import { selectCurrentToken } from '../redux/auth/authSlice';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../contexts/SocketContext';
import snapNotificationSound from "../assets//sounds/snapsound.m4a";

export default function Notification() {
    // const socket = io(`${url}`);
    const token = useSelector(selectCurrentToken)
    const socket = useSocketContext();

    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const COMPANY_UNREAD_NOTIFICATION_API = `${BaseApiURL}/notifications/company-unread`;
    const COUNT_UNREAD_API = `${BaseApiURL}/notifications/count-company-unread`;
    const MARK_AS_READ_API = `${BaseApiURL}/notifications/marked-as-read`;


      useEffect(() => {
        if (socket) {
          socket?.on("send-notification", (newMessage) => {
            const sound = new Audio(snapNotificationSound);
			sound.play();
            setUnreadCount((prev)=>prev+1)
          });
        }
      }, [socket]);

    const fetchUnreadNotifications = async () => {
        try {
            const response = await axios.get(COMPANY_UNREAD_NOTIFICATION_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            setNotifications(response.data.unReadNotifications);
        } catch (error) {
            console.error('Error while fetching company notifications', error);
            if (error.response?.data?.message === 'Invalid token!' || error.response?.data?.status === 502) {
                navigate('/LoginPage');
            }
        }
    };

    const getCount = async () => {
        try {
            const response = await axios.get(COUNT_UNREAD_API, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            setUnreadCount(response.data.unReadNotifications);
        } catch (error) {
            console.error('Error while fetching unread count', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`${MARK_AS_READ_API}/${notificationId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            // Update local state to reflect changes
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.notificationId === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
            // Fetch unread count again after marking as read
            getCount();
        } catch (error) {
            console.error('Error while marking notification as read', error);
        }
    };

    const handleClickNotification = (notificationId) => {
        markAsRead(notificationId);
    };

    const handleNotificationsClick = () => {
        setNotificationsOpen(!notificationsOpen);
        if (!notifications.length) {
            fetchUnreadNotifications();
        }
    };

    useEffect(() => {
        // Fetch unread count and notifications on component mount
        getCount();
        return () => {
            console.log('Cleaning up WebSocket events');
            // socket.off('notifications');
            // socket.off('unread-count');
            // socket.off('connect');
            // socket.off('disconnect');
        };
    }, []);

    return (
        <div className="notification-container">
            <div className="bell-btn" onClick={handleNotificationsClick}>
                <img src={bell} alt="Notifications" />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>
            {notificationsOpen && (
                <div className="notifications-dropdown">
                    {notifications.length === 0 ? (
                        <p>No new notifications</p>
                    ) : (
                        <ul>
                            {notifications.map((notification) => (
                                <li
                                    key={notification.notificationId}
                                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                    onClick={() => handleClickNotification(notification.notificationId)}
                                    style={{background: "rgba(0, 63, 182, 0.1019607843)"}} 
                                >
                                    <Link to={`${notification.links}`}>
                                    <div className="notification-by">{notification.senderEmployee.employeeName}</div>
                                    <div className="notification-message">{notification.message}</div>
                                    <div className="notification-time">{new Date(notification.createdAt).toLocaleString()}</div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
