"use client";
import React from "react";
import Image from "next/image";
import onologo from '../../../assets/onologo.png';
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/application/graphql/queries";
import { Bounce, toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { ERoles } from "@/utils/types";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  registrationNumber?: string;
  phoneNumber?: string;
  EUserType: ERoles;
}


export default function RegisterPage() {
  const { register, handleSubmit, reset } = useForm<RegisterFormData>();
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser({ variables: { data } });

      if (response.data.register.accessToken) {
        localStorage.setItem("authToken", response.data.register.accessToken);
        router.push("/dashboard/listings");

        toast.info('🦄 Wow so easy!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        reset();
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 pt-0 p-4 sm:p-10 sm:pt-6">
          <div>
            <Image
              src={onologo}
              className="mx-auto"
              alt="Logo"
              width={200}
              height={400}
            />
          </div>
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-1 mt-4">
              <div className="mx-auto max-w-sm flex flex-col gap-y-4">
                <input
                  {...register("name", { required: "First name is required" })}
                  className="w-full px-6 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  placeholder="First Name"
                />
                <input
                  {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                  className="w-full px-6 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                />
                <input
                  {...register("phoneNumber", { required: "Phone number is required" })}
                  className="w-full px-6 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Phone number"
                />
                <input
                  {...register("registrationNumber", { required: "Registration number is required" })}
                  className="w-full px-6 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Registration Number"
                />
                <input
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-6 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Password"
                />

                <button
                  type="submit"
                  className={`mt-5 tracking-wide font-semibold w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-700 text-gray-100"
                    }`}
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>

                {error && <p className="text-red-500 text-center">{error.message}</p>}
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
