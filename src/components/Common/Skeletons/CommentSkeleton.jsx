import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Skeleton.css";

const CommentSkeleton = () => {
  return (
    <div
      className="col-12 border p-3 text-decoration-none text-dark"
      style={{ borderRadius: "18px" }}
    >
      <div className="d-flex">
        <Skeleton circle height="100%" containerClassName="avatar-skeleton" />
        <div>
          <p className="m-0 text-capitalize">
            <Skeleton width={60} />
          </p>
        </div>
      </div>
      <p className="m-0 fw-medium mt-4 mb-3">
        <Skeleton count={2} />
      </p>
      <div className="d-flex align-items-center">
        <span className="d-flex align-items-center pointer">
          <Skeleton width={40} />
        </span>
        <span className="d-flex align-items-center mx-4 pointer">
          <Skeleton width={20} />
        </span>
        <span className="d-flex align-items-center pointer">
          <Skeleton width={40} />
        </span>
      </div>
    </div>
  );
};

export default CommentSkeleton;
