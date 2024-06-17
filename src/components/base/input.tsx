const Input = ({
  value,
  setValue,
  className,
}: {
  value: string;
  setValue: (name: string) => void;
  className?: string;
}) => {
  return (
    <input
      className={className}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
export const StyledInput = ({
  value,
  setValue,
  className,
  onEnter,
  placeholder,
}: {
  value: string;
  setValue: (name: string) => void;
  onEnter?: () => void;
  className?: string;
  placeholder?: string;
}) => {
  return (
    <input
      placeholder={placeholder}
      className={`w-20 rounded-md border-2 border-gray-300 p-2 text-black ${className}`}
      value={value}
      onKeyUp={(e) => {
        if (e.key === "Enter" && onEnter) {
          onEnter();
        }
      }}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default Input;
