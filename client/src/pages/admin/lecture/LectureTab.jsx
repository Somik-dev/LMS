import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";

const MEDIA_API =
  import.meta.env.MODE === "development"
    ? "/api/v1/media" // Dev → goes through Vite proxy
    : `${import.meta.env.VITE_BACKEND_URL}/api/v1/media`; // Prod → Render backend URL

const LectureTab = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [editLecture, { isLoading, isSuccess }] = useEditLectureMutation();
  const [removeLecture, { isLoading: isRemoving }] =
    useRemoveLectureMutation();

  const { data: lectureData } = useGetLectureByIdQuery({ lectureId });
  const lecture = lectureData?.lecture;

  /* ============================================================
     UPLOAD VIDEO
  ============================================================ */
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await axios.post(
        `${MEDIA_API}/creator/upload-video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        }
      );

      if (res.data.success) {
        // Backend returns "url", NOT "videoUrl"
        setUploadVideoInfo({
          videoUrl: res.data.data.videoUrl || res.data.data.url,
          publicId: res.data.data.publicId,
        });

        toast.success("Video uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Video upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  /* ============================================================
     EDIT LECTURE
  ============================================================ */
  const editLectureHandler = async () => {
    if (!lectureTitle.trim()) return toast.error("Title is required");

    // FIX: allow update WITHOUT new upload
    if (!uploadVideoInfo?.videoUrl) {
      return toast.error("Please upload a video");
    }

    try {
      await editLecture({
        courseId,
        lectureId,
        lectureTitle,
        videoUrl: uploadVideoInfo.videoUrl,
        publicId: uploadVideoInfo.publicId,
        isPreviewFree: isFree,
      }).unwrap();
    } catch (error) {
      toast.error("Failed to update lecture",error);
    }
  };

  /* ============================================================
     REMOVE LECTURE
  ============================================================ */
  const removeLectureHandler = async () => {
    try {
      await removeLecture({ lectureId }).unwrap();
      toast.success("Lecture removed");
      navigate(`/admin/course/${courseId}/lecture`);
    } catch (error) {
      toast.error("Failed to remove lecture",error);
    }
  };

  /* ============================================================
     LOAD LECTURE DATA
  ============================================================ */
  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);

      // Pre-load existing video
      setUploadVideoInfo({
        videoUrl: lecture.videoUrl,
        publicId: lecture.publicId,
      });
    }
  }, [lecture]);

  useEffect(() => {
    if (isSuccess) toast.success("Lecture updated!");
  }, [isSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle>Edit Lecture</CardTitle>
            <CardDescription>Modify lecture details</CardDescription>
          </div>

          <Button
            variant="destructive"
            onClick={removeLectureHandler}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove Lecture"}
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>

          {/* Upload Video */}
          <div>
            <Label>Upload Video *</Label>
            <Input type="file" accept="video/*" onChange={fileChangeHandler} />

            {isUploading && (
              <>
                <Progress value={uploadProgress} className="mt-2" />
                <p className="text-sm mt-1">{uploadProgress}%</p>
              </>
            )}
          </div>

          {/* Video Preview */}
          {uploadVideoInfo?.videoUrl && (
            <video
              src={uploadVideoInfo.videoUrl}
              controls
              className="w-full rounded-lg border mt-3"
            />
          )}

          {/* Free Preview */}
          <div className="flex items-center gap-2">
            <Switch checked={isFree} onCheckedChange={setIsFree} />
            <Label>Is this video free preview?</Label>
          </div>

          {/* Update */}
          <Button
            className="w-full sm:w-auto"
            disabled={isLoading || isUploading}
            onClick={editLectureHandler}
          >
            {isLoading ? "Updating..." : "Update Lecture"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LectureTab;
