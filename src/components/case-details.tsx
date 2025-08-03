
import type { CaseData, CaseOrder } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, ShieldAlert, Sparkles, Wand2, Bot, Loader2, Clock } from 'lucide-react';

interface CaseDetailsProps {
  data: CaseData;
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
    order
}: { 
    order: CaseOrder
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
            </div>
        </div>
    )
}

export function CaseDetails({ 
    data
}: CaseDetailsProps) {
  return (
    <div className="grid animate-in fade-in-50 gap-8">
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
          <CardDescription>A log of recent activity in the case.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
