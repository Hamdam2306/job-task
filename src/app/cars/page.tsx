"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import client from "@/lib/pocketbase";
import EditCarModal from "@/components/editcarModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import AddCarModal from "@/components/addCarModal";
import Navbar from "@/components/navbar";

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

type CarModel = {
  id: string;
  name: string;
  brand?: string;
};

type Car = {
  collectionId: string;
  collectionName: string;
  id: string;
  name: string;
  volume: number;
  user: string;
  type: string;
  location: {
    lon: number;
    lat: number;
  };
  from: string;
  to: string;
  model: string;
  carNumber: string;
  created: string;
  updated: string;
  expand?: {
    user?: User;
    from?: Location;
    to?: Location;
    model?: CarModel;
  };
};

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isauth, setIsauth] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);


  async function fetchCars() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    try {
      setLoading(true);
      const records = await client.collection("cars").getFullList<Car>({
        expand: "user,from,to,model",
        requestKey: null,
      });
      if (!abortControllerRef.current?.signal.aborted) {
        setCars(records);
      }
    } catch (error: any) {
      if (error?.isAbort || abortControllerRef.current?.signal.aborted) {
        return;
      }
      console.error("Error fetching cars:", error);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }

  async function addCar(data: { name: string; volume: number | string; type: string; carNumber: string }) {
    try {
      await client.collection("cars").create({
        ...data,
        volume: Number(data.volume),
        user: client.authStore.record?.id,
      });
      fetchCars();
    } catch (error) {
      console.error("Error adding car:", error);
    }
  }

  async function updateCar(id: string, data: Partial<Car>) {
    try {
      const updatedData = {
        ...data,
        volume: Number(data.volume),
      };
      await client.collection("cars").update(id, updatedData);
      fetchCars();
    } catch (error) {
      console.error("Error updating car:", error);
    }
  }

  async function deleteCar(id: string) {
    try {
      await client.collection("cars").delete(id);
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  }

  const handleOpenEditModal = (car: Car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCar(null);
  };

  const handleSaveChanges = (updatedCarData: Partial<Car>) => {
    if (!editingCar) return;
    updateCar(editingCar.id, updatedCarData);
    handleCloseModal();
  };

  useEffect(() => {
    fetchCars();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const formattedCars = useMemo(
    () =>
      cars.map((c) => ({
        ...c,
        _created: c.created ? new Date(c.created).toLocaleString() : "N/A",
        _updated: c.updated ? new Date(c.updated).toLocaleString() : "N/A",
      })),
    [cars]
  );

  return (
    <div className="mx-auto mt-8 w-full max-w-[1600px] px-4">
      <Navbar />
      <Card className="border-2 shadow-sm">
        <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl">Cars</CardTitle>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 border">
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
                Loading cars... Please wait.

              </span>
            </div>
          ) : formattedCars.length === 0 ? (
            <div className="rounded-2xl border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
              No cars found. Click Add to create a new car.
            </div>
          ) : (
            <ScrollArea className="w-full rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">ID</TableHead>
                    <TableHead>name</TableHead>
                    <TableHead>user</TableHead>
                    <TableHead>volcume</TableHead>
                    <TableHead>type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>number</TableHead>
                    <TableHead>fromLoc</TableHead>
                    <TableHead>to</TableHead>
                    <TableHead>location</TableHead>
                    <TableHead>created</TableHead>
                    <TableHead>updated</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-mono text-xs">
                        {car.id}
                      </TableCell>
                      <TableCell className="font-medium">{car.name}</TableCell>
                      <TableCell>
                        {car.expand?.user?.username ||
                          car.expand?.user?.name ||
                          car.expand?.user?.email ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        {car.volume ? (
                          <div>{car.volume}</div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{car.type || "N/A"}</TableCell>
                      <TableCell>
                        {car.expand?.model?.name || "N/A"}
                      </TableCell>
                      <TableCell>{car.carNumber || "N/A"}</TableCell>
                      <TableCell>{car.expand?.from?.name || "N/A"}</TableCell>
                      <TableCell>{car.expand?.to?.name || "N/A"}</TableCell>
                      <TableCell>
                        {car.location ? (
                          <span className="font-mono text-xs">
                            {car.location.lat}, {car.location.lon}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{(car as any)._created}</TableCell>
                      <TableCell>{(car as any)._updated}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleOpenEditModal(car)}
                          >
                            <Pencil size={16} /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => {
                              if (
                                confirm("Rostdan ham o'chirmoqchimisiz?")
                              )
                                deleteCar(car.id);
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
          )}
        </CardContent>
      </Card>
      {isModalOpen && editingCar && (
        <EditCarModal
          car={editingCar}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        />
      )}
      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addCar}
      />
    </div>
  );
}