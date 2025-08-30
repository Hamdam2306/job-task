"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Car turining qisman shaklini props sifatida qabul qilish uchun
// 'id', 'created', 'updated' kabi avtomatik to'ldiriladigan maydonlar kerak emas
type CarData = {
    name: string;
    volume: number | string; // Boshida string bo'lishi mumkin
    type: string;
    carNumber: string;
    // Qo'shimcha maydonlarni ham shu yerga qo'shishingiz mumkin
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
        });
    }

    const handleSave = () => {
        // Ma'lumotlarni saqlashdan oldin kerakli validatsiyadan o'tkazishingiz mumkin
        if (!carData.name.trim()) {
            alert("Mashina nomi kiritilishi shart!");
            return;
        }
        onSave(carData);
        onClose(); // Saqlagandan keyin oynani yopish
        inputReset();
    };

   
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yangi mashina qo'shish</DialogTitle>

                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={carData.name}
                            onChange={handleChange}
                            className="col-span-3"
                            placeholder="car name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="volume" className="text-right">
                            Volcume
                        </Label>
                        <Input
                            id="volume"
                            name="volume"
                            type="number"
                            value={carData.volume}
                            onChange={handleChange}
                            className="col-span-3"
                            placeholder="volume in m3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            type
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
                            number
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
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Bekor qilish
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave}>
                        Qo'shish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}