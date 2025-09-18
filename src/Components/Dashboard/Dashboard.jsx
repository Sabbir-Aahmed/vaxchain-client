import DashboardOverview from "./DashboardOverview";

const Dashboard = () => {
    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          <DashboardOverview />
        </div>
      </div>
    );
  };
  
  export default Dashboard;