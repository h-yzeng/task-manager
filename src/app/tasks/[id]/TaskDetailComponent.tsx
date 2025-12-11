import Link from "next/link";
import DeleteTaskButton from "@/components/tasks/delete-task-button";
import { Task } from "@/lib/db/schema";

interface TaskDetailComponentProps {
  task: Task;
}

export default function TaskDetailComponent({ task }: TaskDetailComponentProps) {
  const formatDate = (d: Date | null) =>
    d ? new Date(d).toLocaleString() : "Not set";

  const getTaskStatus = (): string => {
    return task.completed ? "completed" : "not_started";
  };

  const statusStyles: { [key: string]: string } = {
    completed: "bg-green-100 text-green-800 border-green-200",
    not_started: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const priorityStyles: { [key: string]: string } = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    low: "bg-green-50 text-green-700 border-green-200"
  };

  const getStatusStyle = (status: string): string => {
    return statusStyles[status] || statusStyles.not_started;
  };

  const getPriorityStyle = (priority: string): string => {
    return priorityStyles[priority] || priorityStyles.low;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Back navigation */}
      <Link 
        href="/" 
        className="inline-flex items-center mb-8 px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to tasks</span>
      </Link>
      
      {/* Card container */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <div className="flex gap-3">
              <Link
                href={`/tasks/${task.id}/edit`}
                className="flex items-center justify-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <DeleteTaskButton id={task.id} />
            </div>
          </div>
        </div>
        
        {/* Status and priority badges */}
        <div className="flex flex-wrap gap-3 px-8 py-4 bg-gray-50 border-b border-gray-200">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusStyle(getTaskStatus())}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${getTaskStatus() === "completed" ? "bg-green-500" : "bg-gray-500"}`}></span>
            {getTaskStatus().replace("_", " ")}
          </span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getPriorityStyle(task.priority)}`}>
            {task.priority === "high" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
            {task.priority === "medium" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            )}
            {task.priority === "low" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {task.priority} priority
          </span>
        </div>
        
        {/* Content area */}
        <div className="p-8 space-y-8">
          {/* Description section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <div className="bg-blue-100 p-1.5 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              Description
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
              <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                {task.description || "No description provided."}
              </p>
            </div>
          </div>
          
          {/* Dates information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <div className="bg-blue-100 p-1.5 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Important Dates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-red-50 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Due Date</span>
                </div>
                <span className="font-medium text-lg text-gray-900">
                  {formatDate(task.dueDate)}
                </span>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-green-50 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Created</span>
                </div>
                <span className="font-medium text-lg text-gray-900">
                  {formatDate(task.createdAt)}
                </span>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-50 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Last Updated</span>
                </div>
                <span className="font-medium text-lg text-gray-900">
                  {formatDate(task.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Back to task list
          </Link>
          <div className="flex gap-3">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 bg-white text-sm font-medium rounded-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}