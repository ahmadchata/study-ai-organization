import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Skeleton.css";

const PostSkeleton = () => {
  return (
    <div className="col row gap-4 m-0 p-0">
      <div className="col-12 p-3 text-decoration-none text-dark">
        <div className="d-flex">
          <Skeleton circle height="100%" containerClassName="avatar-skeleton" />
          <div>
            <p className="m-0 text-capitalize">
              <Skeleton width={60} />
            </p>
            <p className="m-0 grey-text">
              <Skeleton width={60} />
            </p>
          </div>
        </div>
        <p className="m-0 mt-4 mb-3">
          <Skeleton count={3} />
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
    </div>
  );
};

export default PostSkeleton;
