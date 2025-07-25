import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2Img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";
import { upload } from "~/lib/puter";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

 // import from puter.ts

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file,
                                 }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        try {
            setIsProcessing(true);

            setStatusText("Uploading the file...");
            const uploadedFileRes = await upload([file]);
            if (!uploadedFileRes.success) {
                console.error("File upload error:", uploadedFileRes.error);
                return setStatusText("Error: Failed to upload file");
            }

            setStatusText("Converting to image...");
            const imageFile = await convertPdfToImage(file);
            if (!imageFile?.file) {
                return setStatusText("Error: Failed to convert PDF to image");
            }

            setStatusText("Uploading the image...");
            const uploadedImageRes = await upload([imageFile.file]);
            if (!uploadedImageRes.success) {
                console.error("Image upload error:", uploadedImageRes.error);
                return setStatusText("Error: Failed to upload image");
            }

            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFileRes.data.path,
                imagePath: uploadedImageRes.data.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: "",
            };

            setStatusText("Analyzing...");
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            const feedback = await ai.feedback(
                uploadedFileRes.data.path,
                prepareInstructions({ jobTitle, jobDescription })
            );
            if (!feedback) {
                return setStatusText("Error: Failed to analyze resume");
            }

            const feedbackText =
                typeof feedback.message.content === "string"
                    ? feedback.message.content
                    : feedback.message.content[0]?.text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analysis complete, redirecting...");
            navigate(`/resume/${uuid}`);
        } catch (error) {
            console.error("Unexpected error:", error);
            setStatusText("An unexpected error occurred.");
        }
    };


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload