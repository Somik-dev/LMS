import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, CirclePlay } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Video from "@/components/Video";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useIncompleteCourseMutation,
  useResetCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";

const CourseProgress = () => {
  const { courseId } = useParams();
  const { data, isLoading, isError } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse] = useCompleteCourseMutation();
  const [incompleteCourse] = useIncompleteCourseMutation();
  const [resetCourse] = useResetCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data?.data) return <p>Failed to load course details</p>;

  const { courseDetails = {}, progress = []} = data.data;

  const { lectures = [], courseTitle = "Untitled Course" } = courseDetails;
  const activeLecture = currentLecture || lectures[0] || {};
  const activeLectureId = activeLecture?._id;

  const handleSelectLecture = (lecture) => setCurrentLecture(lecture);

  const handleLectureProgress = async (lectureId) => {
    try {
      await updateLectureProgress({ courseId, lectureId });
    } catch {
      toast.error("Error updating lecture progress");
    }
  };

  const handleCompleteCourse = async () => {
    try {
      await completeCourse({ courseId }).unwrap();
      toast.success("Course marked as completed!");
    } catch {
      toast.error("Failed to complete course");
    }
  };

  const handleIncompleteCourse = async () => {
    try {
      await incompleteCourse({ courseId }).unwrap();
      toast.success("Course marked as incomplete!");
    } catch {
      toast.error("Failed to mark course incomplete");
    }
  };

  const handleResetCourse = async () => {
    try {
      await resetCourse({ courseId }).unwrap();
      toast.success("Course progress has been reset");
    } catch {
      toast.error("Reset failed");
    }
  };

  const isLectureCompleted = (id) =>
    progress.some((p) => p.lectureId === id && p.viewed);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8 mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold text-gray-800">{courseTitle}</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCompleteCourse}>Mark as Completed</Button>
          <Button onClick={handleIncompleteCourse} variant="secondary">
            Mark as Incomplete
          </Button>
          <Button onClick={handleResetCourse} variant="destructive">
            Reset Progress
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Section */}
        <motion.div
          className="w-full md:w-3/5 bg-white rounded-2xl shadow-lg p-6 border"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
            <Video
              src={activeLecture?.videoUrl}
              onPlay={() => handleLectureProgress(activeLectureId)}
            />
          </div>

          <h3 className="mt-5 text-xl font-semibold text-gray-800">
            Lecture{" "}
            {lectures.findIndex((lec) => lec._id === activeLectureId) + 1}:{" "}
            {activeLecture?.lectureTitle}
          </h3>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="w-full md:w-2/5 bg-white rounded-2xl shadow-md p-6 border"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-medium mb-4 text-gray-800">Lectures</h2>
          <ul className="space-y-3">
            {lectures.map((lecture) => {
              const completed = isLectureCompleted(lecture._id);
              return (
                <motion.li
                  key={lecture._id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    onClick={() => handleSelectLecture(lecture)}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer border transition"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        {completed ? (
                          <CheckCircle2 size={20} className="text-green-500" />
                        ) : (
                          <CirclePlay size={20} className="text-gray-400" />
                        )}
                        <CardTitle className="text-sm font-medium text-gray-800">
                          {lecture.lectureTitle}
                        </CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        } border-none text-xs px-2 py-1`}
                      >
                        {completed ? "Completed" : "Pending"}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseProgress;
