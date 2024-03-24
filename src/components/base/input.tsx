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
}: {
  value: string;
  setValue: (name: string) => void;
  onEnter?: () => void;
  className?: string;
}) => {
  return (
    <input
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
export const LabelledInput = ({
  value,
  setValue,
  label,
  className,
}: {
  value: string;
  setValue: (name: string) => void;
  label: string;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <label>{label}</label>
      <input
        className="w-20 rounded-md border-2 border-gray-300 p-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Input;
