'use client';

import client from '@/lib/pocketbase';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle } from 'lucide-react'; // PlusCircle ni import qilamiz
import EditLoadModal from '@/components/editloadModal';
import AddLoadModal from '@/components/addLoadModal'; // Yangi modalni import qilamiz

// ... tiplar o'zgarishsiz qoladi ...

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

type Car = {
    id: string;
    model: string;
    brand?: string;
};

type PaymentMethod = {
    id: string;
    type: string;
};

type Load = {
    collectionId: string;
    collectionName: string;
    id: string;
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
    created: string;
    updated: string;
    expand?: {
        user?: User;
        fromLoc?: Location;
        toLoc?: Location;
        car?: Car;
        paymentMethod?: PaymentMethod;
    };
};

// Yangi yuk ma'lumotlari uchun tip
type NewLoadData = Omit<Load, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated' | 'expand'>;


export default function LoadDetailPage() {
    const [loads, setLoads] = useState<Load[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Edit modal uchun state-lar
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLoad, setEditingLoad] = useState<Load | null>(null);

    // ---- YANGI QO'SHILGAN STATE ----
    // Add modal uchun state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);


    async function fetchLoad() {
        try {
            const records = await client.collection('loads').getFullList<Load>({
                expand: 'user,fromLoc,toLoc,car,paymentMethod',
            });
            setLoads(records);
        } catch (error) {
            console.error('fetch error:', error);
        } finally {
            setLoading(false);
        }
    }

    // ---- ESKI addloads FUNKSIYASI O'RNIGA YANGISI ----
    async function addLoad(data: NewLoadData) {
        try {
            await client.collection('loads').create(data);
            fetchLoad(); // Jadvalni yangilash
            setIsAddModalOpen(false); // Modalni yopish
        } catch (error) {
            console.error('Add error:', error);
        }
    }

    async function updateload(id: string, data: Partial<Load>) {
        try {
            await client.collection('loads').update(id, data);
            fetchLoad();
        } catch (error) {
            console.error('Update error:', error);
        }
    }

    async function deleteload(id: string) {
        try {
            await client.collection('loads').delete(id);
            fetchLoad();
        } catch (error) {
            console.error('Delete error:', error);
        }
    }

    // Edit modal handler-lari
    const handleOpenEditModal = (load: Load) => {
        setEditingLoad(load);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingLoad(null);
    };

    const handleSaveChanges = (updatedLoadData: Partial<Load>) => {
        if (!editingLoad) return;
        updateload(editingLoad.id, updatedLoadData);
        handleCloseEditModal();
    };


    useEffect(() => {
        fetchLoad();
    }, []);

    if (loading) {
        return <div className="mx-auto mt-6">Loading...</div>;
    }
    
    // Bu qism o'zgarishsiz qoladi
    // if (loads.length === 0) ...
    

    return (
        <div className="mx-auto mt-6 max-w-[1700px] px-4">
            {/* ---- Sarlavha yoniga tugma qo'shildi ---- */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Yuk tafsilotlari</h1>
              <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                <PlusCircle size={20} />
                Yuk qo'shish
              </Button>
            </div>

            {/* Jadval qismi o'zgarishsiz qoladi */}
            <ScrollArea className="w-full rounded-2xl border p-5">
                <Table className="w-full ">
                   {/* TableHeader va TableBody ... */}
                   <TableHeader>
                         <TableRow>
                             <TableHead>id</TableHead>
                             <TableHead>name</TableHead>
                             <TableHead>user</TableHead>
                             <TableHead>volume</TableHead>
                             <TableHead>date</TableHead>
                             <TableHead>price</TableHead>
                             <TableHead>phoneNumber</TableHead>
                             <TableHead>from-to</TableHead>
                             <TableHead>car</TableHead>
                             <TableHead>payment</TableHead>
                             <TableHead>Telegram</TableHead>
                             <TableHead>InAdvanceMethod</TableHead>
                             <TableHead>created</TableHead>
                             <TableHead>updated</TableHead>
                             <TableHead></TableHead>
                         </TableRow>
                     </TableHeader>
                     <TableBody>
                         {loads.map((load) => (
                             <TableRow key={load.id}>
                                 <TableCell>{load.id}</TableCell>
                                 <TableCell>{load.name}</TableCell>
                                 <TableCell>
                                     {load.expand?.user?.username ||
                                         load.expand?.user?.name ||
                                         load.expand?.user?.email ||
                                         "Noma'lum"}
                                 </TableCell>
                                 <TableCell>{load.volume}</TableCell>
                                 <TableCell>{new Date(load.date).toLocaleDateString()}</TableCell>
                                 <TableCell>{load.price}</TableCell>
                                 <TableCell>{load.phoneNumber}</TableCell>
                                 <TableCell>
                                     {load.expand?.fromLoc?.name || "N/A"} -{" "}
                                     {load.expand?.toLoc?.name || "N/A"}
                                 </TableCell>
                                 <TableCell>{load.expand?.car?.model || "N/A"}</TableCell>
                                 <TableCell>{load.expand?.paymentMethod?.type || "N/A"}</TableCell>
                                 <TableCell>{load.telegram || "N/A"}</TableCell>
                                 <TableCell>{load.InAdvanceMethod ? "Ha" : "Yo'q"}</TableCell>
                                 <TableCell>{new Date(load.created).toLocaleDateString()}</TableCell>
                                 <TableCell>{new Date(load.updated).toLocaleDateString()}</TableCell>

                                 <TableCell>
                                     <div className="flex items-center gap-2">
                                         <Button
                                             size="sm"
                                             variant="outline"
                                             className="gap-1"
                                             onClick={() => handleOpenEditModal(load)}
                                         >
                                             <Pencil size={16} /> Tahrirlash
                                         </Button>
                                         <Button
                                             size="sm"
                                             variant="destructive"
                                             className="gap-1"
                                             onClick={() => {
                                                 if (confirm("Rostdan ham o'chirmoqchimisiz?")) deleteload(load.id);
                                             }}
                                         >
                                             <Trash2 size={16} /> O'chirish
                                         </Button>
                                     </div>
                                 </TableCell>
                             </TableRow>
                         ))}
                     </TableBody>
                </Table>
            </ScrollArea>

            {/* ---- MODALLAR QISMI ---- */}
            {/* Edit Load Modal */}
            {isEditModalOpen && editingLoad && (
                <EditLoadModal
                    load={editingLoad}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveChanges}
                />
            )}

            {/* Add Load Modal (Yangi qo'shildi) */}
            <AddLoadModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={addLoad}
            />
        </div>
    );
}