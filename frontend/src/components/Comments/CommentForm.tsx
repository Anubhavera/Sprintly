/**
 * Comment Form component
 */

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_TASK_COMMENT } from '../../graphql/mutations';
import { Button } from '../UI/Button';

interface CommentFormProps {
  taskId: string;
  onSuccess: () => void;
}

export function CommentForm({ taskId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  const [addComment, { loading }] = useMutation(ADD_TASK_COMMENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorEmail.trim()) return;

    await addComment({
      variables: {
        taskId,
        content: content.trim(),
        authorEmail: authorEmail.trim(),
      },
    });

    setContent('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={authorEmail}
        onChange={(e) => setAuthorEmail(e.target.value)}
        placeholder="Your email"
        className="input-field text-sm py-2"
        required
      />
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
          className="input-field flex-1 text-sm py-2 resize-none"
          required
        />
        <Button type="submit" size="sm" isLoading={loading}>
          Post
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
