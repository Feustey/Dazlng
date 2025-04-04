"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface NodeSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function NodeSearchDialog({
  isOpen,
  onClose,
  onSearch,
}: NodeSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("search.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t("search.help")}</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
