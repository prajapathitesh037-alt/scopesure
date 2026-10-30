import DashboardOverviewPage from './dashboard/page';
import DashboardLayout from './dashboard/layout';

export default function RootHomePage() {
  return (
    <DashboardLayout>
      <DashboardOverviewPage />
    </DashboardLayout>
  );
}
