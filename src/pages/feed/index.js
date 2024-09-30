"use client";
import { FeedUserCard } from "@/components/Card"
import axios from "axios"
import { useState, useEffect } from "react"
import MainHeader from "../MainHeader"

export default function Index() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post/feed")
        setPosts(response.data.posts)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setError("Failed to load posts.")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <section className="flex justify-center items-center lg:h-screen h-[90vh] ">
        <div className="loader"></div>
      </section>
    )
  }
  if (error) return <p>{error}</p>

  return (
    <>
      <div >
        <MainHeader />
        <h1>Posts</h1>
        <ul className="nav-wrapper mt-28">
          {posts.map((post) => (
            <FeedUserCard key={post.id} post={post} />
          ))}
        </ul>
      </div>
    </>
  )
}
