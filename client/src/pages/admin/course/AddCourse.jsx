import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";  // Toast notification import

const AddCourse = () => {
  const [courseTitle, setcourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [createCourse, { isLoading, error, isSuccess }] = useCreateCourseMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully!");
      navigate("/admin/course");
    } else if (error) {
      toast.error("Failed to create course.");
      console.error(error);
    }
  }, [isSuccess, error, navigate]);



  const createCourseHandler = async () => {
    if (!courseTitle || !category) {
      toast.warning("Please fill in all fields!");
      return;
    }
  
    try {
      await createCourse({ courseTitle, category }).unwrap();
      toast.success("Course created successfully!");
      navigate("/admin/course");
    } catch (err) {
      toast.error("Failed to create course.");
      console.error("Error:", err);
    }
  };
  

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-6">
        <h1 className="font-bold text-2xl mb-1">Add a New Course</h1>
        <p className="text-sm text-muted-foreground">
          Provide some basic information to get started with your course.
        </p>
      </div>

      <div className="space-y-6">

        {/* Course Title */}
        <div>
          <Label htmlFor="courseTitle" className="block mb-1 font-medium">
            Course Title
          </Label>
          <Input
            id="courseTitle"
            value={courseTitle}
            onChange={(e) => setcourseTitle(e.target.value)}
            type="text"
            placeholder="Enter your course title"
            className="w-full"
          />
        </div>

        {/* Category Selection */}
        <div>
          <Label htmlFor="courseCategory" className="block mb-1 font-medium">
            Category
          </Label>
          <Select onValueChange={getSelectedCategory}>
           <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Fullstack Development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="MERN Stack Development">
                  MERN Stack Development
                </SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                <SelectItem value="UX/UI Design">UX/UI Design</SelectItem>
                <SelectItem value="3D Animation">3D Animation</SelectItem>
                <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                <SelectItem value="Video Editing">Video Editing</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(`/admin/course`)} variant="outline">Back</Button>
          <Button onClick={createCourseHandler} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
