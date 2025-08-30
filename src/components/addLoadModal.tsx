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
    const [name, setName] = useState('');
    const [fromLoc, setFromLoc] = useState('');
    const [toLoc, setToLoc] = useState('');
    const [volume, setVolume] = useState('');
    const [price, setPrice] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [telegram, setTelegram] = useState('');

    const defaultData = {
        user: "",
        car: "",
        paymentMethod: "",
        InAdvanceMethod: false,
        date: new Date().toISOString(),
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
            ...defaultData
        });
    };

    const handleSave = () => {
        if (!name.trim()) {
            alert("Please enter a valid name.");
            return;
        }
        onSave({
            name,
            fromLoc,
        })
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new load</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                name
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
                                fromLoc
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
                                to
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
                                volcume
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
                                price
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
                                phoneNumber
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
                                telegram
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
                        <Button type="button" variant="outline" onClick={onClose}>cancel</Button>
                        <Button type="submit" onClick={handleSave}>add</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLoadModal;