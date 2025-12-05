import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Tag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Course = ({ course }) => {
  const {
    _id,
    courseTitle,
    subtitle,
    thumbnailUrl,
    courseLevel,
    coursePrice,
    creator,
    category,
    lectures = [],
    enrolledStudents = [],
  } = course;

 

  return (
    <Card className="overflow-hidden dark:bg-gray-800 bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg">
      
      {/* 🔗 Linked Image with Hover Animation */}
      <Link to={`/course-details/${_id}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <img
            src={thumbnailUrl || 'https://placehold.co/600x200?text=No+Image'}
            alt={courseTitle}
            className="w-full h-36 object-cover"
          />
        </motion.div>
      </Link>

      <CardContent className="px-4 py-3 space-y-3">
        
        {/* 🔗 Linked Title */}
        <Link to={`/course-details/${_id}`}>
          <h1 className="hover:underline font-bold text-lg truncate">
            {courseTitle}
          </h1>
        </Link>

        {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}

        {/* Instructor and Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={creator?.avatar || ''} alt={creator?.name || 'Instructor'} />
              <AvatarFallback>
                {creator?.name ? creator.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm">{creator?.name || 'Unknown'}</h1>
          </div>
          <Badge className="bg-blue-500 text-white text-xs rounded-full">
            {courseLevel || 'Beginner'}
          </Badge>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Tag className="h-4 w-4 text-gray-400" />
          <span className="truncate">{category || 'Uncategorized'}</span>
        </div>

        {/* Lectures & Students */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{lectures.length} Lectures</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{enrolledStudents.length} Students</span>
          </div>
        </div>

       

        {/* Price & View Details */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold">
            Tk {coursePrice > 0 ? coursePrice : 'Free'}
          </span>
          <Link
            to={`/course-details/${_id}`}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Course;

