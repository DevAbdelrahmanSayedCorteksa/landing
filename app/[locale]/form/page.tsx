import type { Metadata } from "next";
import { FormClient } from "./form-client";

export const metadata: Metadata = {
  title: "Request Form",
  description: "Submit a request to the Corteksa team through our form.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FormPage() {
  return <FormClient />;
}
