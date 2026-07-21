import { describe, expect, it } from "vitest";
import { sanitizeFilename, validateUploadFile } from "../lib/upload-security";
import { ApiError } from "../lib/api-error";

describe("sanitizeFilename", () => {
  it("removes path traversal characters", () => {
    expect(sanitizeFilename("../../etc/passwd")).not.toContain("..");
  });

  it("returns fallback for empty names", () => {
    expect(sanitizeFilename("")).toBe("upload");
  });
});

describe("validateUploadFile", () => {
  it("rejects disallowed mime types", () => {
    const file = {
      mimetype: "application/x-msdownload",
      size: 1000,
      originalname: "malware.exe",
    } as Express.Multer.File;

    expect(() => validateUploadFile(file)).toThrow(ApiError);
  });

  it("accepts allowed image types", () => {
    const file = {
      mimetype: "image/png",
      size: 1000,
      originalname: "photo.png",
    } as Express.Multer.File;

    expect(() => validateUploadFile(file)).not.toThrow();
  });
});
