import React from "react";
import { UserForm } from "./form";
import Instructions from "./instructions";

const Page = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Registrar novo utilizador</h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <UserForm />
        </div>
        <div>
          <Instructions />
        </div>
      </div>
    </div>
  );
};

export default Page;
