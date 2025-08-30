import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AddLoadModalProps = {
    onClose: () => void;
    onSave: (data: unknown) => void;
};

const AddLoadModal = ({ onClose, onSave }: AddLoadModalProps) => {
    const [name, setName] = useState('');
    const [fromLoc, setFromLoc] = useState('');
    const [toLoc, setToLoc] = useState('');
    const [user, setUser] = useState('');
    const [volume, setVolume] = useState('');
    const [car, setCar] = useState('');
    const [price, setPrice] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [telegram, setTelegram] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleSubmit = () => {
        if (!name.trim() || !fromLoc.trim() || !toLoc.trim() || !user.trim()) {
            alert("Please fill in all required fields.");
            return;
        }

        onSave({
            name,
            fromLoc,
            toLoc,
            user,
            volume,
            car,
            price,
            phoneNumber,
            telegram,
            paymentMethod,
            date: new Date().toISOString()
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add new load</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name *
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-[300px]"
                            placeholder="Load name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fromLoc" className="text-right">
                            From *
                        </Label>
                        <Input
                            id="fromLoc"
                            value={fromLoc}
                            onChange={(e) => setFromLoc(e.target.value)}
                            required
                            className="w-[300px]"
                            placeholder="Departure location"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="toLoc" className="text-right">
                            To *
                        </Label>
                        <Input
                            id="toLoc"
                            value={toLoc}
                            onChange={(e) => setToLoc(e.target.value)}
                            required
                            className="w-[300px]"
                            placeholder="Destination"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="user" className="text-right">
                            User *
                        </Label>
                        <Input
                            id="user"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                            className="w-[300px]"
                            placeholder="User name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="volume" className="text-right">
                            Volume *
                        </Label>
                        <Input
                            id="volume"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            required
                            className="w-[300px]"
                            placeholder="Volume in m3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="car" className="text-right">
                            Car *
                        </Label>
                        <Input
                            id="car"
                            value={car}
                            onChange={(e) => setCar(e.target.value)}
                            required
                            className="w-[300px]"
                            placeholder="Car details"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price *
                        </Label>
                        <Input
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="w-[300px]"
                            placeholder="Price amount"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phoneNumber" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-[300px]"
                            placeholder="+998 XX XXX XX XX"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="paymentMethod" className="text-right">
                            Payment
                        </Label>
                        <Input
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-[300px]"
                            placeholder="Payment method"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit}>
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddLoadModal;