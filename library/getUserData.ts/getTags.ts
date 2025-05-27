import prisma from "../../lib/prisma";

const getTags = async (id: string): string[] | null => {
  try {
    const tags = await prisma.user.findFirst({
      where: {
        id
      },
      select: {
        tags: true
      }
    })
    if (tags) {
      return tags.tags;
    }
    return null;
  } catch(err) {
    console.log(err);
  }
}

export default getTags;