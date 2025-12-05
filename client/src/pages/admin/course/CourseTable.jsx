import { Button } from '@/components/ui/button';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { useGetAllCreatorCoursesQuery } from '@/features/api/courseApi';
import { Badge } from "@/components/ui/badge";

const CourseTable = () => {
  const { data, isLoading, error } = useGetAllCreatorCoursesQuery();
  const navigate = useNavigate();

  if (isLoading) return <h1>Loading…</h1>;
  if (error) return <h1>Error loading courses.</h1>;

  const courses = data?.courses || [];

  return (
    <div className="space-y-4">
      <Button onClick={() => navigate("create")}>Add Course</Button>

      <Table>
        <TableCaption>Your created courses</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">
                  {course.courseTitle}
                </TableCell>

                <TableCell>
                  {course.coursePrice ? `$${course.coursePrice}` : "Free"}
                </TableCell>

                <TableCell>{course.category || "N/A"}</TableCell>

                <TableCell>
                  <Badge
                    variant={course.isPublished ? "default" : "secondary"}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    onClick={() => navigate(`${course._id}`)}
                    variant="outline"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Courses</TableCell>
            <TableCell className="text-right">{courses.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CourseTable;

