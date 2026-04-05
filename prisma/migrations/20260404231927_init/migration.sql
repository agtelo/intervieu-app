-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "userId" TEXT,
    "name" TEXT,
    "cvText" TEXT,
    "cvFileName" TEXT,
    "jdText" TEXT,
    "companyUrl" TEXT,
    "interviewerEmail" TEXT,
    "interviewerLinkedin" TEXT,
    "interviewerRole" TEXT,
    "companyData" TEXT,
    "interviewerData" TEXT,
    "briefing" TEXT,
    "fitScore" INTEGER,
    "chatMessages" TEXT,
    "simulacroScore" TEXT,
    "simulacroStatus" TEXT DEFAULT 'pending'
);
