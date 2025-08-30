"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type CarData = {
  name: string;
  volume: number | string;
  type: string;
  carNumber: string;
  user?: string;
  location?: string;
  from?: string;
  to?: string;
  model?: string;
};

type AddCarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (carData: CarData) => void;
};

export default function AddCarModal({ isOpen, onClose, onSave }: AddCarModalProps) {
  const [carData, setCarData] = useState<CarData>({
    name: "",
    volume: "",
    type: "",
    carNumber: "",
    user: "",
    location: "",
    from: "",
    to: "",
    model: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: name === "volume" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  function inputReset() {
    setCarData({
      name: "",
      volume: "",
      type: "",
      carNumber: "",
      user: "",
      location: "",
      from: "",
      to: "",
      model: "",
    });
  }

  const handleSave = () => {
    if (!carData.name.trim()) {
      alert("Please enter a valid name.");
      return;
    }
    onSave(carData);
    onClose();
    inputReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new car</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={carData.name}
              onChange={handleChange}
              className="col-span-3"
              placeholder="car name"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="volume" className="text-right">
              Volume
            </Label>
            <Input
              id="volume"
              name="volume"
              type="number"
              value={carData.volume}
              onChange={handleChange}
              className="col-span-3"
              placeholder="volume"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input
              id="type"
              name="type"
              value={carData.type}
              onChange={handleChange}
              className="col-span-3"
              placeholder="car type"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="carNumber" className="text-right">
              Number
            </Label>
            <Input
              id="carNumber"
              name="carNumber"
              value={carData.carNumber}
              onChange={handleChange}
              className="col-span-3"
              placeholder="car number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Input
              id="model"
              name="model"
              value={carData.model}
              onChange={handleChange}
              className="col-span-3"
              placeholder="car model"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">
              User
            </Label>
            <Input
              id="user"
              name="user"
              value={carData.user}
              onChange={handleChange}
              className="col-span-3"
              placeholder="user name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={carData.location}
              onChange={handleChange}
              className="col-span-3"
              placeholder="current location"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="from" className="text-right">
              From
            </Label>
            <Input
              id="from"
              name="from"
              value={carData.from}
              onChange={handleChange}
              className="col-span-3"
              placeholder="departure location"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to" className="text-right">
              To
            </Label>
            <Input
              id="to"
              name="to"
              value={carData.to}
              onChange={handleChange}
              className="col-span-3"
              placeholder="destination"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}