import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '../../features/bytes/pages/admin/AdminLayout';
import { AdminGate } from '../../features/bytes/AdminGate';
export const Route = createFileRoute('/admin')({ component: () => <AdminGate><AdminLayout /></AdminGate> });
