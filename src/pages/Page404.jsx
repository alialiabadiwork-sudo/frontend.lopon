import React from "react";
import { useNavigate } from "react-router";

function Page404() {
  const navigaite = useNavigate()
  return (
    <section className="flex items-center h-screen p-16 bg-gray-50 dark:bg-gray-700 text-st">
      <div className="container flex flex-col items-center ">
        <div className="flex flex-col gap-6 max-w-md text-center">
          <h2 className="font-extrabold text-9xl text-gray-600 dark:text-gray-300">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-md md:text-xl dark:text-gray-100 text-stone-800">
       صفحه مورد نظر پیدا نشد
       !
          </p>
          <div
            onClick={() => {navigaite("/")}}
            className=" py-3 px-4 mt-5 text-md  rounded bg-firoze text-gray-50 hover:text-gray-200 mx-auto  cursor-pointer"
          >
              برگشت
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page404;
