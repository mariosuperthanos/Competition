const getData = async (req: Request) => {
  // Parse the FormData instead of using req.json()
  const formData = await req.formData();

  return {
    // Extract form fields
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    date: formData.get("date") as string,
    startHour: formData.get("startHour") as string,
    finishHour: formData.get("finishHour") as string,
    country: formData.get("country") as string,
    city: formData.get("city") as string,
    lat: parseFloat(formData.get("lat") as string),
    lng: parseFloat(formData.get("lng") as string),
    file: formData.get("file") as File | null,
    timezone: formData.get("timezone") as string,
    hostName: formData.get("hostName") as string,
    tags: formData.getAll("tags[]") as string[]
  };
};

export default getData;
