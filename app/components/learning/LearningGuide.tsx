"use client";

import React, { useState, FC } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { ReactNode } from "react";

interface LearningStep {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  duration: number;
}

const LearningGuide: FC = () => {
  const t = useTranslations("Learning");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const learningSteps: LearningStep[] = [
    {
      id: "intro",
      title: t("steps.intro.title"),
      content: t("steps.intro.content"),
      completed: false,
      duration: 10,
    },
    {
      id: "bitcoin",
      title: t("steps.bitcoin.title"),
      content: t("steps.bitcoin.content"),
      completed: false,
      duration: 15,
    },
    {
      id: "blockchain",
      title: t("steps.blockchain.title"),
      content: t("steps.blockchain.content"),
      completed: false,
      duration: 20,
    },
    {
      id: "mining",
      title: t("steps.mining.title"),
      content: t("steps.mining.content"),
      completed: false,
      duration: 15,
    },
    {
      id: "basics",
      title: t("steps.basics.title"),
      content: t("steps.basics.content"),
      completed: false,
      duration: 15,
    },
    {
      id: "channels",
      title: t("steps.channels.title"),
      content: t("steps.channels.content"),
      completed: false,
      duration: 20,
    },
    {
      id: "transactions",
      title: t("steps.transactions.title"),
      content: t("steps.transactions.content"),
      completed: false,
      duration: 25,
    },
    {
      id: "nodes",
      title: t("steps.nodes.title"),
      content: t("steps.nodes.content"),
      completed: false,
      duration: 20,
    },
  ];

  const handleStepComplete = (stepId: string) => {
    const updatedSteps = learningSteps.map((step) =>
      step.id === stepId ? { ...step, completed: true } : step
    );
    const newProgress =
      (updatedSteps.filter((step) => step.completed).length /
        learningSteps.length) *
      100;
    setProgress(newProgress);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">
          {t("title") || "Guide d'apprentissage"}
        </h1>
        <Progress value={progress} className="mb-8" />

        <Tabs defaultValue={learningSteps[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-1 mb-2">
            {learningSteps.slice(0, 4).map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className={step.completed ? "bg-green-500 text-white" : ""}
              >
                {step.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsList className="grid w-full grid-cols-4 gap-1">
            {learningSteps.slice(4).map((step) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                className={step.completed ? "bg-green-500 text-white" : ""}
              >
                {step.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {learningSteps.map((step) => (
            <TabsContent key={step.id} value={step.id}>
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
                <div className="prose dark:prose-invert max-w-none mb-6">
                  {step.content}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/80">
                    {t("duration")}: {step.duration} {t("minutes")}
                  </span>
                  <Button
                    onClick={() => handleStepComplete(step.id)}
                    variant={step.completed ? "secondary" : "default"}
                    className={
                      step.completed ? "bg-green-500 hover:bg-green-600" : ""
                    }
                  >
                    {step.completed ? t("completed") : t("markComplete")}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
};

export default LearningGuide;
