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
import { Loader2, Pencil, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import EditLoadModal from '@/components/editloadModal';
import AddLoadModal from '@/components/addLoadModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-separator';
import Navbar from '@/components/navbar';
 
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
    const [isMobileView, setIsMobileView] = useState(false);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

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

    const toggleRowExpansion = (id: string) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
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
            <div className="mx-auto mt-8 w-full max-w-[1500px] px-4 ">
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
                        ) : isMobileView ? (
                            <div className="space-y-4">
                                {loads.map((load) => (
                                    <div key={load.id} className="rounded-2xl border p-4">
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleRowExpansion(load.id)}
                                        >
                                            <div className="font-medium">{load.name}</div>
                                            <Button variant="ghost" size="sm">
                                                {expandedRow === load.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </Button>
                                        </div>

                                        {expandedRow === load.id && (
                                            <div className="mt-4 space-y-2">
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div className="text-muted-foreground">ID:</div>
                                                    <div className="font-mono text-xs truncate">{load.id}</div>

                                                    <div className="text-muted-foreground">User:</div>
                                                    <div>
                                                        {load.expand?.user?.username ||
                                                            load.expand?.user?.name ||
                                                            load.expand?.user?.email ||
                                                            "N/A"}
                                                    </div>

                                                    <div className="text-muted-foreground">Volume:</div>
                                                    <div>{load.volume || "N/A"}</div>

                                                    <div className="text-muted-foreground">Date:</div>
                                                    <div>{new Date(load.date).toLocaleDateString()}</div>

                                                    <div className="text-muted-foreground">Price:</div>
                                                    <div>{load.price}</div>

                                                    <div className="text-muted-foreground">Phone:</div>
                                                    <div>{load.phoneNumber}</div>

                                                    <div className="text-muted-foreground">From-To:</div>
                                                    <div>
                                                        {load.expand?.fromLoc?.name || "N/A"} -{" "}
                                                        {load.expand?.toLoc?.name || "N/A"}
                                                    </div>

                                                    <div className="text-muted-foreground">Car:</div>
                                                    <div>{load.expand?.car?.model || "N/A"}</div>

                                                    <div className="text-muted-foreground">Payment:</div>
                                                    <div>{load.expand?.paymentMethod?.type || "N/A"}</div>

                                                    <div className="text-muted-foreground">Telegram:</div>
                                                    <div>{load.telegram || "N/A"}</div>

                                                    <div className="text-muted-foreground">In Advance:</div>
                                                    <div>{load.InAdvanceMethod ? "true" : "false"}</div>

                                                    <div className="text-muted-foreground">Created:</div>
                                                    <div>{new Date(load.created).toLocaleDateString()}</div>

                                                    <div className="text-muted-foreground">Updated:</div>
                                                    <div>{new Date(load.updated).toLocaleDateString()}</div>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1 flex-1"
                                                        onClick={() => handleOpenEditModal(load)}
                                                    >
                                                        <Pencil size={16} /> Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="gap-1 flex-1"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to delete this load?"))
                                                                deleteload(load.id);
                                                        }}
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ScrollArea className="w-full rounded-2xl border">
                                <div className="relative w-full overflow-auto">
                                    <Table className="w-full">
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
                                                <TableHead className="text-right">actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loads.map((load) => (
                                                <TableRow key={load.id}>
                                                    <TableCell className="font-mono text-xs max-w-[180px] truncate">
                                                        {load.id}
                                                    </TableCell>
                                                    <TableCell className="font-medium max-w-[120px] truncate">{load.name}</TableCell>
                                                    <TableCell className="max-w-[120px] truncate">
                                                        {load.expand?.user?.username ||
                                                            load.expand?.user?.name ||
                                                            load.expand?.user?.email ||
                                                            "N/A"}
                                                    </TableCell>
                                                    <TableCell className="max-w-[80px] truncate">
                                                        {load.volume ? (
                                                            <div>{load.volume}</div>
                                                        ) : (
                                                            "N/A"
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="max-w-[100px] truncate">{new Date(load.date).toLocaleDateString()}</TableCell>
                                                    <TableCell className="max-w-[80px] truncate">{load.price}</TableCell>
                                                    <TableCell className="max-w-[120px] truncate">{load.phoneNumber}</TableCell>
                                                    <TableCell className="max-w-[150px] truncate">
                                                        {load.expand?.fromLoc?.name || "N/A"} -{" "}
                                                        {load.expand?.toLoc?.name || "N/A"}
                                                    </TableCell>
                                                    <TableCell className="max-w-[120px] truncate">{load.expand?.car?.model || "N/A"}</TableCell>
                                                    <TableCell className="max-w-[120px] truncate">{load.expand?.paymentMethod?.type || "N/A"}</TableCell>
                                                    <TableCell className="max-w-[120px] truncate">{load.telegram || "N/A"}</TableCell>
                                                    <TableCell className="max-w-[100px] truncate">{load.InAdvanceMethod ? "true" : "false"}</TableCell>
                                                    <TableCell className="max-w-[120px] truncate">{new Date(load.created).toLocaleDateString()}</TableCell>
                                                    <TableCell className="max-w-[120px] truncate">{new Date(load.updated).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
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
                                </div>
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
    );
}