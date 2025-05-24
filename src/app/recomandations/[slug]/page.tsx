import { cookies } from 'next/headers';
import prisma from '../../../../lib/prisma';
import defaultData from '../../../../library/searchEvents/defaultData';
import HomePage from '../../../../components/home/HomePage';
import checkJWT from '../../../../library/create-eventAPI/checkJWT';
import getTags from '../../../../library/getUserData.ts/getTags';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let userId: string | undefined;
  let tags: any;
  try {
    userId = await checkJWT();
    tags = await getTags(userId);
  } catch (err) {
    return redirect("/auth/login");
  }

  const { slug } = await params;
  const { events } = await defaultData([slug]);

  const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HomePage categories={tags} events={events} defaultTag={capitalized} />
    </div>
  );
}