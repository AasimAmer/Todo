'use client';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
      <button
        type="button"
        className="flex items-center gap-3 flex-1 text-left"
        onClick={() => onToggle(todo)}
      >
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            todo.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
          }`}
        >
          {todo.isCompleted ? (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </span>
        <span className={todo.isCompleted ? 'text-sm text-gray-400 line-through' : 'text-sm text-gray-800'}>
          {todo.title}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onDelete(todo)}
        className="ml-4 text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
        aria-label="Delete todo"
      >
        ×
      </button>
    </div>
  );
}
