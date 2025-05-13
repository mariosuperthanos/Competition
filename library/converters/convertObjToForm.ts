const convertObjToForm = (obj: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (key === "file" && value) {
      Array.from(value as FileList).forEach((file) => {
        formData.append(key, file);
      });
    } else if (key === "tags" && Array.isArray(value)) {
      value.forEach((tag) => {
        formData.append("tags[]", String(tag));
      });
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

export default convertObjToForm;
