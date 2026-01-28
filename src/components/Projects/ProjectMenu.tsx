import { Trash2, Copy } from 'lucide-react';

interface ProjectMenuProps {
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function ProjectMenu({ onDuplicate, onDelete }: ProjectMenuProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project?')) {
      onDelete();
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50">
      <button
        onClick={onDuplicate}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors first:rounded-t-lg"
      >
        <Copy className="w-4 h-4" />
        Duplicate
      </button>
      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors last:rounded-b-lg"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}
