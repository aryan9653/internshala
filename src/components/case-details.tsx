
import type { CaseData, CaseOrder } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, GanttChartSquare, Landmark, Scale, ShieldAlert, User, Users, CalendarDays, Case } from 'lucide-react';

interface CaseDetailsProps {
  data: CaseData;
}

function DetailItem({ icon, label, value, valueBadgeVariant }: { icon: React.ElementType, label: string, value: string, valueBadgeVariant?: "default" | "secondary" | "destructive" | "outline" | null }) {
    const Icon = icon;
    return (
        <div className="grid grid-cols-[auto,1fr] items-start gap-x-4">
            <Icon className="h-5 w-5 text-muted-foreground mt-1" />
            <div className="text-sm">
                <p className="text-muted-foreground">{label}</p>
                {valueBadgeVariant ? (
                    <Badge variant={valueBadgeVariant} className="text-base font-semibold mt-1">{value}</Badge>
                ) : (
                    <p className="font-semibold">{value}</p>
                )}
            </div>
        </div>
    )
}

function OrderCard({ order }: { order: CaseOrder }) {
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
                <p className="text-sm text-muted-foreground">{order.description}</p>
            </div>
        </div>
    )
}

export function CaseDetails({ data }: CaseDetailsProps) {
  return (
    <div className="grid animate-in fade-in-50 gap-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle>Case Details</CardTitle>
                <CardDescription className="mt-1">
                    Last Updated: {data.lastUpdated}
                </CardDescription>
            </div>
            <Badge variant={data.status === 'Pending' ? 'destructive' : 'secondary'} className="capitalize">{data.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-8">
            <DetailItem icon={GanttChartSquare} label="Case Number" value={data.caseId} />
            <DetailItem icon={Landmark} label="Court" value={data.court} />
            <DetailItem icon={CalendarDays} label="Filing Date" value={data.filingDate} />
            <DetailItem icon={Scale} label="Judge" value={data.judge} />
            <DetailItem icon={User} label="Petitioner" value={data.parties.petitioner} />
            <DetailItem icon={Users} label="Respondent" value={data.parties.respondent} />
            <DetailItem icon={CalendarDays} label="Next Hearing" value={data.nextHearingDate} valueBadgeVariant="default" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Latest Orders & Judgments</CardTitle>
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
