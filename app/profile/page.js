"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) router.push("/");
    setUser(storedUser);
    setPreview(storedUser?.avatar || "/default-avatar.png");
  }, [router]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setUser((prevUser) => ({ ...prevUser, avatar: reader.result }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, avatar: reader.result })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Floating Glass Card */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-70"></div>
            <div className="absolute inset-0.5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl"></div>

            {/* Main Card */}
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-purple-500/30">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 p-6 text-center">
                <h1 className="text-2xl font-bold">Your Profile</h1>
              </div>

              {/* Profile Content */}
              <div className="p-10 md:p-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center -mt-16">
                  <label
                    className="cursor-pointer group relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      <div className="w-[130px] h-[130px] rounded-full mt-4 overflow-hidden border-4 border-white/20">
                        <Image
                          src={preview || "/default-avatar.png"}
                          alt="User Avatar"
                          width={130}
                          height={130}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {isHovering && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 transition-opacity duration-300">
                          <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-md">
                            Change Photo
                          </span>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* User Info */}
                  <div className="mt-6 text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                      {user?.name || "Guest User"}
                    </h2>
                    <p className="text-gray-300">
                      {user?.email || "user@example.com"}
                    </p>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-white/10 rounded-full backdrop-blur-sm">
                        Premium Member
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-col-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-xl border border-purple-500/20 text-center backdrop-blur-sm">
                    <p className="text-2xl font-bold">42</p>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">
                      Tasks
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20 text-center backdrop-blur-sm">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">
                      Completed
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 p-4 rounded-xl border border-indigo-500/20 text-center backdrop-blur-sm">
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">
                      Categories
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-xs text-gray-400 bg-gradient-to-br from-purple-900 to-blue-900">
                      Account Actions
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left flex items-center transition-all duration-200 hover:translate-x-1">
                    <svg className="w-5 h-5 mr-3 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Account Settings
                  </button>
                  <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left flex items-center transition-all duration-200 hover:translate-x-1">
                    <svg className="w-5 h-5 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Privacy & Security
                  </button>
                </div> */}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    localStorage.clear();
                    router.push("/");
                  }}
                  className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-500 hover:to-pink-500 rounded-xl text-white font-medium shadow-lg hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
