import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Select which feature to use</h2>
        <p className="text-muted-foreground mt-2">
          Use the cards below to navigate to different features of the IMKAT Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavCard title="IFP to BT Mapper" description="Settings to map IFP data to BT" route="/dashboard/ifp" />
      </div>
    </div>
  );
}


const NavCard = ({ title, description, route }: { title: string; description: string; route: string }) => {
  return (
    <Link href={route}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}