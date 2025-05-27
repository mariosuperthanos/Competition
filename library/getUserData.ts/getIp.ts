import { headers } from 'next/headers';

const getIp = async () => {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "0.0.0.0"
  );
};

export default getIp;
