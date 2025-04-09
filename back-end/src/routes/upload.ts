import express, { Request, Response, Router } from 'express';
import multer, { Multer } from 'multer';
import axios from 'axios'; // Ensure axios is imported
import { minioClient, MINIO_BUCKET, MINIO_PUBLIC_HOST, SERVER_PORT, SERVER_HOST } from '../config/index.js'; // Import necessary config

const router: Router = express.Router();

// Configure Multer for memory storage
const upload: Multer = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // Example: Limit file size to 10MB
});

// --- Original Endpoint: /api/generate-presigned-url ---
// Note: The path is relative to where the router is mounted in server.ts
router.post('/api/generate-presigned-url', async (req: Request, res: Response) => {
    try {
      const { filename, fileType } = req.body;

      // Log the received values for debugging
      console.log(`Received filename for presigned URL: ${filename}`);
      console.log(`Received fileType for presigned URL: ${fileType}`);

      if (!filename || !fileType) {
        return res.status(400).json({ error: "Missing filename or fileType" });
      }

      // Use the filename directly as in the original code
      // No unique ID generation or sanitization here to match original logic
      const objectName = filename;

      // Generate a pre-signed URL that expires in 24 hours (as per original implicit duration, adjust if needed)
      const expiry = 24 * 60 * 60; // 24 hours
      const presignedUrl = await minioClient.presignedPutObject(
        MINIO_BUCKET!,
        objectName,
        expiry
      );

      console.log(`Generated presigned PUT URL: ${presignedUrl}`);

      // Construct the public URL using MINIO_PUBLIC_HOST
      // Ensure MINIO_PUBLIC_HOST is correctly configured (e.g., 'localhost:9000')
      const publicUrl = `http://${MINIO_PUBLIC_HOST}/${MINIO_BUCKET}/${objectName}`;

      res.status(200).json({
        presignedUrl, // URL for the client/server to PUT the file to
        publicUrl,    // URL to access the file after successful upload (viewUrl in original)
      });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
});

// --- Original Endpoint: /upload-with-presigned-url ---
// Note: The path is relative to where the router is mounted in server.ts
// Uses PUT method as in the original code
router.put('/upload-with-presigned-url', upload.single('file'), async (req: Request, res: Response) => {
    try {
      const { filename, fileType } = req.body; // Get filename/type from body
      const fileBuffer = req.file?.buffer;     // Get file buffer from multer

      if (!req.file || !fileBuffer) {
          return res.status(400).json({ error: "No file uploaded." });
      }

      if (!filename || !fileType) {
        return res.status(400).json({ error: "Missing filename or fileType in request body" });
      }

      // --- Internal call to generate the presigned URL ---
      // Construct the URL to the generate endpoint based on server config
      const generateUrl = `http://${SERVER_HOST}:${SERVER_PORT}/api/generate-presigned-url`;
      console.log(`Internally calling: POST ${generateUrl}`);

      const presignedUrlResponse = await axios.post(generateUrl, {
        filename, // Pass filename and fileType to the generate endpoint
        fileType,
      });
      // --- End of internal call ---

      // Extract URLs from the response of the internal call
      const presignedUrl = presignedUrlResponse.data.presignedUrl;
      const viewUrl = presignedUrlResponse.data.publicUrl; // Use 'viewUrl' to match original variable name

      if (!presignedUrl) {
        console.error("Failed to retrieve presigned URL from internal call.");
        return res.status(500).json({ error: "Internal server error during URL generation step." });
      }

      console.log(`Received presigned URL internally: ${presignedUrl}`);
      console.log(`Received view URL internally: ${viewUrl}`);

      // Upload the file buffer to MinIO using the obtained presigned URL
      console.log(`Uploading buffer to presigned URL: PUT ${presignedUrl.substring(0, 100)}...`); // Log truncated URL
      await axios.put(presignedUrl, fileBuffer, {
        headers: {
          // Set Content-Type based on the fileType provided in the request body
          // (or you could use req.file.mimetype if you trust multer's detection)
          "Content-Type": fileType,
          // Axios might automatically set Content-Length, but you could add it manually:
          // "Content-Length": fileBuffer.length
        },
         // Important for large files: prevent axios from buffering the whole thing in memory again
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      console.log(`Successfully PUT buffer to presigned URL.`);


      // Respond with success and the view URL
      res.status(200).json({
        message: "File uploaded successfully using presigned URL!",
        viewUrl, // Return the viewUrl as in the original code
      });

    } catch (error: any) {
        // Log Axios errors specifically if possible
        if (axios.isAxiosError(error)) {
            console.error("Axios error during upload/presigned URL generation:", error.response?.data || error.message);
        } else {
            console.error("Error uploading file with presigned URL:", error);
        }
        res.status(500).json({ error: "Error processing file upload with presigned URL" });
      }
});


// Example of the direct upload route (kept for comparison/alternative)
router.post('/api/upload/direct', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }
        const file = req.file;
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const uniqueFilename = `${Date.now()}-${originalName}`;

        await minioClient.putObject(
            MINIO_BUCKET!, uniqueFilename, file.buffer, file.size,
            { 'Content-Type': file.mimetype }
        );
        const publicUrl = `http://${MINIO_PUBLIC_HOST}/${MINIO_BUCKET}/${uniqueFilename}`;
        res.status(200).json({ message: "File uploaded directly successfully!", publicUrl, filename: uniqueFilename });
    } catch (error) {
        console.error("Error during direct file upload:", error);
        res.status(500).json({ error: "Server error during file upload" });
    }
});


export default router;