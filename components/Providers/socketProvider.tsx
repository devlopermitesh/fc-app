"use client";

import React, { useEffect } from "react";
import { disconnectSocket } from "@/sockets/connect";

function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return <>{children}</>;
}

export default SocketProvider;
