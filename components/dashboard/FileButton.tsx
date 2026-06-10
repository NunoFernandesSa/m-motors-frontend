interface FileButtonProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  label: string;
  fileName: string;
  error: string;
}

const FileButton = ({
  onChange,
  accept,
  label,
  fileName,
  error,
}: FileButtonProps) => (
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
