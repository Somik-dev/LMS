import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

// Category list
const categories = [
  { id: "MERN Stack Development", label: "MERN Stack Development" },
  { id: "Frontend Development", label: "Frontend Development" },
  { id: "Python", label: "Python" },
  { id: "Digital Marketing", label: "Digital Marketing" },
  { id: "UX/UI Design", label: "UX/UI Design" },
  { id: "3D Animation", label: "3D Animation" },
  { id: "Video Editing", label: "Video Editing" },
];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  },
};

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 140 },
  },
};

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      handleFilterChange(updated, sortByPrice);
      return updated;
    });
  };

  const handleSortChange = (value) => {
    setSortByPrice(value);
    handleFilterChange(selectedCategories, value);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full md:w-[20%] space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        </div>

        <Select onValueChange={handleSortChange} value={sortByPrice}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </motion.div>

      <Separator />

      {/* Category Filters */}
      <motion.div variants={listVariants} initial="hidden" animate="show">
        <h1 className="font-semibold mb-2">CATEGORY</h1>

        <div className="space-y-2">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-medium leading-none"
              >
                {category.label}
              </Label>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Filter;
