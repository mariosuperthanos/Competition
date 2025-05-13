'use client'

import { use, useEffect } from "react";
import prisma from "../lib/prisma";

const ExpireNotifications = ({ idsToUpdate }) => {
  useEffect(() => {
    const expire = async () => {
      try {
        await fetch("http://localhost:3000/api/expire-notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ids: idsToUpdate })
        });
      } catch (error) {
        console.error("Failed to expire notifications", error);
      }
    };

    if (idsToUpdate.length > 0) {
      expire();
    }
  }, [idsToUpdate]);

  return null;
};

export default ExpireNotifications;