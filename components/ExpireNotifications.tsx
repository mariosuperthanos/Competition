'use client'

import { use, useEffect } from "react";
import prisma from "../lib/prisma";
import { getCsrfToken } from "next-auth/react";
import axios from "axios";

const ExpireNotifications = ({ idsToUpdate }) => {
  useEffect(() => {
    const expire = async () => {
      try {
        const csrfToken = await getCsrfToken();
        await axios.post(
          "http://localhost:3000/api/expire-notifications",
          { ids: idsToUpdate },
          {
            headers: {
              "Content-Type": "application/json",
              "csrf-token": csrfToken
            },
            withCredentials: true,
          }
        );
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