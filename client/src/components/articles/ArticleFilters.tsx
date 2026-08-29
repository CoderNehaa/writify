import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { ArticleSortBy } from "@/types/enums";

interface ArticleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: ArticleSortBy;
  onSortChange: (value: ArticleSortBy) => void;
  selectedCategory?: string;
  onCategoryChange: (value: string) => void;
}

export const ArticleFilters = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
}: ArticleFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={(value) => onSortChange(value as ArticleSortBy)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ArticleSortBy.TRENDING}>Trending</SelectItem>
            <SelectItem value={ArticleSortBy.LATEST}>Latest</SelectItem>
            <SelectItem value={ArticleSortBy.POPULAR}>Most Popular</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory || "all"} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
