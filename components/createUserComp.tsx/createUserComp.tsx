"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, ClockIcon, ImageIcon, TagIcon, GlobeIcon, BuildingIcon } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import axios from "axios"
import removeDiacritics from "../../library/converters/removeDiacritics"
import MapComponent from "../event/Map"
import "mapbox-gl/dist/mapbox-gl.css"
import { formSchema } from "../../library/schemas/create-event"
import { getCsrfToken, useSession } from "next-auth/react"
import formatData from "../../library/converters/formatData"
import convertObjToForm from "../../library/converters/convertObjToForm"
import getTimeZone from "../../library/converters/getTimeZone"
import { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker"
import getLocation from "../../library/map/getLocation"
import TagSelector from "../testFolder/tagsSelector"
import slugify from "slugify"

const interestTags = [
  "Cycling",
  "Music",
  "Reading",
  "Fitness",
  "Art",
  "Networking",
  "Technology",
  "Gaming",
  "Photography",
  "Cooking",
  "Volunteering",
  "Dance",
  "Outdoor",
  "Startup",
  "Workshop",
  "Meditation",
  "Hiking",
  "Coding",
  "Film",
  "Theater",
  "Language Exchange",
  "Travel",
  "Food Tasting",
  "Debate",
]

let firstTime = true
let firstTimeCity = true

const CreateUserComp = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { data: session } = useSession()
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      startHour: "",
      finishHour: "",
      country: "",
      city: "",
      map: false,
      lat: "",
      lng: "",
      timezone: "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      console.log(data)
      const valuesCopy = { ...data }
      const formattedStartH = formatData(data.date.toString(), valuesCopy.startHour)
      const formattedEndH = formatData(data.date.toString(), valuesCopy.finishHour)

      const timezone = await getTimeZone(Number.parseFloat(data.lat), Number.parseFloat(data.lng))
      const { country, city } = await getLocation(Number.parseFloat(data.lat), Number.parseFloat(data.lng))
      const csrfToken = await getCsrfToken()
      console.log("csrfToken", csrfToken)

      valuesCopy.country = removeDiacritics(country)
      valuesCopy.city = removeDiacritics(city)
      valuesCopy.startHour = formattedStartH
      valuesCopy.finishHour = formattedEndH
      valuesCopy.timezone = timezone
      const hostName = session?.user?.name
      valuesCopy.hostName = hostName
      console.log("valuesCopy", session)
      valuesCopy.tags = selectedTags
      console.log("valuesCopy", valuesCopy)
      const slug = slugify(data.title, { lower: true, strict: true })
      const slugHref = `/events/${slug}`
      const userId = session.token.id

      const formData = convertObjToForm(valuesCopy)
      console.log("13131", formData)

      const response = await axios.post(`${window.location.origin}/api/createEvent`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "csrf-token": csrfToken,
        },
        withCredentials: true,
      })
      const eventId = response.data.data.id
      console.log("eventId", eventId)
      const changeButtonState = await axios.post(
        `${window.location.origin}/api/buttonState`,
        { userId, eventId, buttonState: "host" },
        {
          headers: {
            "Content-Type": "application/json",
            "csrf-token": csrfToken,
          },
          withCredentials: true,
        },
      )
      console.log(response.data)
      return slugHref
    },
    onError: (error) => {
      console.error("There was an error from the server")
    },
    onSuccess: (slugHref) => {
      console.log("The event was created successfully!")
      setTimeout(() => {
        window.location.href = slugHref
      }, 1000)
    },
  })

  const updateUIonClick = (city: string, country: string, lat: string, lng: string) => {
    console.log(city, country)
    if (city !== undefined) {
      form.setValue("city", removeDiacritics(city))
      form.clearErrors(`city`)
      form.setValue("map", true)
      form.setValue("lat", lat.toString())
      form.setValue("lng", lng.toString())
    }
    form.setValue("country", removeDiacritics(country))
    form.clearErrors(`country`)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values)
    mutation.mutate(values)
  }

  const validate = async (value: string, mode: "country" | "city") => {
    try {
      const REQ_URL =
        mode === "country"
          ? `https://api.opencagedata.com/geocode/v1/json?q=${value.trim()}&key=1815f05342614d459cd09ea741dcfc58&language=en`
          : `https://api.opencagedata.com/geocode/v1/json?q=${value.trim()},${form.getValues("country")}&key=1815f05342614d459cd09ea741dcfc58&language=en`

      const req = await axios.get(REQ_URL)

      const components = req.data.results[0].components

      const data =
        mode === "country"
          ? components?.country
          : components?.county ||
          components?.city ||
          components?.town ||
          components?.hamlet ||
          components?.suburb ||
          components?.municipality ||
          components?.locality ||
          components?.state ||
          components?.state_district ||
          components?.district ||
          components?.region
      const cleanedText = removeDiacritics(data)
      console.log(cleanedText)
      console.log(value)
      if (cleanedText.toLowerCase() === value.toLowerCase()) {
        form.setValue(mode, cleanedText)
        form.clearErrors(mode)
        if (mode === "city") {
          const lat2 = req.data?.results[1]?.geometry.lat || req.data?.results[0]?.geometry.lat
          const lng2 = req.data?.results[1]?.geometry.lng || req.data?.results[0]?.geometry.lng
          form.setValue("lat", lat2.toString())
          form.setValue("lng", lng2.toString())
          firstTimeCity = false
        }
        if (mode === "country") {
          firstTime = false
        }

        return true
      }
    } catch (err) {
      return false
    }
  }

  const lat = form.watch("lat")
  const lng = form.watch("lng")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Create Your Event
          </h1>
          <p className="text-gray-600 text-lg">Bring people together and create memorable experiences</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CalendarIcon className="h-6 w-6" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-700">Event Title</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 text-lg border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                          placeholder="What's your event called?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-700">Description</FormLabel>
                      <FormControl>
                        <textarea
                          className="w-full min-h-[100px] text-lg border-2 border-gray-200 focus:border-purple-400 rounded-xl p-3 transition-all duration-200 resize-none"
                          placeholder="Tell people what to expect..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

              </CardContent>
            </Card>

            {/* Date & Time Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ClockIcon className="h-6 w-6" />
                  When
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Date Field */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-lg font-semibold text-gray-700">Event Date</FormLabel>
                      <FormControl>
                        <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(newValue) => {
                                  const dateValue = newValue ? newValue.toDate() : null
                                  field.onChange(dateValue)
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Time Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormField
                      control={form.control}
                      name="startHour"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                          <FormLabel className="text-lg font-semibold text-gray-700">Start Time</FormLabel>
                          <FormControl>
                            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                              <DesktopTimePicker
                                value={field.value ? dayjs(field.value, "HH:mm A") : null}
                                onChange={(date) => {
                                  if (date) {
                                    const formattedTime = date.format("hh:mm A")
                                    field.onChange(formattedTime)
                                  } else {
                                    field.onChange("")
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormField
                      control={form.control}
                      name="finishHour"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                          <FormLabel className="text-lg font-semibold text-gray-700">End Time</FormLabel>
                          <FormControl>
                            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                              <DesktopTimePicker
                                value={field.value ? dayjs(field.value, "hh:mm A") : null}
                                onChange={(date) => {
                                  if (date) {
                                    const formattedTime = date.format("hh:mm A")
                                    field.onChange(formattedTime)
                                  } else {
                                    field.onChange("")
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPinIcon className="h-6 w-6" />
                  Where
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Country Field */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                          <GlobeIcon className="h-5 w-5" />
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-12 text-lg border-2 border-gray-200 focus:border-orange-400 rounded-xl transition-all duration-200"
                            placeholder="Enter country"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)

                              if (debounceTimeout.current) {
                                clearTimeout(debounceTimeout.current)
                              }

                              debounceTimeout.current = setTimeout(async () => {
                                if (e.target.value.trim() === "") {
                                  form.setError("country", {
                                    type: "manual",
                                    message: "This field is required",
                                  })
                                  return
                                }
                                console.log(e.target.value)

                                const validationResult = await validate(e.target.value, "country")
                                if (validationResult !== true) {
                                  form.setError("country", {
                                    type: "manual",
                                    message: "This country does not exist",
                                  })
                                }
                              }, 200)
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500">{form.formState.errors?.country?.message}</FormMessage>
                      </FormItem>
                    )
                  }}
                />

                {/* City Field */}
                {firstTime === false && (
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <BuildingIcon className="h-5 w-5" />
                            City
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-12 text-lg border-2 border-gray-200 focus:border-orange-400 rounded-xl transition-all duration-200"
                              placeholder="Enter city"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)

                                if (debounceTimeout.current) {
                                  clearTimeout(debounceTimeout.current)
                                }

                                debounceTimeout.current = setTimeout(async () => {
                                  if (e.target.value.trim() === "") {
                                    form.setError("city", {
                                      type: "manual",
                                      message: "This field is required",
                                    })
                                    return
                                  }
                                  console.log(e.target.value)

                                  const validationResult = await validate(e.target.value, "city")
                                  if (validationResult !== true) {
                                    form.setError("city", {
                                      type: "manual",
                                      message: "This city does not exist",
                                    })
                                  }
                                }, 200)
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500">{form.formState.errors?.city?.message}</FormMessage>
                        </FormItem>
                      )
                    }}
                  />
                )}

                {/* Map Field */}
                {!firstTimeCity && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-blue-800 font-medium flex items-center gap-2">
                        <MapPinIcon className="h-5 w-5" />
                        Click on the meetup location on the map
                      </p>
                    </div>
                    <div className="rounded-xl overflow-hidden border-4 border-gray-200 shadow-lg">
                      <MapComponent
                        key={"gagga"}
                        lat={lat}
                        lng={lng}
                        shouldRender={!firstTimeCity}
                        settings={{ purpose: "interactive", passData: updateUIonClick }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Media & Tags Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="h-6 w-6" />
                  Media & Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* File Upload Field */}
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-700">Event Image</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors duration-200">
                          <Input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            onChange={(e) => {
                              field.onChange(e.target.files)
                            }}
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 font-medium">Click to upload an image</p>
                            <p className="text-gray-400 text-sm mt-2">PNG, JPG up to 10MB</p>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Tags Field */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5 text-gray-600" />
                    <p className="text-lg font-semibold text-gray-700">Select up to 5 tags (optional)</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                    <TagSelector
                      selectedTags={selectedTags}
                      tags={interestTags}
                      onChange={setSelectedTags}
                      maxSelection={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Messages */}
            {mutation.isError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <p className="text-red-600 font-medium">There was an error from the server</p>
                </CardContent>
              </Card>
            )}

            {mutation.isSuccess && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <p className="text-green-600 font-medium">The event was created successfully!</p>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <Button
                disabled={mutation.isPending}
                type="submit"
                className="h-14 px-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Event...
                  </div>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateUserComp
