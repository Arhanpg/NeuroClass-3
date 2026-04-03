import { EnrollForm } from '@/components/courses/EnrollForm';

export const metadata = { title: 'Enroll in Course – NeuroClass' };

export default function EnrollPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enroll in a Course</h1>
        <p className="text-muted-foreground">Enter the join code provided by your instructor</p>
      </div>
      <EnrollForm />
    </div>
  );
}
