/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

import { FileButtonProps } from "@/types/dashboard-types";
import { JSX } from "react";

/**
 * File button component for uploading files.
 * @param props - FileButtonProps object containing the component's properties.
 * @returns JSX.Element - The rendered file button component.
 * */
const FileButton = ({
  onChange,
  accept,
  label,
  fileName,
  error,
}: FileButtonProps): JSX.Element => (
  <div className="mb-3">
    <label className="block font-medium mb-1">{label} *</label>
    <div className="flex items-center gap-3">
      <label className="cursor-pointer bg-secondary text-primary px-4 py-2 rounded-md shadow transition">
        Choisir un fichier
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
      </label>
      {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FileButton;
