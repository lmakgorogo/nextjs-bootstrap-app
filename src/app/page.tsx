"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SpellingPractice from "@/components/spelling/SpellingPractice"
import CreativeWriting from "@/components/writing/CreativeWriting"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 font-quicksand text-center text-[#4A90E2]">
        Spelling & Writing Practice
      </h1>
      
      <Tabs defaultValue="spelling" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="spelling">Spelling Practice</TabsTrigger>
          <TabsTrigger value="writing">Creative Writing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spelling">
          <Card className="p-6">
            <SpellingPractice />
          </Card>
        </TabsContent>
        
        <TabsContent value="writing">
          <Card className="p-6">
            <CreativeWriting />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
