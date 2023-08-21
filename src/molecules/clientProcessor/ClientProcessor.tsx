"use client"
import React, { useState, useEffect } from "react";
import ClientProccesorProps from "@molecules/clientProcessor/interfaces/clientPRocessor.interface";

const ClientProcessor: React.FC<ClientProccesorProps> = ({ children }) => {
	  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
	 setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <div>{children}</div>;
}

export default ClientProcessor;
