import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof>,</typeof>
  React.ComponentPropsWithoutRef<typeof>
>(({className ...props }, ref) => (</typeof>
  <TabsPrimitive>)
TabsList.displayName = TabsPrimitive.List.displayName
</TabsPrimitive>
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof>,</typeof>
  React.ComponentPropsWithoutRef<typeof>
>(({className ...props }, ref) => (</typeof>
  <TabsPrimitive>)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
</TabsPrimitive>
const TabsContent = React.forwardRef<
  React.ElementRef<typeof>,</typeof>
  React.ComponentPropsWithoutRef<typeof>
>(({className ...props }, ref) => (</typeof>
  <TabsPrimitive>)
TabsContent.displayName = TabsPrimitive.Content.displayName

export {Tabs TabsList, TabsTrigger, TabsContent} </TabsPrimitive>