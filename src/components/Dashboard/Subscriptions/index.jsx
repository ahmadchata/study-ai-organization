import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../../../api/DashboardAPI";
import LoadingTracker from "../../Common/Loading";
import "./styles.css";

const MOCK_BILLING_HISTORY = [
  { invoice: "INV-2041", date: "May 1, 2026", amount: "₦110,000", status: "Paid" },
  { invoice: "INV-2040", date: "Apr 1, 2026", amount: "₦110,000", status: "Paid" },
  { invoice: "INV-2039", date: "Mar 1, 2026", amount: "₦110,000", status: "Paid" },
];

const Subscriptions = () => {
  const { data: overview, isFetching: isFetchingOverview } = useQuery({
    queryKey: ["overview"],
    refetchOnMount: false,
    queryFn: () => DashboardAPI.overview(true),
  });

  const { data: subscriptions, isFetching: isFetchingSubs } = useQuery({
    queryKey: ["subscriptions", 1, ""],
    queryFn: () => DashboardAPI.getSubscriptions(1, "", true),
  });

  if (isFetchingOverview || isFetchingSubs) {
    return <LoadingTracker />;
  }

  const totalLicenses = subscriptions?.total_subscriptions || 0;
  const usedLicenses = overview?.statistics?.students_with_subscriptions || 0;
  const usagePct = totalLicenses
    ? Math.min(100, Math.round((usedLicenses / totalLicenses) * 100))
    : 0;

  return (
    <div>
      <div className="card-panel p-4 mb-4">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="m-0">Institutional License</h6>
              <span className="license-badge">Active</span>
            </div>
            <p className="grey-text mt-1 mb-0">Renews on June 1, 2026</p>
          </div>
        </div>

        <div className="row mx-0 mt-4">
          <div className="col-12 col-md-6 px-0">
            <label className="grey-text small-text">Monthly cost</label>
            <h2 className="m-0">₦110,00</h2>
            <p className="grey-text small-text mt-1">₦2,200 per student / month</p>
            <Link to="/dashboard/subscriptions/purchase-code" className="text-decoration-none">
              <button className="btn default-btn mt-3 px-4 py-2">Get more license</button>
            </Link>
          </div>
          <div className="col-12 col-md-6 px-0 mt-4 mt-md-0">
            <label className="grey-text small-text">Student licenses</label>
            <h4 className="m-0 mt-1">
              {usedLicenses}/{totalLicenses || usedLicenses}
            </h4>
            <div className="license-progress mt-2">
              <div className="license-progress-fill" style={{ width: `${usagePct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card-panel p-4">
        <h6 className="mb-3">Billing History</h6>
        <div className="d-flex flex-column">
          {MOCK_BILLING_HISTORY.map((invoice) => (
            <div
              key={invoice.invoice}
              className="d-flex align-items-center justify-content-between billing-row"
            >
              <div>
                <p className="m-0">{invoice.invoice}</p>
                <p className="grey-text small-text m-0">{invoice.date}</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span>{invoice.amount}</span>
                <span className="paid-badge">{invoice.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
