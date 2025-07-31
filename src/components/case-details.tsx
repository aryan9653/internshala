
import type { CaseData, CaseOrder } from '@/app/actions';
import { type ExplainOrderOutput } from '@/ai/flows/explain-order-flow';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, ShieldAlert, Sparkles, Wand2, Bot, Loader2, Clock } from 'lucide-react';

interface CaseDetailsProps {
  data: CaseData;
  summary: string | null;
  isSummaryLoading: boolean;
  summaryTime: number | null;
  explanation: ExplainOrderOutput | null;
  isExplanationLoading: boolean;
  explanationTime: number | null;
  onExplainOrder: (orderDescription: string) => void;
}

function DetailRow({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 gap-2 py-2 border-b border-dashed">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="col-span-2 text-sm font-semibold">{value}</div>
        </div>
    )
}

function OrderCard({ 
    order, 
    onExplainClick 
}: { 
    order: CaseOrder,
    onExplainClick: () => void,
}) {
    const isNotice = order.type === 'notice';
    return (
        <div className="grid grid-cols-[auto,1fr] gap-x-4 animate-in fade-in-50">
             <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${isNotice ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {isNotice ? (
                        <ShieldAlert className="h-5 w-5 text-blue-600" />
                    ) : (
                        <FileText className="h-5 w-5 text-green-600" />
                    )}
                </div>
                <div className="flex-grow border-l-2 border-dashed border-border my-2"></div>
            </div>
            <div>
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold">{order.title}</h3>
                    <Badge variant={isNotice ? 'default' : 'secondary'} className="capitalize">{order.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 mb-2">{order.date}</p>
                <p className="text-sm text-muted-foreground mb-3">{order.description}</p>
                <Button size="sm" variant="outline" onClick={onExplainClick}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Explain this Order
                </Button>
            </div>
        </div>
    )
}

export function CaseDetails({ 
    data, 
    summary, 
    isSummaryLoading,
    summaryTime,
    explanation, 
    isExplanationLoading,
    explanationTime,
    onExplainOrder 
}: CaseDetailsProps) {
  return (
    <div className="grid animate-in fade-in-50 gap-8">
        {isSummaryLoading && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        AI Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
        )}
        {summary && (
             <Card className="bg-gradient-to-br from-primary/10 to-background">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Sparkles className="text-primary" />
                            AI-Generated Summary
                        </span>
                        {summaryTime && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {summaryTime.toFixed(2)}s
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{summary}</p>
                </CardContent>
            </Card>
        )}
      <Card>
        <CardHeader>
            <CardTitle>Case History</CardTitle>
            <CardDescription className="mt-1">
                Last Updated: {data.lastUpdated}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <DetailRow label="Case No" value={data.caseId} />
            <DetailRow label="CNR No." value={data.cnrNumber} />
            <DetailRow 
                label="Status" 
                value={<Badge variant={data.status === 'Pending' ? 'destructive' : 'secondary'} className="capitalize">{data.status}</Badge>} 
            />
            <DetailRow label="Date of Registration" value={data.registrationDate} />
            <DetailRow label="Date of Filing" value={data.filingDate} />
            <DetailRow label="Filing Advocate" value={data.filingAdvocate} />
            <DetailRow 
                label="Parties" 
                value={
                    <p>
                        {data.parties.petitioner}
                        <span className="font-normal text-muted-foreground mx-2">Vs.</span>
                        {data.parties.respondent}
                    </p>
                }
            />
            <DetailRow label="Dealing Assistant" value={data.dealingAssistant} />
            <DetailRow label="Subject" value={<p className="whitespace-normal">{data.subject}</p>} />
            <DetailRow label="Next Hearing" value={<span className="font-bold text-primary">{data.nextHearingDate}</span>} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Latest Orders & Judgments</CardTitle>
          <CardDescription>Click "Explain this Order" for an AI-powered summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {isExplanationLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Analyzing document...</span>
                </div>
            )}
            {explanation && (
                <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                        <span>AI Explanation</span>
                        {explanationTime && (
                           <span className="flex items-center gap-1 text-xs text-muted-foreground font-normal">
                                <Clock className="h-3 w-3" />
                                {explanationTime.toFixed(2)}s
                            </span>
                        )}
                    </AlertTitle>
                    <AlertDescription>
                        <p className="font-semibold mb-2">{explanation.summary}</p>
                        <ul className="list-disc pl-5 space-y-1">
                            {explanation.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

          {data.orders.map((order, index) => (
            <OrderCard key={index} order={order} onExplainClick={() => onExplainOrder(order.description)} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
