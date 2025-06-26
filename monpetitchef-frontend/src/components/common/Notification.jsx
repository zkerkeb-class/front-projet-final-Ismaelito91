import React from "react";
import { useApp } from "../../contexts/AppContext";
import "./Notification.css";

const Notification = ({ notification }) => {
  const { removeNotification } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "ℹ";
    }
  };

  return (
    <div className={`notification notification--${notification.type}`}>
      <div className="notification__icon">{getIcon(notification.type)}</div>
      <div className="notification__content">
        <p className="notification__message">{notification.message}</p>
      </div>
      <button
        className="notification__close"
        onClick={() => removeNotification(notification.id)}
        aria-label="Fermer la notification"
      >
        ✕
      </button>
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
