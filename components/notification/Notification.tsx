'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Bell } from "lucide-react"
import { DateTime } from "luxon"
import axios from "axios"
import Cookies from 'js-cookie';


interface NotificationProps {
  title: string
  message: string
  date: string
  isSeen: boolean
  purpose?: string
  name: string
  id: string
}

let response = '';
export function Notification({ id, title, message, date, isSeen, purpose }: NotificationProps) {
  const cookie = Cookies.get("timezoneData");
  let timezone;
  console.log(cookie)
  if (cookie) {
    const jsonParesd = JSON.parse(cookie);
    const { data: { userTimezone } } = jsonParesd;
    timezone = userTimezone;
  }

  console.log("title", isSeen);

  const now = new Date();
  const isoDate = now.toISOString().slice(0, 19);

  const interactive = purpose === "allow/deny";
  const [responded, setResponded] = useState(false)
  const luxonDate = DateTime.fromFormat(date, "yyyy-MM-dd'T'HH:mm:ss z");

  const jsDate = luxonDate.isValid ? luxonDate.toJSDate() : new Date();

  const interactiveFunc = async () => {
    let body;
    const name = message.match(/User (\w+) has/)[1];
    const title = message.match(/(?<=your event ")([^"]+)(?=")/)[0];
    if (purpose == "allow/deny") {
      body = {
        notifications: [
          {
            title: response === "accepted" ? "You've Been Accepted!" : "Request Declined",
            message: response === "accepted" ? "Great news! The host has approved your request to join the event. Get ready to participate and have a great time!" : "Unfortunately, the host has declined your request to join the event. Don't worry — there are plenty of other great events waiting for you!",
            date: isoDate,
            purpose: "inbox",
            recipient: name,
            timezone
          }
        ]
      }
    }
    try {
      const URL = "http://localhost:3000/api/create-notification";
      const changeButtonState = await axios.post("http://localhost:3000/api/buttonStateOnName", { title, clientName: name, buttonState: response, id })
      const data = await axios.post(URL, body)
    } catch (err) {
      console.log(err);
    } 
  }

  const formattedDate = formatDistanceToNow(jsDate, { addSuffix: true });

  return (
    <Card className={`transition-colors bg-white mb-2`}>
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
                  onClick={async () => {
                    setResponded(true)
                    response = "accepted";
                    await interactiveFunc();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={async () => {
                    setResponded(true)
                    response = "rejected";
                    await interactiveFunc();
                  }}
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
