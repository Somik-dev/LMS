import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';
import { useGetPublishedCourseQuery } from '@/features/api/courseApi';

// Smooth container animation with delayed stagger
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,     // Each child appears 0.15s apart
      delayChildren: 0.3,        // Delay before first child animates
      ease: "easeInOut",         // Ease in and out for smoother flow
    },
  },
};


// Spring-based individual item animation
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",            // Uses spring motion (natural bounce)
      stiffness: 100,            // How tight the spring is (higher = faster return)
      damping: 15,               // How much resistance there is
      mass: 0.5,                 // Affects spring weight/speed
      duration: 0.4,             // Optional fallback duration
    },
  },
};


// Main Component
const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();
  const courses = data?.courses || [];

  if (isError) {
    return (
      <div className="text-center text-red-500 text-lg py-10">
        Some error occurred while fetching courses.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-bold text-3xl text-center mb-10"
        >
          Our Courses
        </motion.h2>

        {/* Courses Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isLoading ? (
            // Skeletons while loading
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <CourseSkeleton />
              </motion.div>
            ))
          ) : courses.length > 0 ? (
            // Render each course card
            courses.map((course) => (
              <motion.div
                key={course._id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Course course={course} />
              </motion.div>
            ))
          ) : (
            // No courses found
            <motion.p
              variants={itemVariants}
              className="col-span-full text-center text-gray-500"
            >
              No published courses found.
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;

// ───────────────────────── Skeleton Loader ─────────────────────────
const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
