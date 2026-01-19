/* eslint-disable @typescript-eslint/no-explicit-any */
import visaFormSchema from "@/data/visa_form_schema.json";

export type VisaField = {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  conditional?: string;
  conditionalValues?: string[];
};

export type VisaSection = {
  title: string;
  type?: "fields" | "file_upload";
  fields?: VisaField[];
  multiple?: boolean;
  description?: string;
};

export type VisaCriterion = {
  title: string;
  description: string;
  example?: string;
  supportsFolders?: boolean;
};

export type VisaSchema = {
  title: string;
  description: string;
  caseBackground: {
    sections: VisaSection[];
  };
  criteria: Record<string, VisaCriterion>;
};

export function getAllVisaTypes(): string[] {
  return Object.keys(visaFormSchema);
}

export function getVisaSchema(visaType: string): VisaSchema | null {
  const schema = (visaFormSchema as Record<string, any>)[visaType];
  return schema || null;
}

export function getVisaCriteriaList(visaType: string): { key: string; title: string }[] {
  const schema = getVisaSchema(visaType);
  if (!schema) return [];
  return Object.entries(schema.criteria).map(([key, criterion]) => ({
    key,
    title: criterion.title
  }));
}
