"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { getAllVisaTypes, getVisaSchema, type VisaSchema } from "@/services/visaSchemaService";
import { useNavigate } from "react-router-dom";

export default function ChooseVisaCategoryModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const visaTypes = getAllVisaTypes();
  const [selectedVisa, setSelectedVisa] = React.useState<string>("");
  const [schema, setSchema] = React.useState<VisaSchema | null>(null);

  const handleSelect = (value: string) => {
    setSelectedVisa(value);
    const selectedSchema = getVisaSchema(value);
    setSchema(selectedSchema);
  };

  const handleContinue = () => {
    if (selectedVisa) {
      onOpenChange(false);
      navigate(`/task-manager/new-visa?type=${selectedVisa}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose Visa Category
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Select the visa category you want to create a case for.
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Visa Type Selection */}
          <Select onValueChange={handleSelect} value={selectedVisa}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select visa category" />
            </SelectTrigger>
            <SelectContent>
              {visaTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Schema Preview */}
          {schema && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="text-base font-medium mb-1">
                  {schema.title || selectedVisa}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {schema.description ||
                    "This visa type allows you to upload evidence and background documentation based on USCIS criteria."}
                </p>

                <ScrollArea className="h-[200px] pr-3">
                  <div className="space-y-3">
                    {Object.entries(schema.criteria)
                      .slice(0, 3)
                      .map(([key, criterion]) => (
                        <div
                          key={key}
                          className="border rounded-md p-3 px-3 bg-muted/40"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {criterion.title}
                            </p>
                            <Badge variant="outline">Criterion</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {criterion.description}
                          </p>
                        </div>
                      ))}
                    {Object.keys(schema.criteria).length > 3 && (
                      <p className="text-xs text-muted-foreground italic mt-2">
                        + {Object.keys(schema.criteria).length - 3} more criteria available
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedVisa}
            onClick={handleContinue}
            className="gap-1"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
