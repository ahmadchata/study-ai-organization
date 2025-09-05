import "./styles.css";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import TopPerformers from "../TopPerformers";

const Home = () => {
  return (
    <div className="px-lg-5 px-2 py-3 py-lg-5">
      <div className="summary-bg px-3 py-4">
        <h6 className="ms-3">Summary</h6>

        <div className="row mt-5 mx-0">
          <div className="col-12 col-lg-4 px-0 px-lg-3">
            <div className="bg-white summary-card p-3">
              <label>Total subscriptions</label>
              <div className="mt-5 d-flex align-items-center justify-content-between">
                <h5 className="">35</h5>
                <div className="dsh-btn">
                  <SpeakerGroupIcon style={{ color: "#0C7A50" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mt-3 mt-lg-0 px-0 px-lg-3">
            <div className="bg-white summary-card p-3">
              <label>Active subscriptions</label>
              <div className="mt-5 d-flex align-items-center justify-content-between">
                <h5 className="">35</h5>
                <div className="dsh-btn">
                  <SpeakerGroupIcon style={{ color: "#0C7A50" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mt-3 mt-lg-0 px-0 px-lg-3">
            <div className="bg-white summary-card p-3">
              <label>Total students</label>
              <div className="mt-5 d-flex align-items-center justify-content-between">
                <h5 className="">35</h5>
                <div className="dsh-btn">
                  <PeopleOutlineIcon style={{ color: "#0C7A50" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mx-0 mt-5">
        <div className="d-none d-lg-block col-12 col-lg-7 bg-white summary-card p-3 me-4">
          <h6>Engagement</h6>
        </div>

        <div className="summary-bg col-12 col-lg p-3">
          <h6>Top Performers</h6>
          <div className="bg-white summary-card mt-4">
            <TopPerformers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
