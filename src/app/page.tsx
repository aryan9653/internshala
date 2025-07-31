
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { fetchCaseData, type ActionState, type CaseData } from '@/app/actions';
import { summarizeCase } from '@/ai/flows/summarize-case-flow';
import { explainOrder, type ExplainOrderOutput } from '@/ai/flows/explain-order-flow';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const CaseDetails = dynamic(() => import('@/components/case-details').then(mod => mod.CaseDetails), {
  ssr: false,
  loading: () => <CaseDetailsSkeleton />,
});

const initialState: ActionState = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} variant="default">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Search Case
    </Button>
  );
}

function CaseSearchForm() {
  const [state, formAction] = useActionState(fetchCaseData, initialState);
  const { toast } = useToast();
  
  const [isSummaryLoading, startSummaryTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);

  const [explanation, setExplanation] = useState<ExplainOrderOutput | null>(null);
  const [isExplanationLoading, startExplanationTransition] = useTransition();


  const handleExplainOrder = (orderDescription: string) => {
    startExplanationTransition(async () => {
      setExplanation(null);
      const result = await explainOrder({ orderText: orderDescription });
      setExplanation(result);
    });
  }

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: state.error,
      });
      setSummary(null);
    }
    if (state.data) {
      setSummary(null);
      setExplanation(null);
      startSummaryTransition(async () => {
        const caseSummary = await summarizeCase(state.data as CaseData);
        setSummary(caseSummary);
      });
    }
  }, [state.error, state.data, toast]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Find a Case</CardTitle>
            <CardDescription>
              Provide the details for the case you want to look up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="caseType">Case Type</Label>
              <Select name="caseType" defaultValue="W.P.(C)">
                <SelectTrigger id="caseType" className="w-full">
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="W.P.(C)">W.P.(C) - Writ Petition (Civil)</SelectItem>
                  <SelectItem value="CS(OS)">CS(OS) - Civil Suit (Original Side)</SelectItem>
                  <SelectItem value="FAO">FAO - First Appeal from Order</SelectItem>
                  <SelectItem value="CRL.A">CRL.A - Criminal Appeal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseNumber">Case Number</Label>
                <Input id="caseNumber" name="caseNumber" placeholder="e.g., 123" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filingYear">Filing Year</Label>
                <Input id="filingYear" name="filingYear" placeholder="e.g., 2023" required maxLength={4} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.data && (
        <CaseDetails 
            data={state.data} 
            summary={summary}
            isSummaryLoading={isSummaryLoading}
            onExplainOrder={handleExplainOrder}
            explanation={explanation}
            isExplanationLoading={isExplanationLoading}
        />
      )}
    </div>
  );
}

function CaseDetailsSkeleton() {
    return (
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="pl-7 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          </CardContent>
        </Card>
      </div>
    )
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <Logo />
          <p className="text-muted-foreground mt-2">
            Enter case details to fetch the latest information and orders.
          </p>
        </header>
        <ClientOnly>
          <CaseSearchForm />
        </ClientOnly>
      </div>
    </main>
  );
}
