import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import CardWraper from "@/components/auth/CardWraper"


const ErrorCard = () => {
  return (
    <CardWraper 
    headerLabel="Oops! Something went wrong!"
    backButtonLabel="Back to login"
    backButtonHref="/auth/login"
    >
        <div className="w-full flex justify-center items-center">
            <ExclamationTriangleIcon className="text-destructive w-6 h-6" />
        </div>
    </CardWraper>
  )
}

export default ErrorCard