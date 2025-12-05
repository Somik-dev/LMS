import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-3 rounded-lg my-2 shadow-sm transition-colors"
    >
      <div className="text-gray-800 dark:text-gray-200 font-semibold truncate">
        Lecture {index + 1}: {lecture.lectureTitle}
      </div>
      <button
        onClick={handleEditClick}
        aria-label={`Edit Lecture ${index + 1}`}
        className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Edit size={20} />
      </button>
    </motion.div>
  );
};

export default Lecture;

