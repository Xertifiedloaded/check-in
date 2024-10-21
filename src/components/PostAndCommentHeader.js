import { MessageCircle, Share2, ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function PostHeader({ commentsCount = 0, post }) {
    const handleShare = async () => {
        const shareText = typeof post?.content === 'string' 
          ? post.content 
          : post?.content?.text || 'Check out this post'
    
        const truncatedText = shareText.length > 100 
          ? shareText.substring(0, 97) + '...' 
          : shareText
    
        try {
          if (navigator.share) {
            await navigator.share({
              title: "Daily Check-in Post",
              text: truncatedText,
              url: window.location.href,
            })
            console.log("Shared successfully!")
          } else {
            const fallbackText = `${truncatedText}\n\n${window.location.href}`
            try {
              await navigator.clipboard.writeText(fallbackText)
              alert("Link copied to clipboard!")
            } catch (err) {
              alert("Sharing is not supported in this browser.")
            }
          }
        } catch (error) {
          console.error("Error sharing:", error)
          if (error.name !== 'AbortError') {
            alert("Failed to share. You can copy the URL manually.")
          }
        }
      }
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/feed" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back to Feed</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Discussion
            </h1>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-600 text-sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>
          </div>

          {post && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Original Post</div>
              <div className="text-gray-900">
                {typeof post.content === 'string' 
                  ? post.content 
                  : post.content?.text || 'Content unavailable'}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={handleShare} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Share Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}