import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types/order';
import AddOrder from './AddOrder';

interface OrdersListProps {
  leadId: string;
}

export default function OrdersList({ leadId }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [leadId]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrdersByLeadId(leadId);
      setOrders(data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch orders');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatStatus = (status: OrderStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button onClick={() => setShowAddForm(true)}>Create Order</Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddOrder
            leadId={leadId}
            onSuccess={() => {
              setShowAddForm(false);
              fetchOrders();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No orders found</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{order.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Amount:</span> {formatCurrency(order.amount)}
                  </p>
                  <p>
                    <span className="font-medium">Quantity:</span> {order.quantity}
                  </p>
                  {order.deliveryDate && (
                    <p>
                      <span className="font-medium">Delivery Date:</span>{' '}
                      {formatDate(order.deliveryDate)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 