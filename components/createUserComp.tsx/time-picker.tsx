"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"


function TimePicker({ value, onChange }) {
  const [hour, setHour] = useState<string>("12");
  const [minute, setMinute] = useState<string>("00");
  const [isPM, setIsPM] = useState<boolean>(false);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  const handleTimeChange = (newHour, newMinute, newIsPM) => {
    const timeString = `${newHour}:${newMinute} ${newIsPM ? "PM" : "AM"}`;
    onChange(timeString);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={hour}
        onValueChange={(newHour) => {
          setHour(newHour);
          handleTimeChange(newHour, minute, isPM);
        }}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-2xl">:</span>
      <Select
        value={minute}
        onValueChange={(newMinute) => {
          setMinute(newMinute);
          handleTimeChange(hour, newMinute, isPM);
        }}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Toggle
        pressed={isPM}
        onPressedChange={(newIsPM) => {
          setIsPM(newIsPM);
          handleTimeChange(hour, minute, newIsPM);
        }}
        aria-label="Toggle AM/PM"
        className="w-[70px]"
      >
        {isPM ? "PM" : "AM"}
      </Toggle>
    </div>
  );
}

export default TimePicker;