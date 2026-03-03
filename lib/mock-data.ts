// Mock health data for charts
export const mockHealthMetrics = [
  { date: "Jan 1", liverHealth: 72, albumin: 4.0, bilirubin: 0.8, ast: 32, alt: 28 },
  { date: "Jan 8", liverHealth: 68, albumin: 3.8, bilirubin: 0.9, ast: 35, alt: 31 },
  { date: "Jan 15", liverHealth: 65, albumin: 3.6, bilirubin: 1.1, ast: 40, alt: 36 },
  { date: "Jan 22", liverHealth: 70, albumin: 3.9, bilirubin: 0.95, ast: 37, alt: 33 },
  { date: "Jan 29", liverHealth: 75, albumin: 4.1, bilirubin: 0.85, ast: 30, alt: 26 },
  { date: "Feb 5", liverHealth: 78, albumin: 4.2, bilirubin: 0.8, ast: 28, alt: 24 },
  { date: "Feb 12", liverHealth: 80, albumin: 4.3, bilirubin: 0.75, ast: 25, alt: 22 },
]

export const mockRiskFactors = [
  { name: "Alcohol", value: 65, category: "Lifestyle" },
  { name: "BMI", value: 72, category: "Physical" },
  { name: "Medical History", value: 45, category: "Medical" },
  { name: "Age", value: 38, category: "Demographics" },
  { name: "Family History", value: 28, category: "Genetics" },
]

export const mockDoctors = [
  {
    id: "doc_1",
    name: "Dr. Rajesh Kumar",
    specialty: "Hepatologist",
    availability: ["Mon", "Tue", "Wed", "Thu"],
    fee: 500,
    rating: 4.8,
  },
  {
    id: "doc_2",
    name: "Dr. Priya Sharma",
    specialty: "Gastroenterologist",
    availability: ["Tue", "Wed", "Fri", "Sat"],
    fee: 450,
    rating: 4.7,
  },
  {
    id: "doc_3",
    name: "Dr. Arun Singh",
    specialty: "Internal Medicine",
    availability: ["Mon", "Wed", "Thu", "Fri"],
    fee: 400,
    rating: 4.6,
  },
]
