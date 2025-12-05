import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateLectureMutation, useGetCourseLectureQuery } from "@/features/api/courseApi"; // ✅ Correct hook
import Lecture from "./Lecture";

const CreateLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lectureTitle, setLectureTitle] = useState("");
  const [createLecture, { data, isLoading, error, isSuccess }] = useCreateLectureMutation();
  const {data:lectureData, isLoading:lectureLoading , error:lectureError} = useGetCourseLectureQuery(courseId);

const createLectureHandler = async () => {
  if (!lectureTitle.trim()) {
    toast.error("Lecture title cannot be empty");
    return;
  }

  try {
    await createLecture({ lectureTitle, courseId }).unwrap();
  } catch (err) {
    const errMsg =
      err?.data?.message ||
      err?.error ||
      "Failed to create lecture. Please try again.";
    toast.error(errMsg);
  }
};


  useEffect(() => {
    if (isSuccess && data?.message) {
      toast.success(data.message);
      // Optionally redirect after success
      // navigate(`/admin/course/${courseId}`);
    }

    if (error && error.data?.message) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error, data, navigate, courseId]);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-6">
        <h1 className="font-bold text-2xl mb-1">Let's Add a New Lecture</h1>
        <p className="text-sm text-muted-foreground">
          Provide some basic information to get started with your course.
        </p>
      </div>

      <div className="space-y-6">
        {/* Lecture Title */}
        <div>
          <Label htmlFor="lectureTitle" className="block mb-1 font-medium">
            Lecture Title
          </Label>
          <Input
            id="lectureTitle"
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter your lecture title"
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(`/admin/course/${courseId}`)} variant="outline">
            Back to Course
          </Button>
          <Button onClick={createLectureHandler} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>Failed to load lectures.</p>
          ) : lectureData.lectures.length === 0 ? (
            <p>No lectures availabe</p>
          ) : (
            lectureData.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
