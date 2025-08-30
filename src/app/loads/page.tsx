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
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import EditLoadModal from '@/components/editloadModal';
import AddLoadModal from '@/components/addLoadModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-separator';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/app-sidebar';

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
        } catch (error: unknown) {
            if (
                (error as any)?.isAbort ||
                abortControllerRef.current?.signal.aborted
            ) {
                return;
            }

            if (error instanceof Error) {
                console.error("Fetch error:", error.message);
            } else {
                console.error("Fetch error: Unknown error", error);
            }
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

    const handleAddLoad = (newLoadData: unknown) => {

        if (typeof newLoadData === 'object' && newLoadData !== null) {
            addLoad(newLoadData as Omit<Load, 'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'>);
            handleCloseAddModal();
        }
    };

    useEffect(() => {
        fetchLoad();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
      <div className='flex'>
        <Sidebar />

          <div className="mx-auto mt-8 w-full max-w-[1600px] px-4 ">
            <Navbar />
            <Card className="border-2 shadow-sm">
                <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-2xl">Loads</CardTitle>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <Button onClick={handleOpenAddModal} className="gap-2 border">
                            <Plus size={16} /> add
                        </Button>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span>
                                Loading loads... Please wait.
                            </span>
                        </div>
                    ) : loads.length === 0 ? (
                        <div className="rounded-2xl border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
                            No loads found. Click Add to create a new load.
                        </div>
                    ) : (
                        <ScrollArea className="w-full rounded-2xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[180px]">ID</TableHead>
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
                                        <TableHead>InAdvance</TableHead>
                                        <TableHead>created</TableHead>
                                        <TableHead>updated</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loads.map((load) => (
                                        <TableRow key={load.id}>
                                            <TableCell className="font-mono text-xs">
                                                {load.id}
                                            </TableCell>
                                            <TableCell className="font-medium">{load.name}</TableCell>
                                            <TableCell>
                                                {load.expand?.user?.username ||
                                                    load.expand?.user?.name ||
                                                    load.expand?.user?.email ||
                                                    "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {load.volume ? (
                                                    <div>{load.volume}</div>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </TableCell>
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
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="gap-1"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to delete this load?"))
                                                                deleteload(load.id);
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>

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
      </div>
    );
}