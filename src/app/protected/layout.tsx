import ProtectedRoute from "@/components/protectedRouter";
import React from "react";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
