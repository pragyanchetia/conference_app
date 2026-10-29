
import Image from "next/image";

type LoaderProps = {
  className?: string;
};

const Loader = ({ className = "h-screen" }: LoaderProps) => {
  return (
    <div className={`flex-center w-full ${className}`}>
      <Image
        src="/icons/loading-circle.svg"
        alt="Loading"
        width={50}
        height={50}
      />
    </div>
  );
};

export default Loader;
