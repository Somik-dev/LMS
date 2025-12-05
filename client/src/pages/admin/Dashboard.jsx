import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const Dashboard = () => {
  const { data,isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to get purchased courses</h1>;

  const purchasedCourses = data?.purchasedCourses || [];

  const courseData = purchasedCourses.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice,
  }));

  const totalRevenue = purchasedCourses.reduce((acc, el) => acc + (el.amount || 0), 0);
  const totalSales = purchasedCourses.length;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Summary Cards */}
      {[
        { title: 'Total Sales', value: totalSales },
        { title: 'Total Revenue', value: totalRevenue },
      ].map((item, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.03 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{item.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Line Chart Card */}
      <motion.div
        className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4"
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.01 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">
              Course Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4a90e2"
                  strokeWidth={3}
                  dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
