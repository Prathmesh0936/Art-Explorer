
'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface SubCategory {
  name: string;
  query: string;
}

interface MainCategory {
  name: string;
  description: string;
  subCategories: SubCategory[];
}

const mainCategoriesData: MainCategory[] = [
  {
    name: "Paintings",
    description: "Explore various painting styles, from classical masterpieces to modern abstractions.",
    subCategories: [
      { name: "Impressionism", query: "impressionism painting" },
      { name: "Portraits", query: "portrait painting" },
      { name: "Landscapes", query: "landscape painting" },
      { name: "Abstract Art", query: "abstract painting" },
      { name: "Still Life", query: "still life painting" },
    ],
  },
  {
    name: "Sculptures",
    description: "Discover art in three dimensions, crafted from diverse materials and techniques.",
    subCategories: [
      { name: "Bronze Sculptures", query: "bronze sculpture" },
      { name: "Marble Sculptures", query: "marble sculpture" },
      { name: "Modern Sculptures", query: "modern sculpture" },
      { name: "Figurative Sculptures", query: "figurative sculpture" },
      { name: "Abstract Sculptures", query: "abstract sculpture" },
    ],
  },
  {
    name: "Photography",
    description: "Journey through moments captured in time, from early photography to contemporary works.",
    subCategories: [
      { name: "Documentary Photography", query: "documentary photography" },
      { name: "Portrait Photography", query: "portrait photography" },
      { name: "Landscape Photography", query: "landscape photography" },
      { name: "Street Photography", query: "street photography" },
      { name: "Fine Art Photography", query: "fine art photography" },
    ],
  },
  {
    name: "Drawings & Prints",
    description: "Examine intricate works on paper, including sketches, etchings, and lithographs.",
    subCategories: [
      { name: "Charcoal Drawings", query: "charcoal drawing" },
      { name: "Pen and Ink", query: "pen ink drawing" },
      { name: "Lithographs", query: "lithograph print" },
      { name: "Etchings", query: "etching print" },
      { name: "Woodcuts", query: "woodcut print" },
    ],
  },
  {
    name: "Textiles & Fabrics",
    description: "Delve into the world of woven, embroidered, and printed fabric art.",
    subCategories:
      [
        { name: "Tapestries", query: "tapestry textile" },
        { name: "Quilts", query: "quilt textile" },
        { name: "Embroidered Art", query: "embroidery textile art" },
        { name: "Printed Fabrics", query: "printed fabric design" },
        { name: "Costumes & Apparel", query: "historic costume" },
      ]
  }
];

export function InteractiveCategoryList() {
  return (
    <Accordion type="multiple" className="w-full">
      {mainCategoriesData.map((category, index) => (
        <AccordionItem value={`item-${index}`} key={category.name} className="border-b border-border last:border-b-0">
          <AccordionTrigger className="py-4 px-2 text-lg font-semibold hover:bg-secondary/50 rounded-md hover:no-underline data-[state=open]:bg-secondary/70 data-[state=open]:text-primary">
            {category.name}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 px-2 bg-background rounded-b-md">
            <p className="text-muted-foreground mb-4 text-sm">{category.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {category.subCategories.map((subCat) => (
                <Button
                  key={subCat.name}
                  variant="ghost"
                  className="justify-start text-left h-auto py-2 px-3 hover:bg-accent/50 hover:text-accent-foreground"
                  asChild
                >
                  <Link href={`/?q=${encodeURIComponent(subCat.query)}#explore-collection`}>
                    <ChevronRight className="mr-2 h-4 w-4 text-primary/70" />
                    {subCat.name}
                  </Link>
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
