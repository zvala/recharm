import React, { useState } from "react";
import { Button, TextInput, Label } from "flowbite-react";
import { HiPlus, HiX, HiTrash } from "react-icons/hi";

interface CreateRequestMainComponentProps { }

export function CreateRequestMainComponent(
  props: CreateRequestMainComponentProps
) {
  // State to track the list of URLs and their validation states
  const [urls, setUrls] = useState([""]);
  const [validations, setValidations] = useState([true]);

  // Function to handle adding a new URL input field
  const handleAddUrl = () => {
    if (urls.length >= 10) return;

    setUrls([...urls, ""]);
    setValidations([...validations, true]);
  };

  // Function to handle URL input changes
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // Function to validate URL format using a regex
  const validateUrl = (url: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // Protocol (optional)
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // Domain name
      "localhost|" + // Or localhost
      "\\d{1,3}(\\.\\d{1,3}){3})" + // ...or IPv4 address
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // Port and path (optional)
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // Query string (optional)
      "(\\#[-a-zA-Z\\d_]*)?$", // Fragment (optional)
      "i"
    );
    return urlPattern.test(url);
  };

  // Function to validate all inputs
  const handleCreateRequest = () => {
    const newValidations = urls.map((url) => validateUrl(url));
    setValidations(newValidations);

    // Prevent request creation if there are validation errors
    if (newValidations.includes(false)) {
      return; 
    }

    const requestData = urls.map((url, index) => {
      const parsedUrl = new URL(url);
      const value = parsedUrl.pathname.split("/").filter(Boolean).pop() || ""; // Get last segment or empty string

      return {
        url: `url-from-entry-${index + 1}`,
        value: value
      }
    });

    alert(JSON.stringify(requestData))
  };

  const handleRemoveUrl = (index: number) => {
    if (urls.length === 1) {
      // If there's only one input, clean its value instead of removing it
      const updatedUrls = [...urls];
      updatedUrls[0] = ""; // Clear the value of the first input
      setUrls(updatedUrls);

      const updatedValidations = [...validations];
      updatedValidations[0] = true; // Set validation to true
      setValidations(updatedValidations);
    } else {
      // Remove the URL at the given index if there are multiple inputs
      const updatedUrls = [...urls];
      updatedUrls.splice(index, 1);
      setUrls(updatedUrls);

      // Remove the validation state for that URL
      const updatedValidations = [...validations];
      updatedValidations.splice(index, 1);
      setValidations(updatedValidations);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-t bg-white">
      <div className="flex items-center justify-between p-6 border-b rounded-t">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-extrabold">
          Create New Request
        </h3>
        <button
          className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <HiX className="w-5 h-5" />
        </button>
      </div>
      <div className="h-full max-h-svh overflow-y-auto">
        <div className="p-8 space-y-6 mx-auto max-w-[672px] ">
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Add videos or folders
            </h4>
            <p className="text-sm text-gray-900 dark:text-gray-400">
              These videos would be cut, labeled and made available in your
              Recharm video library
            </p>
          </div>
          {urls.map((url, index) => (
            <div key={index}>
              <div className="mb-2 block">
                <Label
                  htmlFor={`url-${index}`}
                  color={!validations[index] ? "failure" : undefined}
                  value={`Video/Folder URL ${index + 1}`}
                />
              </div>
              <div className="relative">
                <TextInput
                  id={`url-${index}`}
                  className="group"
                  type="url"
                  placeholder="http://drive.google.com/some-link"
                  value={url}
                  color={!validations[index] ? "failure" : undefined}
                  helperText={
                    !validations[index] ? (
                      <>Please enter a valid URL.</>
                    ) : null
                  }
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  required
                  rightIcon={() =>
                    url && url.trim() !== "" ? (
                      <button onClick={() => handleRemoveUrl(index)}>
                        <HiTrash className="h-3 w-3 text-gray-300 hover:text-color group-hover:text-gray-500" />
                      </button>
                    ) : null
                  }
                >
                </TextInput>
              </div>
            </div>
          ))}
          {urls.length < 10 && (
            <div>
              <Button
                color="light"
                onClick={handleAddUrl}
                className="text-sm font-medium hover:text-purple-800 bg-white hover:bg-gray-50 border border-gray-300"
              >
                <span className="flex items-center">
                  <span className="bg-purple-800 rounded-full p-0.5 mr-2">
                    <HiPlus className="h-3 w-3 text-white" />
                  </span>
                  Add URL
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
        <Button
          color="primary"
          onClick={handleCreateRequest}
          className="text-white text-sm bg-purple-700 hover:bg-purple-800"
        >
          <HiPlus className="w-5 h-5 mr-2" />
          Create Request
        </Button>
      </div>
    </div>
  );
}
