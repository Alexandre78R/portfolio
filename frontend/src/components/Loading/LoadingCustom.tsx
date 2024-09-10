import { CircularProgress } from "@mui/material";

const LoadingCustom: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-52">
      <CircularProgress
        className="text-primary"
        size={60}
        thickness={4}
        style={{
          animation: "pulse-spin 12s ease-in-out infinite",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default LoadingCustom;
