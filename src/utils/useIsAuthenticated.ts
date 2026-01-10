import { selectToken } from '../store/auth';
import { useAppSelector } from './useAppStore';

export const useIsAuthenticated = () => !!useAppSelector(selectToken);
