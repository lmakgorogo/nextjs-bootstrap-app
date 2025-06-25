"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function SpellingPractice() {
  const [wordList, setWordList] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [feedback, setFeedback] = useState<{type: "success" | "error", message: string} | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
        fetchWordList(user.uid)
      } else {
        setUserId(null)
        setWordList([])
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchWordList = async (uid: string) => {
    try {
      const q = query(collection(db, "word_lists"), where("userId", "==", uid))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        // For simplicity, take the first list's words
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        if (data.words && Array.isArray(data.words)) {
          setWordList(data.words)
          setCurrentWordIndex(0)
          setUserInput("")
          setFeedback(null)
        }
      } else {
        setWordList([])
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Failed to load word list."
      })
    }
  }

  const speakWord = () => {
    if (wordList.length === 0) return
    const utterance = new SpeechSynthesisUtterance(wordList[currentWordIndex])
    window.speechSynthesis.speak(utterance)
  }

  const checkSpelling = () => {
    if (wordList.length === 0) return
    if (userInput.toLowerCase() === wordList[currentWordIndex].toLowerCase()) {
      setFeedback({
        type: "success",
        message: "Correct! Well done! 🎉"
      })
    } else {
      setFeedback({
        type: "error",
        message: `Incorrect. The correct spelling is "${wordList[currentWordIndex]}"`
      })
    }
  }

  const nextWord = () => {
    if (currentWordIndex < wordList.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setUserInput("")
      setFeedback(null)
    }
  }

  const resetPractice = () => {
    setCurrentWordIndex(0)
    setUserInput("")
    setFeedback(null)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 font-quicksand">Spelling Practice</h2>
        {wordList.length === 0 && (
          <p className="text-gray-600">No word lists found. Please create a word list to start practicing.</p>
        )}
        {wordList.length > 0 && (
          <Card className="p-8 bg-white shadow-md">
            <div className="mb-6">
              <Button 
                onClick={speakWord}
                className="bg-[#4A90E2] hover:bg-[#357ABD] text-white"
              >
                Listen to Word 🔊
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Type the word you heard..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="max-w-sm mx-auto"
              />
              
              <Button 
                onClick={checkSpelling}
                className="bg-[#98CA3F] hover:bg-[#7BA832] text-white"
              >
                Check Spelling
              </Button>
            </div>

            <div className="mt-6 flex justify-between">
              <Button 
                onClick={nextWord}
                disabled={currentWordIndex >= wordList.length - 1}
                className="bg-[#FFB946] hover:bg-[#D9A32B] text-white"
              >
                Next Word
              </Button>
              <Button 
                onClick={resetPractice}
                className="bg-gray-400 hover:bg-gray-500 text-white"
              >
                Reset
              </Button>
            </div>
          </Card>
        )}
      </div>

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
        type: "success",
        message: "Correct! Well done! 🎉"
      })
    } else {
      setFeedback({
        type: "error",
        message: `Incorrect. The correct spelling is "${wordList[currentWordIndex]}"`
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 font-quicksand">Spelling Practice</h2>
        <Card className="p-8 bg-white shadow-md">
          <div className="mb-6">
            <Button 
              onClick={speakWord}
              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white"
            >
              Listen to Word 🔊
            </Button>
          </div>
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Type the word you heard..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="max-w-sm mx-auto"
            />
            
            <Button 
              onClick={checkSpelling}
              className="bg-[#98CA3F] hover:bg-[#7BA832] text-white"
            >
              Check Spelling
            </Button>
          </div>
        </Card>
      </div>

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
