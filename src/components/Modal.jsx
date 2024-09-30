'use client'

import React, { useState } from 'react';
import axios from 'axios';

export default function EditPostModal({ post, onClose, onUpdate }) {
    const [content, setContent] = useState(post.content);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.patch(`/api/post/edit-delete`, {
                userId: post.userId,
                postId: post.id,
                content: content,
            });
            onUpdate(response.data.updatedPost);
            onClose();
        } catch (err) {
            console.error('Error updating post:', err);
            setError('Failed to update post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded p-6 w-80">
                <h2 className="text-xl font-bold mb-4">Edit Post</h2>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <textarea
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:underline"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-600 text-white rounded px-4 py-2"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
}
