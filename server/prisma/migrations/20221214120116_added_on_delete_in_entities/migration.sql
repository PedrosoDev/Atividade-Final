-- DropForeignKey
ALTER TABLE "ClassOnUsers" DROP CONSTRAINT "ClassOnUsers_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassOnUsers" DROP CONSTRAINT "ClassOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_classId_fkey";

-- AddForeignKey
ALTER TABLE "ClassOnUsers" ADD CONSTRAINT "ClassOnUsers_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOnUsers" ADD CONSTRAINT "ClassOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
