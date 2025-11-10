interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className,
}: InputProps) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="text-dark dark:text-light text-sm font-medium"
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-light dark:bg-dark w-full px-3 py-2 shadow-xs rounded-lg focus:outline-none"
      />
    </div>
  );
};

export default Input;
