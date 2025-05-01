import Link from 'next/link';
import { notFound } from 'next/navigation';
import { executeQuery } from '@/lib/db';
import { Task } from '@/lib/db/schema';
import DeleteTaskButton from '../../../components/DeleteTaskButton';

export const dynamic = 'force-dynamic';

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const result = await executeQuery('SELECT * FROM tasks WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    notFound();
  }
  
  const task: Task = result.rows[0];
  
  // Format the date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex space-x-2">
            <Link 
              href={`/tasks/${task.id}/edit`}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Edit
            </Link>
            <DeleteTaskButton id={task.id} />
          </div>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to tasks
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-sm px-3 py-1 rounded-full ${
              task.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : task.status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              Status: {task.status.replace('_', ' ')}
            </span>
            
            <span className={`text-sm px-3 py-1 rounded-full ${
              task.priority === 'high' 
                ? 'bg-red-100 text-red-800' 
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              Priority: {task.priority}
            </span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {task.description || 'No description provided'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Created:</strong> {formatDate(task.created_at)}</p>
              <p><strong>Last Updated:</strong> {formatDate(task.updated_at)}</p>
            </div>
            <div>
              <p><strong>Due Date:</strong> {formatDate(task.due_date)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}