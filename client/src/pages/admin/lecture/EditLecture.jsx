import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import LectureTab from './LectureTab'
import { motion } from 'framer-motion'

const EditLecture = () => {
  const { courseId } = useParams()

  return (
    <motion.section
      className="space-y-6 px-4 md:px-8 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.header
        className="flex flex-col sm:flex-row sm:items-center gap-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link to={`/admin/course/${courseId}/lecture`}>
          <Button size="icon" variant="outline" className="rounded-md">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="font-bold text-lg sm:text-xl">Update Your Lecture</h1>
      </motion.header>

      <LectureTab />
    </motion.section>
  )
}

export default EditLecture

