import React from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

const thumbVariants = {
  hover: { scale: 1.03 },
  tap: { scale: 0.99 },
};

const SearchResult = ({ course }) => {
  const {
    _id,
    courseTitle,
    subtitle,
    thumbnailUrl,
    courseLevel,
    coursePrice,
    category,
    creator,
  } = course;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b border-gray-200 dark:border-gray-700 py-6 px-2 rounded-xl transition shadow-sm hover:shadow-md dark:hover:shadow-gray-800/40"
    >
      <Link
        to={`/course-details/${_id}`}
        className="flex flex-col md:flex-row gap-4 w-full group"
      >
        {/* Thumbnail */}
        <motion.img
          src={thumbnailUrl || "https://picsum.photos/300/200"}
          alt={courseTitle}
          variants={thumbVariants}
          whileHover="hover"
          whileTap="tap"
          className="h-40 w-full md:w-64 object-cover rounded-xl shadow-md border border-gray-300 dark:border-gray-700 transition-all"
        />

        {/* Content */}
        <motion.div
          className="flex flex-col justify-between gap-2 w-full"
          variants={contentVariants}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:underline">
            {courseTitle}
          </h2>

          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {subtitle}
            </p>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Instructor:{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {creator?.name || "Unknown"}
            </span>
          </p>

          {/* Badges */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {courseLevel}
            </Badge>

            {category && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {category}
              </Badge>
            )}

            {coursePrice !== undefined && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                ${coursePrice}
              </Badge>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default SearchResult;




