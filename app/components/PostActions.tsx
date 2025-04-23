'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

type ActionState = {
  error?: string;
  success?: boolean;
};

const initialState: ActionState = {};

// Button component with loading state
function SubmitButton({ children, className }: { children: React.ReactNode; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
    >
      {pending ? 'Loading...' : children}
    </button>
  );
}

export function PostActions({
  publishAction,
  deleteAction,
}: {
  publishAction?: () => Promise<ActionState>;
  deleteAction: () => Promise<ActionState>;
}) {
  const [publishState, publishPost] = useActionState(publishAction || (() => Promise.resolve(initialState)), initialState);
  const [deleteState, deletePost] = useActionState(deleteAction, initialState);

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Error messages */}
      {(publishState.error || deleteState.error) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{publishState.error || deleteState.error}</span>
        </div>
      )}

      <div className="flex gap-4">
        {/* Publish Button */}
        {publishAction && (
          <form action={publishPost}>
            <SubmitButton className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
              Publish Post
            </SubmitButton>
          </form>
        )}
        {/* Delete Button */}
        <form action={deletePost}>
          <SubmitButton className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
            Delete Post
          </SubmitButton>
        </form>
      </div>
    </div>
  );
} 