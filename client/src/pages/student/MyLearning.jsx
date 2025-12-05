'use client';

import React from "react";
import Course from "./Course";
import { motion } from "framer-motion";
import { useLoadUserQuery } from "@/features/api/authApi";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const MyLearning = () => {
  const {data,isLoading} = useLoadUserQuery();
  const myLearning = data?.user.enrolledCourses || [];


  return (
    <div className="max-w-4xl mx-auto my-24 px-4 md:px-0">
      <h1 className="font-bold text-2xl mb-5">MY LEARNING</h1>

      {isLoading ? (
        <MyLearningSkeleton />
      ) : myLearning.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500"
        >
          You are not enrolled in any course.
        </motion.p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {myLearning.map((course, index) => (
            <motion.div variants={itemVariants} key={index}>
              <Course course={course} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyLearning;

// Skeleton loader
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <motion.div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      ></motion.div>
    ))}
  </div>
);
