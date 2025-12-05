import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlayCircle, Lock, BadgeInfo } from "lucide-react";
import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";

import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetCourseDetailsWithStatusQuery(courseId);

  console.log("🔥 Full Course Details Response:", data);

  if (isLoading) return <h1 className="text-center mt-10">Loading...</h1>;
  if (isError)
    return (
      <h1 className="text-center mt-10 text-red-500">
        Failed to load course details.
      </h1>
    );

  const course = data?.course;
  const purchased = data?.purchased;

  if (!course)
    return (
      <h1 className="text-center mt-10 text-red-500">
        Course not found.
      </h1>
    );

  const lectures = course?.lectures || [];

  console.log("🎬 First Lecture Video URL:", lectures[0]?.videoUrl);

  const previewVideo = lectures[0]?.videoUrl || null;

  const handleContinueCourse = () => {
    if (purchased) navigate(`/course-progress/${courseId}`);
  };

  return (
    <motion.div
      className="mt-20 space-y-5 px-4 md:px-8"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Header */}
      <motion.div className="bg-[#2D2F31] text-white dark:bg-gray-800" variants={fadeInUp} custom={0}>
        <div className="max-w-7xl mx-auto py-8 space-y-2 p-4">
          <h1 className="font-bold text-2xl md:text-3xl">{course.courseTitle}</h1>
          <p className="text-base md:text-lg">{course.subtitle}</p>
          <p>
            Created by{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <BadgeInfo size={16} />
              <p>Last updated: {course.createdAt?.split("T")[0]}</p>
            </div>
            <p>Students enrolled: {course?.enrolledStudents?.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* LEFT */}
        <motion.div className="w-full lg:w-2/3 space-y-6" variants={fadeInUp} custom={1}>

          {/* Description */}
          <div>
            <h2 className="font-bold text-xl md:text-2xl mb-2 dark:text-white">
              Description
            </h2>
            <p
              className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </div>

          {/* Lectures */}
          <Card className="dark:bg-gray-900 dark:text-white">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {lectures.length} Lecture{lectures.length > 1 && "s"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {lectures.map((lecture, idx) => {
                
                const isUnlocked =
                  purchased || lecture.isPreviewFree === true;

                return (
                  <motion.div
                    key={lecture._id}
                    className="flex items-center justify-between p-2 rounded-md border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-800 transition"
                    variants={fadeInUp}
                    custom={1 + idx * 0.1}
                  >
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">
                        {isUnlocked ? (
                          <PlayCircle size={16} />
                        ) : (
                          <Lock size={16} />
                        )}
                      </span>

                      <p className="font-medium">{lecture.lectureTitle}</p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT */}
        <motion.div className="w-full lg:w-1/3 space-y-4" variants={fadeInUp} custom={2}>
          <Card className="dark:bg-gray-900 dark:text-white">
            <CardContent className="p-4 flex flex-col">

              {/* Video Preview */}
              <div className="w-full aspect-video rounded overflow-hidden mb-4">
                {previewVideo ? (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={previewVideo}
                    controls
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">No preview available</p>
                  </div>
                )}
              </div>

              <h1 className="text-lg font-semibold mb-1">
                 {course.courseTitle}
              </h1>

              <Separator className="my-2" />

              <h2 className="text-lg font-semibold">Course Price</h2>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ৳ {course.coursePrice}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default CourseDetails;
