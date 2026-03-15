"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2 } from "lucide-react"
import { FormData } from "../types"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Textarea } from "./ui/Textarea"
import { Label } from "./ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"

interface PortfolioFormProps {
  initialData?: Partial<FormData>;
  onChange: (data: FormData) => void;
}

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  objective: z.string(),
  email: z.string().email("Invalid email address"),
  linkedin: z.string(),
  github: z.string(),
  skills: z.string(),
  achievements: z.string(),
  certifications: z.string(),
  education: z.array(z.object({
    collegeName: z.string().min(2, "College name is required"),
    degree: z.string(),
    branch: z.string(),
    cgpa: z.string(),
    yearOfStudy: z.string()
  })),
  projects: z.array(z.object({
    title: z.string().min(2, "Project title is required"),
    description: z.string(),
    technologies: z.string(),
    githubLink: z.string().optional()
  }))
})

export function PortfolioForm({ initialData, onChange }: PortfolioFormProps) {
  const { register, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      fullName: "",
      objective: "",
      email: "",
      linkedin: "",
      github: "",
      skills: "",
      achievements: "",
      certifications: "",
      education: [{ collegeName: "", degree: "", branch: "", cgpa: "", yearOfStudy: "" }],
      projects: [{ title: "", description: "", technologies: "", githubLink: "" }]
    }
  })

  // Watch for changes and lift them up
  React.useEffect(() => {
    const subscription = watch((value: any) => {
      onChange(value as FormData)
    })
    return () => {
      if ((subscription as any).unsubscribe) {
        (subscription as any).unsubscribe()
      }
    }
  }, [watch, onChange])

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education"
  })

  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
    control,
    name: "projects"
  })

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" {...register("fullName")} className={errors.fullName ? "border-red-500" : ""} />
            {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message}</span>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="objective">Objective / Career Summary</Label>
            <Textarea id="objective" placeholder="A passionate software engineer..." {...register("objective")} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" {...register("email")} className={errors.email ? "border-red-500" : ""} />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkedin">LinkedIn Handle / URL</Label>
              <Input id="linkedin" placeholder="linkedin.com/in/johndoe" {...register("linkedin")} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="github">GitHub Handle / URL</Label>
              <Input id="github" placeholder="github.com/johndoe" {...register("github")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ collegeName: "", degree: "", branch: "", cgpa: "", yearOfStudy: "" })}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {eduFields.map((field, index) => (
            <div key={field.id} className="grid gap-4 p-4 border rounded-md relative group">
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeEdu(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <div className="grid gap-2 pr-8">
                <Label>College/University Name</Label>
                <Input placeholder="University of Technology" {...register(`education.${index}.collegeName`)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Degree</Label>
                  <Input placeholder="B.Tech" {...register(`education.${index}.degree`)} />
                </div>
                <div className="grid gap-2">
                  <Label>Branch</Label>
                  <Input placeholder="Computer Science" {...register(`education.${index}.branch`)} />
                </div>
                <div className="grid gap-2">
                  <Label>CGPA / Grade</Label>
                  <Input placeholder="3.8" {...register(`education.${index}.cgpa`)} />
                </div>
                <div className="grid gap-2">
                  <Label>Year of Study</Label>
                  <Input placeholder="2020 - 2024" {...register(`education.${index}.yearOfStudy`)} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="skills">Technical Skills (comma separated)</Label>
            <Textarea id="skills" placeholder="React, Node.js, TypeScript, Python..." {...register("skills")} />
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => appendProj({ title: "", description: "", technologies: "", githubLink: "" })}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {projFields.map((field, index) => (
            <div key={field.id} className="grid gap-4 p-4 border rounded-md relative group">
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeProj(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <div className="grid gap-2 pr-8">
                <Label>Project Title</Label>
                <Input placeholder="E-commerce Platform" {...register(`projects.${index}.title`)} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea placeholder="Built a scalable e-commerce platform..." {...register(`projects.${index}.description`)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Technologies Used</Label>
                  <Input placeholder="Next.js, Tailwind, Prisma" {...register(`projects.${index}.technologies`)} />
                </div>
                <div className="grid gap-2">
                  <Label>GitHub Link (optional)</Label>
                  <Input placeholder="github.com/johndoe/project" {...register(`projects.${index}.githubLink`)} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements & Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="achievements">Key Achievements</Label>
            <Textarea id="achievements" placeholder="1st place in Hackathon 2023..." {...register("achievements")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="certifications">Certifications</Label>
            <Textarea id="certifications" placeholder="AWS Certified Developer..." {...register("certifications")} />
          </div>
        </CardContent>
      </Card>
      
    </form>
  )
}
