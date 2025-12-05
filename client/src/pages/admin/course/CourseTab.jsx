import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Button } from "@/components/ui/button";
const MotionButton = motion(Button);
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useDeleteCourseMutation,
} from "@/features/api/courseApi";

const initialInputState = {
  courseTitle: "",
  subtitle: "",
  description: "",
  category: "",
  courseLevel: "Beginner",
  coursePrice: "",
  thumbnailUrl: null,
};

const CourseTab = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const fileInputRef = useRef(null);
  const [deleteCourse] = useDeleteCourseMutation();


  const [input, setInput] = useState(initialInputState);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: input.description || "",
    onUpdate: ({ editor }) => {
      setInput((prev) => ({
        ...prev,
        description: editor.getHTML(),
      }));
    },
  });

  const { data: courseData,refetch } = useGetCourseByIdQuery(courseId, {
    skip: !courseId,
    refetchOnMountOrArgChange: true,
  });

  const [
    editCourse,
    { data: editData, isLoading: isEditing, isSuccess, error },
  ] = useEditCourseMutation();
  const [publishCourse] = usePublishCourseMutation();

  // Populate input fields with existing data
  useEffect(() => {
    const course = courseData?.course;
    if (!course) return;

    setInput({
      courseTitle: course.courseTitle || "",
      subtitle: course.subtitle || "",
      description: course.description || "",
      category: course.category || "",
      courseLevel: course.courseLevel || "Beginner",
      coursePrice: course.coursePrice?.toString() || "",
      thumbnailUrl: null,
    });

    if (course.thumbnailUrl) {
      setPreviewThumbnail(course.thumbnailUrl);
    }
  }, [courseData]);

  useEffect(() => {
    if (editor && input.description !== editor.getHTML()) {
      editor.commands.setContent(input.description || "");
    }
  }, [input.description, editor]);

  useEffect(() => {
    if (isSuccess && editData?.message) toast.success(editData.message);
    if (error) toast.error(error?.data?.message || "Failed to update course");
  }, [isSuccess, error, editData]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) =>
    setInput((prev) => ({ ...prev, category: value }));
  const handleCourseLevelChange = (value) =>
    setInput((prev) => ({ ...prev, courseLevel: value }));

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({ ...prev, thumbnailUrl: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setInput((prev) => ({ ...prev, thumbnailUrl: null }));
    setPreviewThumbnail(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const publishStatusHandler = async (shouldPublish) => {
    try {
      const response = await publishCourse({ courseId, query: shouldPublish });
      if (response.data) toast.success(response.data.message);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to change publish status");
    }
  };

  const updateCourseHandler = async () => {
    try {
      const formData = new FormData();
      [
        "courseTitle",
        "subtitle",
        "description",
        "category",
        "courseLevel",
        "coursePrice",
      ].forEach((field) => {
        if (input[field]) formData.append(field, input[field]);
      });
      if (input.thumbnailUrl instanceof File) {
        formData.append("thumbnail", input.thumbnailUrl);
      }
      await editCourse({ formData, courseId }).unwrap();
    } catch (err) {
      console.error("Course update failed:", err);
      toast.error(err?.data?.message || "Failed to update course");
    }
  };

  const handleDeleteCourse = async () => {
  const confirmDelete = window.confirm(
    "Are you sure? This will permanently delete the course and all its lectures."
  );

  if (!confirmDelete) return;

  try {
    const res = await deleteCourse({ courseId }).unwrap();

    toast.success(res.message || "Course deleted successfully");

    navigate("/admin/course");
  } catch (err) {
    console.error(err);
    toast.error(err?.data?.message || "Failed to delete course");
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="mb-1">Basic Course Information</CardTitle>
            <CardDescription>
              Make changes to your course here. Click save when you're done.
            </CardDescription>
          </div>
          <div className="space-x-2">
            <MotionButton
              disabled={courseData?.course.lectures.length === 0}
              variant="outline"
              onClick={() =>
                publishStatusHandler(
                  courseData?.course.isPublished ? "false" : "true"
                )
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {courseData?.course.isPublished ? "Unpublish" : "Publish"}
            </MotionButton>
          <Button
            variant="destructive"
            onClick={handleDeleteCourse}
          >
            Remove Course
          </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 mt-5">
            <div>
              <Label>Course Title</Label>
              <Input
                name="courseTitle"
                value={input.courseTitle}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input
                name="subtitle"
                value={input.subtitle}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Description</Label>
              <EditorContent
                editor={editor}
                className="bg-white rounded p-2 border"
              />
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <div>
                <Label>Category</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={input.category}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {[
                        "Frontend Development",
                        "Fullstack Development",
                        "MERN Stack Development",
                        "Python",
                        "Digital Marketing",
                        "UX/UI Design",
                        "3D Animation",
                        "Graphic Design",
                        "Video Editing",
                      ].map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Course Level</Label>
                <Select
                  onValueChange={handleCourseLevelChange}
                  value={input.courseLevel}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course Levels</SelectLabel>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Price (INR)</Label>
                <Input
                  type="number"
                  name="coursePrice"
                  value={input.coursePrice}
                  onChange={handleChange}
                  className="w-[120px]"
                  min={0}
                />
              </div>
            </div>

            <div>
              <Label>Course Thumbnail</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-fit"
                ref={fileInputRef}
              />
              {previewThumbnail && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-fit my-2"
                >
                  <img
                    src={previewThumbnail}
                    alt="Course Thumbnail"
                    className="w-64 rounded shadow"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    aria-label="Remove thumbnail"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/course")}
              >
                Cancel
              </Button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={isEditing}
                onClick={updateCourseHandler}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
              >
                {isEditing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Save"
                )}
              </motion.button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseTab;
