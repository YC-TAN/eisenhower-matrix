import './Notification.css';
import { useNotification } from '../../stores/useNotification';

const Notification = () => {
    const notification = useNotification();
    if (!notification) return null;

    const {message, type} = notification;
  return (
    <div className={`notification ${type}`}>
        {message}
    </div>
  )
}

export default Notification