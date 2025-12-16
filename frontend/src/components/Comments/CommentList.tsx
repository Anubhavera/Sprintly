/**
 * Comment List component
 */

import { motion } from 'framer-motion';
import { useMutation } from '@apollo/client/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { DELETE_TASK_COMMENT } from '../../graphql/mutations';
import type { TaskComment } from '../../types';

interface CommentListProps {
  comments: TaskComment[];
  onUpdate: () => void;
}

export function CommentList({ comments, onUpdate }: CommentListProps) {
  const [deleteComment] = useMutation(DELETE_TASK_COMMENT);

  const handleDelete = async (id: string) => {
    await deleteComment({ variables: { id } });
    onUpdate();
  };

  if (comments.length === 0) {
    return (
      <p className="text-slate-500 text-sm text-center py-4">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-slate-50 border border-slate-100 rounded-xl p-4 group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                {comment.authorEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {comment.authorEmail}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(comment.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-700 text-sm pl-10 leading-relaxed">{comment.content}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default CommentList;
