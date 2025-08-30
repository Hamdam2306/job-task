"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Load = {
  name: string;
  fromLoc: string;
  toLoc: string;
  user: string;
  volume: string;
  car: string;
  price: string;
  phoneNumber: string;
  telegram: string;
  paymentMethod: string;
  InAdvanceMethod: boolean;
  date: string;
};

type EditLoadModalProps = {
  load: Load;
  onClose: () => void;
  onSave: (updatedLoad: Partial<Load>) => void;
};

export default function EditLoadModal({ load, onClose, onSave }: EditLoadModalProps) {
  const [formData, setFormData] = useState(load);

  useEffect(() => {
    setFormData(load);
  }, [load]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, InAdvanceMethod: checked }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Load</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Load name"
            />
          </div>

          <div>
            <Label htmlFor="fromLoc">From</Label>
            <Input
              id="fromLoc"
              name="fromLoc"
              value={formData.fromLoc || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Departure location"
            />
          </div>

          <div>
            <Label htmlFor="toLoc">To</Label>
            <Input
              id="toLoc"
              name="toLoc"
              value={formData.toLoc || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Destination"
            />
          </div>

          <div>
            <Label htmlFor="user">User</Label>
            <Input
              id="user"
              name="user"
              value={formData.user || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="User name"
            />
          </div>

          <div>
            <Label htmlFor="volume">Volume</Label>
            <Input
              id="volume"
              name="volume"
              value={formData.volume || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Volume in m3"
            />
          </div>

          <div>
            <Label htmlFor="car">Car</Label>
            <Input
              id="car"
              name="car"
              value={formData.car || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Car details"
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Price amount"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="+998 XX XXX XX XX"
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Input
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Payment method"
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date ? formData.date.split('T')[0] : ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="InAdvanceMethod"
              checked={formData.InAdvanceMethod}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="InAdvanceMethod">In Advance Method</Label>
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}