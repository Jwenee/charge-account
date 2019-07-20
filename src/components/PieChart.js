import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const CustomPieChart = ({title, categoryData}) => {
  if (categoryData.length === 0) {
    return <h3 className="text-center mx-3">{title}还没有任何数据</h3>
  }
  return (
    <div className="pie-chart-component">
      <h3 className="text-center mt-3">{title}</h3>
      <ResponsiveContainer width={'100%'} height={300}>
        <PieChart>
          <Pie dataKey="value" isAnimationActive={false} data={categoryData} cx={'50%'} cy={'50%'} outerRadius={100} fill="#8884d8" label >
          {
            categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

CustomPieChart.propTypes = {
  title: PropTypes.string.isRequired,
  categoryData: PropTypes.array.isRequired
}

export default CustomPieChart;