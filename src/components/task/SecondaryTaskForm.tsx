import React from 'react'

type Props = {}

const SecondaryTaskForm = (props: Props) => {
//     <div className='flex items-center gap-2 w-full'>
//     {Object.keys(task)
//             .filter(
//                 (col) =>
//                     col !== "id" &&
//                     col !== "pending" &&
//                     col !== "projectId" &&
//                     getTaskConfig(col).type === "select",
//             )
//             .map((col) => {
//                 const config = buildDynamicOptions(
//                     getTaskConfig(col),
//                     col,
//                     assignees,
//                 );
//                 if (config.type === "select")
//                     return (
//                         <DataCellSelect
//                             config={config}
//                             col={col as keyof NewTask}
//                             form={form}
//                             onSubmit={handleSubmit}
//                             isNew={true}
//                         />
//                     );
//             })}
// </div>
  return (
    <div>SecondaryTaskForm</div>
  )
}

export default SecondaryTaskForm