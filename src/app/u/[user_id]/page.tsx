import type { Metadata } from "next";
import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Official Contact Page",
  description:
    "Official contact and support. Use the app or this page to get in touch.",
};

export default function OfficialContactPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  return <ContactPageContent />;
}
