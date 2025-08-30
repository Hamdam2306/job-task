'use client';

import { useEffect, useState } from 'react';
import client from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Mavjud tiplardan foydalanamiz
// type User = { id: string; username: string };
type Location = { id: string; name: string };
type Car = { id: string; model: string };
type PaymentMethod = { id: string; type: string };
type LoadData = {
    name: string;
    fromLoc: string;
    toLoc: string;
    user: string;
    volume: string;
    InAdvanceMethod: boolean;
    telegram: string;
    paymentMethod: string;
    date: string;
    phoneNumber: string;
    car: string;
    price: string;
};

interface AddLoadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: LoadData) => void;
}

export default function AddLoadModal({ isOpen, onClose, onSave }: AddLoadModalProps) {
    const [formData, setFormData] = useState<LoadData>({
        name: '',
        volume: '',
        date: '',
        price: '',
        phoneNumber: '',
        telegram: '',
        fromLoc: '',
        toLoc: '',
        car: '',
        paymentMethod: '',
        user: '',
        InAdvanceMethod: false,
    });

    // Select-lar uchun ma'lumotlarni saqlash
    //   const [users, setUsers] = useState<User[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    // Modal ochilganda kerakli ma'lumotlarni PocketBase'dan yuklash
    useEffect(() => {
        async function fetchOptions() {
            try {
                // const usersData = await client.collection('users').getFullList<User>();
                // const locationsData = await client.collection('locations').getFullList<Location>();
                const carsData = await client.collection('cars').getFullList<Car>();
                const paymentMethodsData = await client.collection('paymentMethods').getFullList<PaymentMethod>();

                // setUsers(usersData);
                // setLocations(locationsData);
                setCars(carsData);
                setPaymentMethods(paymentMethodsData);
            } catch (error) {
                console.error("Failed to fetch options for the form:", error);
            }
        }
        if (isOpen) {
            fetchOptions();
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof LoadData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, InAdvanceMethod: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yangi yuk qo'shish</DialogTitle>
                    <DialogDescription>
                        Yangi yuk uchun barcha kerakli ma'lumotlarni to'ldiring.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        {/* Input fields */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Yuk nomi</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="volume">Hajmi (tonna)</Label>
                            <Input id="volume" name="volume" value={formData.volume} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Narxi</Label>
                            <Input id="price" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Telefon raqami</Label>
                            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Sana</Label>
                            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telegram">Telegram username</Label>
                            <Input id="telegram" name="telegram" value={formData.telegram} onChange={handleChange} />
                        </div>

                        {/* Select fields */}

                        {/* Qayerdan */}
                        <div className="space-y-2">
                            <Label htmlFor="fromLoc">Qayerdan</Label>
                            <Input
                                id="fromLoc"
                                name="fromLoc"
                                value={formData.fromLoc}
                                onChange={handleChange}
                                placeholder="Manzilni kiriting"
                               
                            />
                        </div>

                        {/* Qayerga */}
                        <div className="space-y-2">
                            <Label htmlFor="toLoc">Qayerga</Label>
                            <Input
                                id="toLoc"
                                name="toLoc"
                                value={formData.toLoc}
                                onChange={handleChange}
                                placeholder="Manzilni kiriting"
                               
                            />
                        </div>

                        {/* Mashina */}
                        <div className="space-y-2">
                            <Label htmlFor="car">Mashina</Label>
                            <Input
                                id="car"
                                name="car"
                                value={formData.car}
                                onChange={handleChange}
                                placeholder="Mashina nomini kiriting"
                               
                            />
                        </div>

                        {/* To'lov usuli */}
                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">To'lov usuli</Label>
                            <Input
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                placeholder="To'lov usulini kiriting"
                               
                            />
                        </div>


                        {/* Checkbox */}
                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox id="InAdvanceMethod" checked={formData.InAdvanceMethod} onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)} />
                            <Label htmlFor="InAdvanceMethod">Bo'nak (avans) beriladimi?</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Bekor qilish</Button>
                        <Button type="submit">Saqlash</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}