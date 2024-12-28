import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orderService } from '../../services/orderService';
import { CreateOrderData, OrderStatus } from '../../types/order';

interface AddOrderProps {
  leadId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddOrder({ leadId, onSuccess, onCancel }: AddOrderProps) {
  const [formData, setFormData] = useState<CreateOrderData>({
    leadId,
    amount: 0,
    status: OrderStatus.PENDING,
    name: '',
    quantity: 1,
    deliveryDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' 
      ? Number(e.target.value) 
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleStatusChange = (value: OrderStatus) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await orderService.createOrder(formData);
      toast.success('Order created successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create order');
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Create New Order</h3>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Order Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter order name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              placeholder="Enter quantity"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
                <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="deliveryDate" className="text-sm font-medium">
              Delivery Date
            </label>
            <Input
              id="deliveryDate"
              name="deliveryDate"
              type="datetime-local"
              value={formData.deliveryDate}
              onChange={handleChange}
              placeholder="Select delivery date"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Create Order
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 