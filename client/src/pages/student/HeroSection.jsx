import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== "") {
      navigate(`/course/search?query=${encodeURIComponent(trimmedQuery)}`);
      setsearchQuery("");
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.h1
          className="text-white text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Find the Best Courses for You
        </motion.h1>

        <motion.p
          className="text-gray-200 dark:text-gray-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Discover, Learn and Upskill with our range of Success
        </motion.p>

        <motion.form
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onSubmit={searchHandler}
        >
          <Input
            type="text"
            placeholder="Search Courses"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 hover:dark:bg-blue-800"
          >
            Search
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button onClick={()=>navigate(`/course/search?query`)} className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200 hover:dark:bg-white">
            Explore Courses
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;

