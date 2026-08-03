"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function SonnerTypes(err) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
      >
        {err.message}
      </Button>
      
    </div>
  )
}
