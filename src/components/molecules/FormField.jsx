import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "input", 
  error, 
  className,
  required = false,
  children,
  ...props 
}) => {
  const renderField = () => {
    if (type === "select") {
      return (
        <Select error={error} {...props}>
          {children}
        </Select>
      );
    }
    
    if (type === "textarea") {
      return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
            error && "border-error-500 focus:ring-error-500 focus:border-error-500"
          )}
          {...props}
        />
      );
    }
    
    return <Input error={error} {...props} />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-error-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;