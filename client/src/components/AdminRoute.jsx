import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAdmin } from '../redux/slices/authSlice';

export default function AdminRoute({ children }) {
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
