"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useFormik } from "formik"
import * as Yup from "yup"
import { postAuthServices } from "@/app/api/admin-api";
import { setAuthCookies } from "@/app/login/actions";
import axios from "axios";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: Yup.string()
    .required("Password is required"),
})

export function LoginForm({
  className,
  onSubmit,
  ...props
}: React.ComponentProps<"div"> & {
  onSubmit?: (values: { email: string; password: string }) => void | Promise<void>;
}) {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values)
      const response = await axios.post("http://localhost:8000/api/login/",values,{withCredentials:true})
      if (response) {
        console.log("response", response);
        await setAuthCookies(response.data.access, response.data.refresh);
        window.location.href = "/admin/dashboard/";
        
      } else {
        alert(response.error_message ?? "Login failed");
      }
    },
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...formik.getFieldProps("email")}
                  aria-invalid={formik.touched.email && !!formik.errors.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-destructive mt-1">{formik.errors.email}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                  aria-invalid={formik.touched.password && !!formik.errors.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-destructive mt-1">{formik.errors.password}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? "Signing in…" : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


