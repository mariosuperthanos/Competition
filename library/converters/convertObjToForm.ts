const convertObjToForm = (obj: object) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (key === "file" && value) {
      Array.from(value as FileList).forEach((file) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, String(value)); // Handles boolean, numbers, etc.
    }
  });

  return formData;
};
export default convertObjToForm;
