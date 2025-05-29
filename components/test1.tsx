"use client";

import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import MapComponent from "./event/Map";
import { useEffect, useState } from "react";
import Cookie from 'js-cookie';
import { getCsrfToken, getSession, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import axios from "axios";

interface EventPageProps {
  id: string | number
  title: string
  description: string
  time: string | Date
  host: string
  location: string
  image: string
  timezone: string
  tags: string[]
  lat: number
  lng: number
  clientName?: string
  clientId?: string | number
  buttonState?: string
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}
let message = "";
export default function Event2({ id, title, description, time, host, location, image, tags, lat, lng, clientName, clientId, buttonState }: EventPageProps) {
  const { data: session, status } = useSession();
  const shareText = encodeURIComponent("Check out this interesting post!");
  const shareUrl = encodeURIComponent(`${window.location.origin}`);
  // Convert time to Date object if it's a string
  const eventStartHour = typeof time.startHour === "string" ? new Date(time) : time
  console.log(time);
  const [clicked, setClicked] = useState(buttonState === "unclicked" ? false : true);

  if (clicked === false) {
    message = "Apply to the event!";
  } else if (buttonState === "rejected") {
    message = "You were rejected!";
  } else if (buttonState === "accepted") {
    message = "You were accepted!";
  }
  else if (buttonState === "host") {
    message = "You are the host of the event!";
  }
  else if (buttonState === "requested" || clicked === true) {
    message = "Your request was sent.";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[550px] xl:h-[600px] rounded-lg sm:rounded-xl overflow-hidden mb-6 sm:mb-8">
      <Image
        src={image || "/placeholder.svg?height=600&width=800"}
        alt={title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
        <div className="p-4 sm:p-6 md:p-8 text-white w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight max-w-full break-words">
            {title}
          </h1>
        </div>
      </div>

      {tags?.length > 0 && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-wrap items-start gap-1 sm:gap-2 z-10 max-w-[60%] sm:max-w-[50%] justify-end">
          {tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="bg-black/70 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 rounded-full font-medium backdrop-blur-sm"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="bg-black/70 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 rounded-full font-medium backdrop-blur-sm">
              +{tags.length - 4}
            </span>
          )}
        </div>
      )}
    </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line break-words overflow-hidden">
                  {description}
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="pt-4"> </div>
          <MapComponent lat={lat} lng={lng} shouldRender={true} settings={{
            purpose: "marker",
          }} />

        </div>


        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{time.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Start Time</p>
                  <p className="text-sm text-muted-foreground">
                    {time.startHour}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">End Time</p>
                  <p className="text-sm text-muted-foreground">
                    {time.endHour}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Host</p>
                  <p className="text-sm text-muted-foreground">{host}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Share This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <button
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}
                  aria-label="Share on Facebook"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </button>

                <button
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank')}
                  aria-label="Share on Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </button>

                <button
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  onClick={() => window.open('https://www.instagram.com', '_blank')}
                  aria-label="Share on Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </button>
              </div>

            </CardContent>
          </Card>

        </div>
        <button className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl px-6 py-2.5 shadow-md transition duration-200 ease-in-out w-full md:w-auto" disabled={clicked} onClick={async () => {
          setClicked(true)
          const sendNofification = async () => {
            const now = new Date();
            const formattedDate = now.toISOString().split('.')[0];

            const timezoneJSON = Cookie.get('timezoneData');
            const data = JSON.parse(timezoneJSON!);
            const timezone = data.data.timezone;
            console.log("timezone", timezone);
            const csrfToken = await getCsrfToken();

            const response = await axios.post(`${window.location.origin}/api/create-notification`, {
              notifications: [
                {
                  title: "Request to Join Event",
                  message: `User ${clientName} has requested to join your event "${title}". Would you like to approve their participation?`,
                  date: formattedDate,
                  purpose: "allow/deny",
                  recipient: host,
                  timezone,
                },
              ],
            }, {
              headers: {
                "Content-Type": "application/json",
                "csrf-token": csrfToken,
              },
              withCredentials: true,
            })

            const changeButtonState = await axios.post(`${window.location.origin}/api/buttonState`, { userId: clientId, eventId: id, buttonState: "requested" }, {
              headers: {
                "Content-Type": "application/json",
                "csrf-token": csrfToken,
              },
              withCredentials: true,
            })

          }
          await sendNofification();
        }}>
          {message}
        </button>

      </div>
    </div >
  )
}

// 'use client';

// export default function Postare() {
//   const shareText = encodeURIComponent("Uită-te la această postare interesantă!");
//   const shareUrl = encodeURIComponent("https://exemplu.ro/postare");

//   const links = [
//     {
//       href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
//       label: 'Facebook',
//       icon: (
//         <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//       ),
//     },
//     {
//       href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
//       label: 'Twitter',
//       icon: (
//         <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
//       ),
//     },
//     {
//       href: `https://www.instagram.com/`, // Instagram nu are link direct de share
//       label: 'Instagram',
//       icon: (
//         <>
//           <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
//           <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//           <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
//         </>
//       ),
//     },
//     {
//       href: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`,
//       label: 'LinkedIn',
//       icon: (
//         <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
//       ),
//     },
//   ];

//   return (
//     <div className="p-4 border rounded-xl bg-white dark:bg-black text-black dark:text-white">
//       <p className="mb-4">
//         Aceasta este o postare interesantă pe care vrei să o distribui!
//       </p>

//       <div className="flex gap-2">
//         {links.map((link, idx) => (
//           <button
//             key={idx}
//             onClick={() => window.open(link.href, '_blank')}
//             className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
//             aria-label={link.label}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               {link.icon}
//             </svg>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
