import React from "react";
import { Form } from "./form";

const Page = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Registrar novo documento</h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <Form />
        </div>
        <div>
          <p className="font-semibold text-sm text-zinc-600">Instructions</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
