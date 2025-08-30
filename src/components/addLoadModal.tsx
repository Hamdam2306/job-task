// src/components/addLoadModal.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AddLoadModalProps = {
    onClose: () => void;
    onSave: (data: any) => void;
};

const AddLoadModal = ({ onClose, onSave }: AddLoadModalProps) => {
    // Majburiy maydonlar uchun state-lar
    const [name, setName] = useState('');
    const [fromLoc, setFromLoc] = useState('');
    const [toLoc, setToLoc] = useState('');
    const [volume, setVolume] = useState('');
    const [price, setPrice] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [telegram, setTelegram] = useState('');
    
    // Boshqa majburiy maydonlarga standart qiymatlar berish
    const defaultData = {
        user: "o'zingizning foydalanuvchi ID", // Sizning joriy foydalanuvchingizning ID'si bo'lishi kerak
        car: "o'zingizning avtomobil ID", // Tanlangan avtomobil ID'si
        paymentMethod: "o'zingizning to'lov usuli ID", // Tanlangan to'lov usuli ID'si
        InAdvanceMethod: false,
        date: new Date().toISOString(), // Joriy sana
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            name, 
            fromLoc, 
            toLoc, 
            volume,
            price,
            phoneNumber,
            telegram,
            ...defaultData // Majburiy ma'lumotlarga qo'shimcha standart qiymatlar
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yangi yuk qo'shish</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nomi
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fromLoc" className="text-right">
                                Qayerdan
                            </Label>
                            <Input
                                id="fromLoc"
                                value={fromLoc}
                                onChange={(e) => setFromLoc(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="toLoc" className="text-right">
                                Qayerga
                            </Label>
                            <Input
                                id="toLoc"
                                value={toLoc}
                                onChange={(e) => setToLoc(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="volume" className="text-right">
                                Hajmi
                            </Label>
                            <Input
                                id="volume"
                                value={volume}
                                onChange={(e) => setVolume(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Narxi
                            </Label>
                            <Input
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                                Telefon
                            </Label>
                            <Input
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="telegram" className="text-right">
                                Telegram
                            </Label>
                            <Input
                                id="telegram"
                                value={telegram}
                                onChange={(e) => setTelegram(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Bekor qilish</Button>
                        <Button type="submit">Qo'shish</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLoadModal;