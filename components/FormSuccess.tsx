import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 rounded-md flex h-8 p-3 items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="h-5 w-5" />
      <p> {message} </p>
    </div>
  );
};
