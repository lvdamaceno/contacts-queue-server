-- CreateTable
CREATE TABLE "contactsNumbers" (
    "id" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "contactsNumbers_pkey" PRIMARY KEY ("id")
);

