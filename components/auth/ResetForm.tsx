"use client";


import { reset } from "@/action/reset";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetSchema } from "@/schema/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { Button } from "../ui/button";
import CardWraper from "./CardWraper";


const ResetForm = () => {
  

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmits = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    

    startTransition(() => {
      reset(values).then((data) => {
        if (data) {
          setError(data?.error);
          setSuccess(data?.success);
        } else {
          setError("An unexpected error occurred!");
        }
      });
    });
  };

  return (
    <CardWraper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login?   "
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmits)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="sanju.sharma@email.com"
                      {...field}
                      disabled={isPending}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWraper>
  );
};

export default ResetForm;
