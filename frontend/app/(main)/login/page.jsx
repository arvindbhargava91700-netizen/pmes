"use client";
import { Building2, KeyRound, ShieldCheck, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Lock, Smartphone, Key } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "@/components/Api/publicApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  loadCaptchaEnginge,
  validateCaptcha,
  LoadCanvasTemplateNoReload,
} from "react-simple-captcha";

const tabs = [
  { id: "password", label: "Password", icon: Lock },
  { id: "otp", label: "OTP", icon: Smartphone },
  { id: "dsc", label: "DSC", icon: KeyRound },
];

export default function LoginPage() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState("password");
  const [isMounted, setIsMounted] = useState(false);
  const [selected, setSelected] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [captcha, setCaptchaInput] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // opt states
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    // setCaptcha(generateCaptcha());

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // role
  const fetchRoles = async () => {
    const res = await api.get("/api/auth/roles");
    // console.log("roles data:", res.data.data);

    return res.data.data;
  };

  const { data: rolesData = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // login
  const loginUser = async (data) => {
    const res = await api.post("/api/auth/login/password", data);
    return res.data;
  };

  const { mutate, isPending, isError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("LOGIN SUCCESS", data);

      if (data?.status === true) {
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        toast.success(data.message || "Login successful!");

        setUsername("");
        setPassword("");
        
        setCaptchaInput("");

        router.replace("/admin/dashboard");
      }
    },
    onError: (error) => {
      console.log("API Error ", error.response?.data);
      setErrors(error?.response?.data);
    },
  });

  const handleSubmit = () => {
    if (!selected?.name) {
      toast.error("Please select a role");
      return;
    }

    if (!validateCaptcha(captcha)) {
      toast.error("Captcha does not match");
      loadCaptchaEnginge(6);
      return;
    }

    mutate({
      username,
      password,
      role: selected.name,
    });
  };

  // captcha

  useEffect(() => {
    if (isMounted) {
      loadCaptchaEnginge(6);
    }
  }, [isMounted]);

  // const refreshCaptcha = () => {
  //   setCaptchaLoading(true);

  //   setTimeout(() => {
  //     loadCaptchaEnginge(6);
  //     setCaptchaLoading(false);
  //   }, 300);
  // };

  // const fetchcaptcha = async () => {
  //   const res = await api.get("/api/auth/captcha", {});
  //   return res.data;
  // };

  // const {
  //   data: captchaData,
  //   refetch: refreshCaptcha,
  //   isLoading: captchaLoading,
  // } = useQuery({
  //   queryKey: ["captcha"],
  //   queryFn: fetchcaptcha,
  //   enabled: isMounted,
  // });

  // fetchotp
  const fetchotp = async (value) => {
    const res = await api.post("/api/auth/login/otp/send", value);
    return res.data;
  };

  const {
    mutate: otpmutate,
    isError: otpisError,
    isPending: otpisPending,
  } = useMutation({
    mutationFn: fetchotp,
    onSuccess: (res) => {
      if (res?.status === false) {
        return;
      }

      if (res?.status === true) {
        toast.success(res.message || "OTP sent successfully");
        setErrors(null);
        startOtpTimer();
      }
    },
    onError: (errror) => {
      console.log("API Error he ye ", errror.response?.data);
      setErrors(errror?.response?.data);
    },
  });

  const otpfetchhandleSubmit = () => {
    otpmutate({
      mobile,
    });
  };

  // getotp
  const getotp = async (data) => {
    const res = await api.post("/api/auth/login/otp/verify", data);
    return res.data;
  };

  const {
    mutate: getotpmutate,
    isError: getotpisError,
    isPending: getotpisPending,
  } = useMutation({
    mutationFn: getotp,
    onSuccess: (res) => {
      if (res?.status === true) {
        toast.success(res.message || "Login successful!");
        setOtp("");

        if (res.token) {
          localStorage.setItem("access_token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
        }

        router.push("/admin/dashboard");
      } else {
        setErrors(res);
      }
    },
    onError: (errror) => {
      console.log("API Error", errror.response?.data);
      setErrors(errror?.response?.data);
    },
  });

  const getotphandleSubmit = () => {
    getotpmutate({
      otp,
      mobile,
    });
  };

  // for type only number
  const allowOnlyNumbers = (e) => {
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }
  };

  // for 5 min set time
  const startOtpTimer = () => {
    let seconds = 300;

    setTimeLeft(seconds);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = () => {
    otpfetchhandleSubmit();
  };

  if (!isMounted) {
    return (
      <div className="h-10 w-40 bg-gray-100 animate-pulse rounded-md"></div>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col p-5">
        <div className="my-4">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white p-4 rounded-xl text-2xl">
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          <h2 className="md:text-2xl text-xl font-bold text-center">
            Project Monitoring & Evaluation System
          </h2>
          <p className="text-center md:text-md text-sm text-gray-500 mb-6">
            नगर निगम मेरठ | Municipal Corporation Meerut
          </p>
        </div>
        {/* Center Card */}
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-lg p-5 rounded-xl shadow-xs border border-zinc-200 focus:border-2 focus:border-blue-400 bg-white">
            {/* User Type */}
            <div className="relative w-full mt-3" ref={dropdownRef}>
              {/* Visible UI */}
              <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between cursor-pointer rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2 hover:border-zinc-400"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {selected?.name || "Select role"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {selected?.description || ""}
                  </p>
                </div>

                <ChevronDown
                  className={`h-5 w-5 text-zinc-500 transition ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Dropdown list */}
              {open && (
                <div className="absolute z-10 mt-2 p-1 w-full rounded-xl border border-zinc-200 bg-white shadow-lg">
                  {rolesData.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => {
                        setSelected(role);
                        setOpen(false);
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-zinc-100 rounded-xl group"
                    >
                      <p className="text-sm font-medium text-zinc-900 group-hover:text-blue-500">
                        {role.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <select
                name="role_id"
                value={selected?.id || ""}
                readOnly
                className="hidden"
              >
                <option value="">Select role</option>
                {rolesData.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-zinc-100 p-1 my-4">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition
                    ${
                      method === id
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700"
                    } `}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {method === "password" && (
              <>
                {/* Username */}
                <div className="my-3">
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Username / Employee ID
                  </label>

                  <div className="relative mb-3">
                    {/* Icon */}
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                    {/* Input */}
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-100 py-3 pl-10 pr-3 text-sm
                     placeholder-zinc-400 focus:border-2 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  {isError && errors?.errors?.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="my-3">
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Password
                  </label>

                  <div className="relative mb-3">
                    {/* Icon */}
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                    {/* Input */}
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-100 py-3 pl-10 pr-3 text-sm
                    placeholder-zinc-400 focus:border-2 focus:border-blue-400 focus:outline-none"
                    />
                    <span
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {isError && errors?.errors?.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.errors?.password}
                    </p>
                  )}
                </div>

                {/* Captcha */}
                <label className="text-sm font-semibold mb-3">
                  Enter CAPTCHA
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3 mt-2">
                  <span className="relative flex-grow w-full">
                    <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Enter captcha"
                      value={captcha}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-100 py-3 pl-10 pr-3 text-sm
                     placeholder-zinc-400 focus:border-2 focus:border-blue-400 focus:outline-none"
                    />
                  </span>

                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <div className="flex-grow sm:flex-grow-0 w-[80%] text-center bg-gray-100 border border-zinc-200 px-4 py-2 rounded-xl font-mono text-lg tracking-widest select-none text-black italic decoration-zinc-300">
                      <LoadCanvasTemplateNoReload  />
                    </div>

                    <button
                      type="button"
                      onClick={() => loadCaptchaEnginge(6)}
                      className="p-3 py-3.5 bg-gray-100 rounded-xl border border-zinc-200 hover:bg-gray-200 hover:text-blue-500 transition-colors cursor-pointer text-black"
                    >
                      <FiRefreshCcw
                        size={18}
                        className={captchaLoading ? "animate-spin" : ""}
                      />
                    </button>
                  </div>
                </div>
                {isError && errors?.errors?.captcha && (
                  <p className="text-red-500 text-xs my-1 mb-3">
                    {errors.errors.captcha}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                >
                  {isPending ? "Signing In..." : "Sign In"}
                </button>
              </>
            )}

            {method === "otp" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-3">
                    Registered Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="tel"
                      value={mobile}
                      maxLength={10}
                      onKeyDown={allowOnlyNumbers}
                      onChange={(e) => {
                        setMobile(e.target.value);
                      }}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-100 py-3 pl-10 pr-3 text-sm focus:border-2 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  {otpisError && errors?.errors?.mobile && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.mobile}
                    </p>
                  )}
                </div>

                <button
                  disabled={otpisPending}
                  onClick={handleSendOtp}
                  className="w-full py-3 rounded-xl border border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium hover:text-blue-500 cursor-pointer transition"
                >
                  {otpisPending ? "Sending OTP..." : "Send OTP"}
                </button>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">
                      Enter OTP
                    </label>
                    <p className="block text-sm font-semibold text-zinc-900 mb-2">
                      {timeLeft > 0
                        ? `Time left: ${Math.floor(timeLeft / 60)}:${String(
                            timeLeft % 60
                          ).padStart(2, "0")}`
                        : "You can resend OTP"}
                    </p>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    onKeyDown={allowOnlyNumbers}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                    }}
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-100 py-3 px-4 text-sm text-center tracking-[0.5em] font-bold placeholder:tracking-normal placeholder:font-normal focus:border-2 focus:border-blue-400 focus:outline-none"
                  />
                  {getotpisError && errors?.errors?.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.errors.otp}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={getotphandleSubmit}
                  disabled={otp.length !== 6 || getotpisPending}
                  className={`w-full py-2 rounded-lg font-semibold transition cursor-pointer
                ${
                  otp.length !== 6 || getotpisPending
                    ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                >
                  {getotpisPending ? "Verifying..." : "Verify & Sign In"}
                </button>
              </div>
            )}

            {method === "dsc" && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in duration-300">
                {/* Key Icon Container */}
                <div className="p-6">
                  <KeyRound className="w-12 h-12 text-zinc-600 rotate-15" />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-bold text-zinc-900">
                    Digital Signature Certificate
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    Insert your DSC token and click below to authenticate
                  </p>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 cursor-pointer rounded-lg font-semibold">
                  Authenticate with DSC
                </button>
              </div>
            )}

            <p className="text-center text-sm text-blue-600 mt-4 cursor-pointer">
              Forgot Password?
            </p>
          </div>
        </div>

        <div className="text-center text-zinc-500 py-5 border-b border-zinc-300">
          Need help&nbsp;?&nbsp;
          <a href="#" className="text-blue-500 hover:underline">
            Contact Support
          </a>
          &nbsp;|&nbsp;
          <a href="#" className="text-blue-500 hover:underline">
            User Manual
          </a>
        </div>
        <div className="text-center text-xs text-gray-500 py-4">
          © 2024 Municipal Corporation Meerut. All Rights Reserved.
          <br />
          Designed & Developed by Smart City Mission | Version 2.0.1
        </div>
      </div>
    </>
  );
}
