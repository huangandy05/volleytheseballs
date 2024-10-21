"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Search, Users, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type FilterType = "levels" | "categories" | "tags";

interface SelectedFilters {
  levels: string[];
  categories: string[];
  tags: string[];
}

interface DrillInfo {
  id: string;
  name: string;
  description: string;
  category: string[];
  level: string;
  set_up: string;
  instructions: string;
  tags: string[];
  minimum_people: number;
  variations: string;
  image_address: string;
}

const DrillsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    levels: [],
    categories: [],
    tags: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<DrillInfo | null>(null);

  // Fetch List of Levels, Categories and Tags for filter
  const { data: filters } = useQuery({
    queryFn: async () =>
      await fetch("/api/drillFilters").then((res) => res.json()),
    queryKey: ["filters"],
    initialData: {
      levels: [],
      categories: [],
      tags: [],
    },
  });

  // Fetch List of Drills
  const {
    data: drills,
    isLoading: isDrillsLoading,
    isError: isDrillsError,
  } = useQuery({
    queryFn: async () => await fetch("/api/drills").then((res) => res.json()),
    queryKey: ["drills"],
    initialData: [],
  });

  // Filter
  const handleFilterSelect = (filterType: FilterType, value: string) => {
    setSelectedFilters((prev: SelectedFilters) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item: string) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const removeFilter = (filterType: FilterType, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].filter((item) => item !== value),
    }));
  };

  const FilterSelect: React.FC<{
    filterType: FilterType;
    placeholder: string;
  }> = ({ filterType, placeholder }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {placeholder}
            {selectedFilters[filterType].length > 0 &&
              ` (${selectedFilters[filterType].length})`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${filterType}...`} />
            <CommandEmpty>No {filterType} found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {filters[filterType].map((item: string) => (
                  <CommandItem
                    key={item}
                    onSelect={() => handleFilterSelect(filterType, item)}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "h-4 w-4 border border-primary rounded flex items-center justify-center",
                          selectedFilters[filterType].includes(item) &&
                            "bg-primary"
                        )}
                      >
                        {selectedFilters[filterType].includes(item) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span>{item}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <section className="w-full space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <FilterSelect filterType="levels" placeholder="Levels" />
        <FilterSelect filterType="categories" placeholder="Categories" />
        <FilterSelect filterType="tags" placeholder="Tags" />
      </div>

      {/* Display the selected filters */}
      {Object.entries(selectedFilters).some(
        ([, values]) => values.length > 0
      ) && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedFilters).map(([filterType, values]) =>
            values.map((value: string) => {
              const filterItems = filters[filterType];
              const filterLabel = filterItems
                ? filterItems.find((item: string) => item === value)
                : null;
              return (
                <Badge
                  key={`${filterType}-${value}`}
                  variant="secondary"
                  className="rounded-full"
                >
                  {filterLabel}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0"
                    onClick={() =>
                      removeFilter(filterType as FilterType, value)
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })
          )}
        </div>
      )}
      {/* Display Drills here */}
      <div className="grid grid-cols-1 gap-2">
        {isDrillsLoading && <div>Loading...</div>}
        {isDrillsError && <div>Error...</div>}
        {drills.map((drill: DrillInfo) => {
          // Filter drills
          if (
            !drill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (selectedFilters.levels.length > 0 &&
              !selectedFilters.levels.includes(drill.level.toLowerCase())) ||
            (selectedFilters.categories.length > 0 &&
              !drill.category.some((category) =>
                selectedFilters.categories.includes(category.toLowerCase())
              )) ||
            (selectedFilters.tags.length > 0 &&
              !drill.tags.some((tag) =>
                selectedFilters.tags.includes(tag.toLowerCase())
              ))
          ) {
            return null;
          }
          return (
            <Card
              key={drill.id}
              className="w-full p-2 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
              onClick={() => {
                setSelectedDrill(drill);
                setIsDialogOpen(true);
              }}
            >
              <div className="flex gap-2">
                <div className="flex-shrink-0">
                  <Image
                    src={drill.image_address}
                    width={150}
                    height={150}
                    alt="vb drill image"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{drill.name}</h3>
                    <div className="flex items-center">
                      <Users className="h-4 w-4" />
                      <span>{drill.minimum_people}+</span>
                      <span className="mx-1">•</span>
                      <span>{drill.level}</span>
                    </div>
                    {/* <div>{drill.description}</div> */}
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {drill.category.map((category, i) => {
                      return <Badge key={i}>{category}</Badge>;
                    })}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedDrill && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDrill.name}</DialogTitle>
                <DialogDescription>
                  {/* Description */}
                  <p>Description</p>
                  <p>{selectedDrill.description}</p>

                  {/* Image */}
                  <Image
                    src={selectedDrill.image_address}
                    width={300}
                    height={300}
                    alt="vb drill image"
                  />

                  {/* Set up */}
                  <p>Set Up</p>
                  <p>{selectedDrill.set_up}</p>

                  {/* Instructions */}
                  <p>Instructions</p>
                  <p>{selectedDrill.instructions}</p>

                  {/* Variations */}
                  <p>Variations</p>
                  <p>{selectedDrill.variations}</p>
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DrillsList;
