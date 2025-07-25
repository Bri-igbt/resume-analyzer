export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    try {
        // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
        loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
            console.log("PDF.js library loaded successfully");
            
            // Set the worker source
            const workerSrc = "/pdf.worker.min.mjs";
            console.log(`Setting PDF.js worker source to: ${workerSrc}`);
            lib.GlobalWorkerOptions.workerSrc = workerSrc;
            
            pdfjsLib = lib;
            isLoading = false;
            return lib;
        }).catch(error => {
            console.error("Error loading PDF.js library:", error);
            isLoading = false;
            throw new Error(`Failed to load PDF.js library: ${error.message}`);
        });

        return loadPromise;
    } catch (error) {
        console.error("Exception during PDF.js library loading:", error);
        isLoading = false;
        throw error;
    }
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    console.log(`Starting PDF conversion for file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    
    // Add timeout for the conversion process
    const timeoutPromise = new Promise<PdfConversionResult>((_, reject) => {
        setTimeout(() => {
            reject(new Error("PDF conversion timed out after 30 seconds"));
        }, 30000); // 30 second timeout
    });
    
    try {
        // Load the PDF.js library
        console.log("Loading PDF.js library...");
        const lib = await loadPdfJs();
        console.log("PDF.js library loaded successfully");
        
        // Convert the file to an array buffer
        console.log("Converting file to array buffer...");
        const arrayBuffer = await file.arrayBuffer();
        console.log(`Array buffer created, size: ${arrayBuffer.byteLength} bytes`);
        
        // Load the PDF document
        console.log("Loading PDF document...");
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        console.log(`PDF document loaded, number of pages: ${pdf.numPages}`);
        
        // Check if the PDF has pages
        if (pdf.numPages === 0) {
            console.error("PDF has no pages");
            return {
                imageUrl: "",
                file: null,
                error: "The PDF file has no pages"
            };
        }
        
        // Get the first page
        console.log("Getting first page of PDF...");
        const page = await pdf.getPage(1);
        console.log("First page retrieved successfully");
        
        // Create a viewport for rendering
        const scale = 4; // High resolution for better quality
        console.log(`Creating viewport with scale: ${scale}...`);
        const viewport = page.getViewport({ scale });
        console.log(`Viewport created, width: ${viewport.width}, height: ${viewport.height}`);
        
        // Create a canvas for rendering
        console.log("Creating canvas for rendering...");
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) {
            console.error("Failed to get canvas context");
            return {
                imageUrl: "",
                file: null,
                error: "Failed to get canvas context for rendering"
            };
        }
        
        // Set canvas dimensions
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        console.log(`Canvas created with dimensions: ${canvas.width}x${canvas.height}`);
        
        // Set rendering quality
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        console.log("Canvas rendering quality set to high");
        
        // Render the page to the canvas
        console.log("Rendering PDF page to canvas...");
        await page.render({ canvasContext: context, viewport }).promise;
        console.log("PDF page rendered to canvas successfully");
        
        // Convert the canvas to a blob
        console.log("Converting canvas to blob...");
        return Promise.race([
            timeoutPromise,
            new Promise<PdfConversionResult>((resolve) => {
                if (!canvas.toBlob) {
                    console.error("Canvas toBlob method not supported");
                    resolve({
                        imageUrl: "",
                        file: null,
                        error: "Canvas toBlob method not supported by your browser"
                    });
                    return;
                }
                
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            console.log(`Blob created successfully, size: ${blob.size} bytes`);
                            
                            // Create a File from the blob with the same name as the PDF
                            const originalName = file.name.replace(/\.pdf$/i, "");
                            const imageFile = new File([blob], `${originalName}.png`, {
                                type: "image/png",
                            });
                            console.log(`Image file created: ${imageFile.name}, size: ${imageFile.size} bytes`);
                            
                            // Create an object URL for the blob
                            const imageUrl = URL.createObjectURL(blob);
                            console.log(`Object URL created: ${imageUrl}`);
                            
                            resolve({
                                imageUrl,
                                file: imageFile,
                            });
                        } else {
                            console.error("Failed to create blob from canvas");
                            resolve({
                                imageUrl: "",
                                file: null,
                                error: "Failed to create image blob from canvas"
                            });
                        }
                    },
                    "image/png",
                    1.0 // Set quality to maximum (1.0)
                );
            })
        ]);
    } catch (err) {
        // Log detailed error information
        console.error("Error during PDF conversion:", err);
        if (err instanceof Error) {
            console.error("Error name:", err.name);
            console.error("Error message:", err.message);
            console.error("Error stack:", err.stack);
        }
        
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`
        };
    }
}