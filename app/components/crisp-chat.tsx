"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("d9aa3da4-5a86-41c6-aba3-649b3d78c6df");
  }, []);

  return null;
};
