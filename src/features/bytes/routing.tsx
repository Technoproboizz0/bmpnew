import { Link as RouterLink, Outlet, useNavigate as useRouterNavigate, useLocation, useParams as useRouterParams } from '@tanstack/react-router';
import type { MouseEventHandler, ReactNode } from 'react';

export { Outlet };
type Props = { to: string; className?: string | ((state: { isActive: boolean }) => string); end?: boolean; children: ReactNode; onClick?: MouseEventHandler<HTMLAnchorElement>; title?: string }; 
export function Link({ to, className, end: _end, children, ...props }: Props) {
  return <RouterLink to={to as '/'} {...(className ? { className: typeof className === 'function' ? className({ isActive: false }) : className } : {})} {...props}>{children}</RouterLink>;
}
export function NavLink({ to, className, end, children, ...props }: Props) {
  const { pathname } = useLocation();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  return <Link to={to} {...(className ? { className: typeof className === 'function' ? className({ isActive }) : className } : {})} {...props}>{children}</Link>;
}
export function useNavigate() {
  const navigate = useRouterNavigate();
  return (to: string) => {
    const [pathname, query] = to.split('?');
    const search = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;
    return navigate({ to: pathname as '/', ...(search ? { search } : {}) });
  };
}
export function useParams() {
  return useRouterParams({ strict: false }) as { id?: string };
}
