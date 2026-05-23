import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';

export default function ProtectedRoute({ children }) {
  const user = useSelector(selectCurrentUser);
  return user ? children : <Navigate to="/login" replace />;
}
