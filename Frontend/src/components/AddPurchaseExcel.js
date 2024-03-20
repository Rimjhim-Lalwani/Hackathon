import { Fragment,useContext, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import * as xlsx from 'xlsx'; // Import the xlsx library for parsing Excel files
import { Dialog, Transition } from "@headlessui/react";
import AuthContext from "../AuthContext";

export default function AddPurchaseExcel({ modalSetting, handlePagesUpdate
    }) {
  const [file, setFile] = useState(null);
  const cancelButtonRef = useRef(null);
  const [open, setOpen] = useState(true);
  const authContext = useContext(AuthContext);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsx.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = xlsx.utils.sheet_to_json(worksheet);
      
      const filteredData = excelData.map((row) => {
        // Define the expected fields in your backend
        const expectedFields = ['name', 'cost', 'quantity'];
      
        // Validate user context and extract userId
        let userId;
        if (authContext && authContext.user) {
          userId = authContext.user;
        } else {
          console.error("Missing user context or user ID. Cannot add user ID to product data.");
          return null; // Skip this row (or handle differently based on needs)
        }
      
        // Filter out extra fields and include userId
        const filteredRow = Object.keys(row)
          .filter(key => expectedFields.includes(key))
          .reduce((obj, key) => {
            obj[key] = row[key];
            return obj;
          }, { ...row, userId }); // Spread existing row data and add userId
      
        return filteredRow;
      });
      console.log(JSON.stringify(filteredData));
      console.log(filteredData);
     
    
      fetch("http://localhost:4000/api/purchase/addPurchaseEx", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(filteredData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Purchase added successfully.");
          handlePagesUpdate();
          modalSetting();
        })
        .catch((error) => {
          console.error("Error adding purchase:", error);
          alert("An error occurred");
        });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-10"
      initialFocus={cancelButtonRef}
      onClose={setOpen}
    >
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusIcon
                      className="h-6 w-6 text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 m-1 "
                    >
                      Import Purchases from Excel:
                      
                    </Dialog.Title>
                    <span className="font-bold italic text-red-500">Note: </span>
                    <span className="italic text-s my-5">
                       Required fields -'name','manufacturer','description','stock','expiry'
                    </span>
                    <form action="#">
                      <div className="flex items-center space-x-4 m-5">
                      <input type="file" onChange={handleFileChange} />
     
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => modalSetting()}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <button className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto mx-2" onClick={handleUpload}>Upload</button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
    
  );
}
