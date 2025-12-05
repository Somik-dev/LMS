import React, { useState } from "react";
import SearchResult from "./SearchResult";
import Filter from "./Filter";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";

const SearchPage = () => {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
 const [selectedCategories, setselectedCategories] = useState([]);
 const [sortByPrice, setsortByPrice] = useState("");

const { data, isLoading } = useGetSearchCourseQuery({
  searchQuery: query || "",
  categories: selectedCategories,
  sortByPrice,
});

const courses = data?.courses || [];
const isEmpty = !isLoading && courses.length === 0;


  const handleFilterChange = (categories,price) => {
    setselectedCategories(categories);
    setsortByPrice(price);
  }





  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 mt-10">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Results for "{query}"
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Showing result for{" "}
          <span className="text-blue-800 dark:text-blue-400 font-semibold italic">
            {query}
          </span>
        </p>
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <Filter handleFilterChange={handleFilterChange}  />

        {/* Results Area */}
        {/* Results Area */}
        <div className="flex-1 space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            courses.map((course) => (
              <SearchResult key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 border-b border-gray-300 dark:border-gray-700 pb-6">
      {/* Image skeleton */}
      <div className="h-40 w-full md:w-64">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>

      {/* Text section */}
      <div className="flex-1 flex flex-col gap-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-24 mt-2" />
      </div>
    </div>
  );
};


const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[200px] bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <AlertCircle className="text-red-500 dark:text-red-400 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-gray-100 mb-2">
        Course Not Found
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/" className="italic">
        <Button variant="link" className="text-blue-600 dark:text-blue-400">
          Browse All Courses
        </Button>
      </Link>
    </div>
  );
};

