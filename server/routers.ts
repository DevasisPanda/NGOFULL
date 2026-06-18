import { router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { authRouter } from "./routers/auth";
import { memberRouter } from "./routers/member";
import { adminRouter } from "./routers/admin";
import { membershipRouter } from "./routers/membership";
import { donationRouter } from "./routers/donation";
import { campaignRouter } from "./routers/campaign";
import { documentRouter } from "./routers/document";
import { messageRouter } from "./routers/message";
import { internshipRouter } from "./routers/internship";
import { eventRouter } from "./routers/event";
import { enquiryRouter } from "./routers/enquiry";
import { projectRouter } from "./routers/project";
import { uploadRouter } from "./routers/upload";
import { beneficiaryRouter } from "./routers/beneficiary";
import { galleryRouter } from "./routers/gallery";
import { homepageRouter } from "./routers/homepage";
import { expenseRouter } from "./routers/expense";
import { newsRouter } from "./routers/news";
import { stubRouters } from "./routers/stubs";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  member: memberRouter,
  admin: adminRouter,
  membership: membershipRouter,
  donation: donationRouter,
  campaign: campaignRouter,
  document: documentRouter,
  message: messageRouter,
  internship: internshipRouter,
  event: eventRouter,
  enquiry: enquiryRouter,
  project: projectRouter,
  upload: uploadRouter,
  beneficiary: beneficiaryRouter,
  gallery: galleryRouter,
  homepage: homepageRouter,
  expense: expenseRouter,
  news: newsRouter,
  ...stubRouters,
});

export type AppRouter = typeof appRouter;
