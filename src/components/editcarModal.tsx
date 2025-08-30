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

type Car = {
  id: string;
  name: string;
  volume: number;
  type: string;
  carNumber: string;
  user: string;
  from: string;
  to: string;
};

type EditCarModalProps = {
  car: Car;
  onClose: () => void;
  onSave: (updatedCar: Partial<Car>) => void;
};

export default function EditCarModal({ car, onClose, onSave }: EditCarModalProps) {
  const [formData, setFormData] = useState(car);

  useEffect(() => {
    setFormData(car);
  }, [car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <DialogTitle>edit car</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name">name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="volume">volcume</Label>
            <Input
              id="volume"
              name="volume"
              type="number"
              value={formData.volume || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="type">type</Label>
            <Input
              id="type"
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="carNumber">carNumber</Label>
            <Input
              id="carNumber"
              name="carNumber"
              value={formData.carNumber || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              cancel
            </Button>
            <Button type="submit">save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
