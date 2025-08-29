const LoadingTracker = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#f6f7f6", height: "calc(100dvh)" }}
    >
      <img
        width={400}
        height={300}
        src="/assets/study-ai-animation.gif"
        alt="Loading"
      />
    </div>
  );
};

export default LoadingTracker;
