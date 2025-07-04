import React from "react";
import { Form } from "./form";
import Instructions from "./instructions";

const Page = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <Form />
        </div>
        <div>
          <Instructions />
        </div>
      </div>
    </div>
  );
};

export default Page;
