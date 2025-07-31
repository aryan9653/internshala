'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { fetchCaseData, type ActionState } from '@/app/actions';
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
import { CaseDetails } from '@/components/case-details';
import { Logo } from '@/components/logo';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export default function Home() {
  const [state, formAction] = useFormState(fetchCaseData, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: state.error,
      });
    }
  }, [state]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <Logo />
          <p className="text-muted-foreground mt-2">
            Enter case details to fetch the latest information and orders.
          </p>
        </header>

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
              <div>
                <p className="text-sm text-muted-foreground">
                  Hint: Try case number '123' for success, '999' for an invalid number error, or '000' for a site down error.
                 </p>
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
        
        {state.data && <CaseDetails data={state.data} />}
        
      </div>
    </main>
  );
}
