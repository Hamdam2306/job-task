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

type User = {
  id: string;
  username: string;
  email?: string;
  name?: string;
};

type Location = {
  id: string;
  name: string;
};

type CarModel = {
  id: string;
  name: string;
  brand?: string;
};

type Car = {
  collectionId: string;
  collectionName: string;
  id: string;
  name: string;
  volume: number;
  user: string;
  type: string;
  location: {
    lon: number;
    lat: number;
  };
  from: string;
  to: string;
  model: string;
  carNumber: string;
  created: string;
  updated: string;
  expand?: {
    user?: User;
    from?: Location;
    to?: Location;
    model?: CarModel;
  };
};

type EditCarModalProps = {
  car: Car;
  onClose: () => void;
  onSave: (updatedCar: Car) => void;
};

export default function EditCarModal({ car, onClose, onSave }: EditCarModalProps) {
  const [formData, setFormData] = useState(car);

  useEffect(() => {
    setFormData(car);
  }, [car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "volume" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Edit Car</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Car name"
            />
          </div>

          <div>
            <Label htmlFor="volume">Volume</Label>
            <Input
              id="volume"
              name="volume"
              type="number"
              value={formData.volume || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Volume in m3"
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Car type"
            />
          </div>

          <div>
            <Label htmlFor="carNumber">Car Number</Label>
            <Input
              id="carNumber"
              name="carNumber"
              value={formData.carNumber || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Car number"
            />
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              value={formData.expand?.model?.name || formData.model || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Car model"
            />
          </div>

          <div>
            <Label htmlFor="user">User</Label>
            <Input
              id="user"
              name="user"
              value={formData.expand?.user?.username || formData.expand?.user?.name || formData.user || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="User name"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location ? `${formData.location.lat}, ${formData.location.lon}` : ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Current location"
            />
          </div>

          <div>
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              name="from"
              value={formData.expand?.from?.name || formData.from || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Departure location"
            />
          </div>

          <div>
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              name="to"
              value={formData.expand?.to?.name || formData.to || ""}
              onChange={handleChange}
              className="mt-1"
              placeholder="Destination"
            />
          </div>
        </div>

        <DialogFooter className="pt-4 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}