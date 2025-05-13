'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Bell } from "lucide-react"
import { DateTime } from "luxon"

interface NotificationProps {
  title: string
  message: string
  date: string
  isSeen: boolean
  interactive?: boolean
}

export function Notification({ title, message, date, isSeen, interactive = false }: NotificationProps) {
  console.log("title", isSeen)
  const [responded, setResponded] = useState(false)
  const luxonDate = DateTime.fromFormat(date, "yyyy-MM-dd'T'HH:mm:ss z");

  const jsDate = luxonDate.isValid ? luxonDate.toJSDate() : new Date();

  const formattedDate = formatDistanceToNow(jsDate, { addSuffix: true });

  return (
    <Card className={`transition-colors`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className={`p-2 rounded-full ${isSeen ? "bg-red-600" : "bg-primary/10"}`}>
              <Bell className={`h-5 w-5 ${isSeen ? "text-white" : "text-primary"}`} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-medium`}>
                {title}
                {!isSeen && <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />}
              </h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formattedDate}</span>
            </div>

            <p className={`mt-1 text-sm`}>{message}</p>

            {interactive && !responded && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setResponded(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => setResponded(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {isSeen && (
          <div className="absolute top-2 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5 text-red-600"
            >
              <path d="M12 2v20M12 2l9 9M12 2l-9 9" />
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
