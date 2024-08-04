"use client";

import { useCallback, useEffect, useState } from "react";
import CardWraper from "@/components/auth/CardWraper";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";

import { newVerification } from "@/action/new-verification";

import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

const NewVerificationForm = () => {

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess  ] = useState<string | undefined>()
    const [loading, setLoading  ] = useState<boolean>(false)


  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {

    if(success || error) return ;

   if(!token) {
    setError("Missing token!");
    return;
   }
   setLoading(true)
   newVerification(token)
     .then((data)=>{
        setSuccess(data?.success);
        setError(data?.error);
     })
     .catch(()=>{
        setError("Something went wrong!")
     })
     .finally(()=>{
        setLoading(false)
     })
  }, [token, success, error]);

  useEffect(()=>{
onSubmit()
  }, [onSubmit])

  return (
    <CardWraper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
       <div className="flex items-center w-full justify-center">
        {loading && <BeatLoader />}
        {success && <FormSuccess message={success} />}
        {error && <FormError message={error} />}
      </div>
    </CardWraper>
  );
};

export default NewVerificationForm;
