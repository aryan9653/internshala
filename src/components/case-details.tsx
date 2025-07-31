
import type { CaseData } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { Badge } from './ui/badge';

interface CaseDetailsProps {
  data: CaseData;
}

export function CaseDetails({ data }: CaseDetailsProps) {
  return (
    <div className="grid animate-in fade-in-50 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Case Summary</CardTitle>
          <CardDescription>
            {data.caseType} - {data.caseNumber}/{data.filingYear}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Parties
            </h3>
            <div className="pl-7 space-y-2 text-sm">
              <p>
                <span className="font-medium text-muted-foreground">Petitioner: </span>
                {data.parties.petitioner}
              </p>
              <p>
                <span className="font-medium text-muted-foreground">Respondent: </span>
                {data.parties.respondent}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Key Dates</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Filing Date: </span>
                <Badge variant="secondary">{data.filingDate}</Badge>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Next Hearing: </span>
                <Badge>{data.nextHearingDate}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Orders & Judgments</CardTitle>
          <CardDescription>
            Most recent orders are listed first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.orders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{order.date}</TableCell>
                  <TableCell>{order.description}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <a href={order.pdfUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
