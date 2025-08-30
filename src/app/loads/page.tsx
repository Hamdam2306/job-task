'use client';

import client from '@/lib/pocketbase';
import { useEffect, useState, useRef } from 'react';
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
import { Pencil, Plus, Trash2 } from 'lucide-react';
import EditLoadModal from '@/components/editloadModal';
import AddLoadModal from '@/components/addLoadModal';

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

export default function LoadDetailPage() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  async function fetchLoad() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const records = await client.collection('loads').getFullList<Load>({
        expand: 'user,fromLoc,toLoc,car,paymentMethod',
        requestKey: null,
      });

      if (!abortControllerRef.current?.signal.aborted) {
        setLoads(records);
      }
    } catch (error: Error | any) {
      if (error?.isAbort || abortControllerRef.current?.signal.aborted) {
        return;
      }
      console.error('Fetch error:', error);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }

  async function addLoad(data: Omit<Load, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>) {
    try {
      await client.collection('loads').create(data);
      fetchLoad();
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

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddLoad = (newLoadData: Partial<Load>) => {
    addLoad(newLoadData as Omit<Load, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>);
    handleCloseAddModal();
  };

  useEffect(() => {
    fetchLoad();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (loading) {
    return <div className="mx-auto mt-6">Loading...</div>;
  }

  return (
    <div className="mx-auto mt-6 max-w-[1700px] px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Loads</h1>
        <Button onClick={handleOpenAddModal} className="gap-1">
          <Plus size={16} /> add
        </Button>
      </div>
      <ScrollArea className="w-full rounded-2xl border p-5">
        <Table className="w-full">
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
                    "N/A"}
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
                <TableCell>{load.InAdvanceMethod ? "true" : "false"}</TableCell>
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
                      <Pencil size={16} /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => {
                        if (confirm("Rostdan ham o'chirmoqchimisiz?")) deleteload(load.id);
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      {isEditModalOpen && editingLoad && (
        <EditLoadModal
          load={editingLoad}
          onClose={handleCloseEditModal}
          onSave={handleSaveChanges}
        />
      )}
      {isAddModalOpen && (
        <AddLoadModal
          onClose={handleCloseAddModal}
          onSave={handleAddLoad}
        />
      )}
    </div>
  );
}