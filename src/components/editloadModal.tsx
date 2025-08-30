"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Load = {
  name: string;
  volume: string;
  InAdvanceMethod: boolean;
  date: string;
  phoneNumber: string;
  price: string;
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
          <DialogTitle>Yukni Tahrirlash</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="volume">Hajm (m³)</Label>
            <Input
              id="volume"
              name="volume"
              value={formData.volume || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="price">Narx (USD)</Label>
            <Input
              id="price"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Telefon raqami</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>


          <div>
            <Label htmlFor="date">Sana</Label>
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
            <Label htmlFor="InAdvanceMethod">Oldindan to'lov</Label>
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit">Saqlash</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}