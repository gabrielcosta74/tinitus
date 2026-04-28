export const THI_QUESTIONS: string[] = [
  "Because of your tinnitus, is it difficult for you to concentrate?",
  "Does the loudness of your tinnitus make it difficult for you to hear people?",
  "Does your tinnitus make you angry?",
  "Does your tinnitus make you feel confused?",
  "Because of your tinnitus, do you feel desperate?",
  "Do you complain a great deal about your tinnitus?",
  "Because of your tinnitus, do you have trouble falling to sleep at night?",
  "Do you feel as though you cannot escape your tinnitus?",
  "Does your tinnitus interfere with your ability to enjoy your social activities (such as going out to dinner, to the movies)?",
  "Because of your tinnitus, do you feel frustrated?",
  "Because of your tinnitus, do you feel that you have a terrible disease?",
  "Does your tinnitus make it difficult for you to enjoy life?",
  "Does your tinnitus interfere with your job or household responsibilities?",
  "Because of your tinnitus, do you find that you are often irritable?",
  "Because of your tinnitus, is it difficult for you to read?",
  "Does your tinnitus make you upset?",
  "Do you feel that your tinnitus problem has placed stress on your relationships with members of your family and friends?",
  "Do you find it difficult to focus your attention away from your tinnitus and onto other things?",
  "Do you feel that you have no control over your tinnitus?",
  "Because of your tinnitus, do you often feel tired?",
  "Because of your tinnitus, do you feel depressed?",
  "Does your tinnitus make you feel anxious?",
  "Do you feel that you can no longer cope with your tinnitus?",
  "Does your tinnitus get worse when you are under stress?",
  "Does your tinnitus make you feel insecure?",
]

export interface SeverityInfo {
  grade: number
  label: string
  description: string
  textColor: string
  bgColor: string
  borderColor: string
  ringColor: string
}

export function getSeverity(score: number): SeverityInfo {
  if (score <= 16)
    return {
      grade: 1,
      label: "Slight",
      description: "Tinnitus is present but does not significantly disrupt daily life.",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      ringColor: "#059669",
    }
  if (score <= 36)
    return {
      grade: 2,
      label: "Mild",
      description: "Tinnitus occasionally interferes with quiet environments and sleep.",
      textColor: "text-lime-600",
      bgColor: "bg-lime-50",
      borderColor: "border-lime-200",
      ringColor: "#65a30d",
    }
  if (score <= 56)
    return {
      grade: 3,
      label: "Moderate",
      description: "Tinnitus has a noticeable impact on your quality of life.",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      ringColor: "#d97706",
    }
  if (score <= 76)
    return {
      grade: 4,
      label: "Severe",
      description: "Tinnitus significantly disrupts daily functioning and wellbeing.",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      ringColor: "#ea580c",
    }
  return {
    grade: 5,
    label: "Catastrophic",
    description: "Tinnitus has a profound impact on all aspects of your life.",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    ringColor: "#dc2626",
  }
}

export function calculateTHIScore(answers: Record<number, 0 | 2 | 4>): number {
  return Object.values(answers).reduce<number>((sum, val) => sum + val, 0)
}
