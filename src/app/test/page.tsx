import { useRef } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import dayjs from "dayjs"
import Image from "next/image"

// Assuming these functions and variables are defined elsewhere in your code
const onSubmit = (data) => console.log(data)
const form = { handleSubmit: () => { }, control: {}, formState: { errors: {} }, setError: () => { } }
const validate = async (value, type) => true
const firstTime = false
const firstTimeCity = false
const lat = 0
const lng = 0
const updateUIonClick = () => { }

const MapComponent = ({ lat, lng, shouldRender, settings }) => {
  return shouldRender ? (
    <div className="w-full h-40 bg-gray-200 rounded-lg my-4 overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center text-gray-500">Interactive Map Component</div>
    </div>
  ) : null
}

function CreativeForm() {
  const countryDebounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cityDebounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <div className="min-h-screen flex justify-center items-center relative bg-black">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Background" fill className="object-cover" priority />
      </div>

      {/* Content container with glass effect */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Form title and description */}
          <div className="flex flex-col justify-center">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white">
              <h1 className="text-3xl font-bold mb-4">Event Details</h1>
              <p className="text-gray-200 mb-6">
                Fill in the information about your upcoming event. Be sure to include all relevant details to help
                attendees find and enjoy your event.
              </p>
              <div className="border-t border-white/20 pt-6 mt-6">
                <h3 className="text-xl font-semibold mb-3">Why add an event?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-white">•</span>
                    Increase visibility in your community
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-white">•</span>
                    Connect with like-minded individuals
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-white">•</span>
                    Build your network and grow your audience
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="space-y-4">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Title</FormLabel>
                        <FormControl>
                          <Input
                            className="border-2 border-gray-200 focus:border-black transition-colors"
                            placeholder="Enter title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Description</FormLabel>
                        <FormControl>
                          <Input
                            className="border-2 border-gray-200 focus:border-black transition-colors"
                            placeholder="Enter description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date and Time Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Date Field */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-medium">Date</FormLabel>
                          <FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                  value={field.value ? dayjs(field.value) : null}
                                  onChange={(newValue) => {
                                    const dateValue = newValue ? newValue.toDate() : null
                                    field.onChange(dateValue)
                                  }}
                                  slotProps={{
                                    textField: {
                                      className: "w-full",
                                      error: !!form.formState.errors.date,
                                      helperText: form.formState.errors.date?.message,
                                    },
                                  }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time Section */}
                    <div className="space-y-4">
                      {/* Start Hour Field */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <FormField
                          control={form.control}
                          name="startHour"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-medium">Start Time</FormLabel>
                              <FormControl>
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
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>

                  {/* Finish Hour Field */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormField
                      control={form.control}
                      name="finishHour"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-medium">End Time</FormLabel>
                          <FormControl>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </LocalizationProvider>

                  {/* Location Section */}
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <h3 className="font-semibold">Location Details</h3>

                    {/* Country Field */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className="font-medium">Country</FormLabel>
                            <FormControl>
                              <Input
                                className="border-2 border-gray-200 focus:border-black transition-colors"
                                placeholder="Enter country"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)

                                  if (countryDebounceTimeout.current) {
                                    clearTimeout(countryDebounceTimeout.current)
                                  }

                                  countryDebounceTimeout.current = setTimeout(async () => {
                                    if (e.target.value.trim() === "") {
                                      form.setError("country", {
                                        type: "manual",
                                        message: "This field is required",
                                      })
                                      return
                                    }
                                    console.log(e..target.value)
                                  }, 500)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    {/* City Field */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className="font-medium">City</FormLabel>
                            <FormControl>
                              <Input
                                className="border-2 border-gray-200 focus:border-black transition-colors"
                                placeholder="Enter city"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)

                                  if (cityDebounceTimeout.current) {
                                    clearTimeout(cityDebounceTimeout.current)
                                  }

                                  cityDebounceTimeout.current = setTimeout(async () => {
                                    if (e.target.value.trim() === "") {
                                      form.setError("city", {
                                        type: "manual",
                                        message: "This field is required",
                                      })
                                      return
                                    }
                                    console.log(e.target.value)
                                  }, 500)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                </div>

                {/* Map */}
                <MapComponent lat={lat} lng={lng} shouldRender={firstTime && !firstTimeCity} settings={settings} />

                <div className="flex justify-end pt-8">
                  <Button
                    className="w-full md:w-auto text-sm bg-green-600 hover:bg-green-700 border-none"
                    disabled={false}
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return <CreativeForm />
}
