"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PortfolioForm } from "./components/PortfolioForm"
import { PortfolioPreview } from "./components/PortfolioPreview"
import { FormData } from "./types"
import { generatePDF } from "./lib/pdf"
import { encodeFormData, decodeFormData } from "./lib/share"
import { Button } from "./components/ui/Button"
import { Download, Share2, Check } from "lucide-react"

const defaultData: FormData = {
  fullName: "Jane Doe",
  objective: "A passionate software engineer with 5 years of experience building scalable web applications.",
  email: "jane.doe@example.com",
  linkedin: "linkedin.com/in/janedoe",
  github: "github.com/janedoe",
  skills: "React, Next.js, TypeScript, Tailwind CSS, Node.js",
  achievements: "Winner of Global Hackathon 2023\nEmployee of the Year 2022",
  certifications: "AWS Certified Solutions Architect\nGoogle Cloud Professional Developer",
  education: [
    {
      collegeName: "University of Technology",
      degree: "B.S.",
      branch: "Computer Science",
      cgpa: "3.9",
      yearOfStudy: "2018 - 2022"
    }
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      description: "Built a scalable e-commerce platform using Next.js and Stripe.",
      technologies: "Next.js, Tailwind, Prisma, Stripe",
      githubLink: "github.com/janedoe/ecommerce"
    }
  ]
};

function PortfolioBuilder() {
  const [formData, setFormData] = useState<FormData>(defaultData)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Load from URL if present
    const sharedData = searchParams.get('data')
    if (sharedData) {
      const decoded = decodeFormData(sharedData)
      if (decoded) {
        setFormData(decoded)
      }
    }
  }, [searchParams])

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPDF(true);
    await generatePDF(previewRef.current, `${formData.fullName.replace(/\s+/g, '_')}_Portfolio.pdf`);
    setIsGeneratingPDF(false);
  }

  const handleShareLink = () => {
    const encoded = encodeFormData(formData);
    // Create new URL with the data parameter
    const url = new URL(window.location.href);
    url.searchParams.set('data', encoded);
    
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
    
    // Also update the current URL without reloading
    router.replace(`?data=${encoded}`, { scroll: false });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            AI Portfolio Generator
          </h1>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleShareLink}
              className="hidden sm:flex"
            >
              {copiedLink ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Share2 className="w-4 h-4 mr-2" />}
              {copiedLink ? "Copied!" : "Share Link"}
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              disabled={isGeneratingPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Pane: Form (Scrollable) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] bg-white border-r border-gray-200 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Your Portfolio</h2>
              <p className="text-gray-600">Fill in your details below. The preview will update automatically.</p>
            </div>
            {/* Mobile share button */}
            <Button 
              variant="outline" 
              onClick={handleShareLink}
              className="w-full mb-6 sm:hidden flex justify-center"
            >
              {copiedLink ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Share2 className="w-4 h-4 mr-2" />}
              {copiedLink ? "Link Copied to Clipboard!" : "Copy Shareable Link"}
            </Button>
            
            <PortfolioForm 
              initialData={formData} 
              onChange={setFormData} 
            />
          </div>
        </div>

        {/* Right Pane: Preview (Scrollable) */}
        <div className="w-full lg:w-[55%] xl:w-[60%] lg:h-[calc(100vh-4rem)] lg:overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
          <div className="w-full overflow-x-auto print:overflow-visible">
            {/* Scale down slightly on smaller screens if necessary, or just rely on the component's internal responsiveness */}
            <PortfolioPreview data={formData} ref={previewRef} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PortfolioBuilder />
    </Suspense>
  )
}