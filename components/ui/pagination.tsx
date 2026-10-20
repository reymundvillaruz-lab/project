"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  itemName?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  itemName = "records",
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, safePage * pageSize);

  // Generate page numbers to display (compact window around current page)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (safePage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safePage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePrev = () => {
    if (safePage > 1) {
      onPageChange(safePage - 1);
    }
  };

  const handleNext = () => {
    if (safePage < totalPages) {
      onPageChange(safePage + 1);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-3 px-3 sm:px-4 bg-slate-50/80 border-t border-slate-200 rounded-b-md sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 select-none",
        className
      )}
    >
      {/* Summary label */}
      <div className="flex items-center gap-2 text-slate-500">
        <span>
          Showing <strong className="font-semibold text-slate-900">{startItem}</strong> to{" "}
          <strong className="font-semibold text-slate-900">{endItem}</strong> of{" "}
          <strong className="font-semibold text-slate-900">{totalItems}</strong> {itemName}
        </span>
        {totalPages > 1 && (
          <span className="hidden md:inline-block text-slate-400">
            &bull; (10 per page)
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        {/* First Page button (desktop) */}
        {totalPages > 3 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={safePage === 1}
            className="h-8 w-8 p-0 hidden sm:flex text-slate-600 hover:text-slate-900"
            title="First Page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={safePage <= 1}
          className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 disabled:opacity-40"
          title="Previous Page"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
          Prev
        </Button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 font-bold">
                  ...
                </span>
              );
            }
            const isCurrent = p === safePage;
            return (
              <Button
                key={`page-${p}`}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(p as number)}
                className={cn(
                  "h-8 min-w-[32px] px-2 text-xs font-medium",
                  isCurrent
                    ? "bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs border-teal-700"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {p}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={safePage >= totalPages}
          className="h-8 px-2.5 text-xs font-medium text-teal-800 bg-white hover:bg-teal-50 border-teal-300 disabled:opacity-40 disabled:border-slate-200 disabled:text-slate-400"
          title="Next (Ready to show next set)"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>

        {/* Last Page button (desktop) */}
        {totalPages > 3 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={safePage === totalPages}
            className="h-8 w-8 p-0 hidden sm:flex text-slate-600 hover:text-slate-900"
            title="Last Page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
