import { Briefcase } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 text-3xl font-bold text-foreground">
      <Briefcase className="h-8 w-8 text-primary" />
      <h1 className="font-headline">
        Court<span className="text-primary">Look</span>
      </h1>
    </div>
  );
}
