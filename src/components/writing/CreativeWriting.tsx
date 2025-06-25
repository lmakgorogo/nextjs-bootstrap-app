"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { saveCreativeWritingEntry, fetchTopicOfTheDay } from "@/lib/firestore"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function CreativeWriting() {
  const [selectedTopic, setSelectedTopic] = useState<{topic: string; description: string; image: string} | null>(null)
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [feedback, setFeedback] = useState<{type: "success" | "error", message: string} | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchTopicOfTheDay().then(topic => setSelectedTopic(topic))
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        setUserId(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleContentChange = (value: string) => {
    setContent(value)
    setWordCount(value.trim().split(/\s+/).filter(word => word.length > 0).length)
  }

  const handleSave = async () => {
    if (!userId) {
      setFeedback({
        type: "error",
        message: "User not authenticated. Please refresh or login."
      })
      return
    }
    if (content.trim().length === 0) {
      setFeedback({
        type: "error",
        message: "Please write something before saving!"
      })
      return
    }
    try {
      await saveCreativeWritingEntry(userId, {
        text: content,
        topic: selectedTopic?.topic || "",
        createdAt: new Date(),
      })
      setFeedback({
        type: "success",
        message: "Your writing has been saved! 📝"
      })
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Failed to save your writing. Please try again."
      })
    }
  }

  if (!selectedTopic) {
    return <div>Loading topic...</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 font-quicksand">Creative Writing</h2>
      </div>

      <Card className="p-6 bg-white shadow-md">
        <div className="aspect-video relative mb-6 rounded-lg overflow-hidden">
          <img 
            src={selectedTopic.image} 
            alt={selectedTopic.topic}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold mb-2 font-quicksand text-[#4A90E2]">
            {selectedTopic.topic}
          </h3>
          <p className="text-gray-600">
            {selectedTopic.description}
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Start writing your story here..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[200px] resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Words: {wordCount}
            </span>
            <Button 
              onClick={handleSave}
              className="bg-[#98CA3F] hover:bg-[#7BA832] text-white"
            >
              Save Writing
            </Button>
          </div>
        </div>
      </Card>

      {feedback && (
        <Alert variant={feedback.type === "success" ? "default" : "destructive"}>
          <AlertDescription>
            {feedback.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
