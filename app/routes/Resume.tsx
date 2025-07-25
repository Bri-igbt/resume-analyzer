import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
  { title: 'Resumind | Review ' },
  { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
  const { auth, isLoading: isPuterLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if(!isPuterLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isPuterLoading, auth.isAuthenticated, id, navigate]);

  // Load resume data
  useEffect(() => {
    const loadResume = async () => {
      setIsDataLoading(true);
      setError(null);
      
      try {
        // Get resume data from key-value store
        const resume = await kv.get(`resume:${id}`);
        if(!resume) {
          setError("Resume not found. Please try again.");
          setIsDataLoading(false);
          return;
        }

        // Parse resume data
        let data;
        try {
          data = JSON.parse(resume);
        } catch (e) {
          setError("Failed to parse resume data. Please try again.");
          setIsDataLoading(false);
          return;
        }

        // Get resume PDF
        const resumeBlob = await fs.read(data.resumePath);
        if(!resumeBlob) {
          setError("Failed to load resume file. Please try again.");
          setIsDataLoading(false);
          return;
        }

        // Create PDF blob and URL
        const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
        const resumeUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeUrl);

        // Get resume image
        const imageBlob = await fs.read(data.imagePath);
        if(!imageBlob) {
          setError("Failed to load resume image. Please try again.");
          setIsDataLoading(false);
          return;
        }
        
        // Create image URL
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);

        // Set feedback data
        setFeedback(data.feedback);
        console.log({resumeUrl, imageUrl, feedback: data.feedback });
        
        setIsDataLoading(false);
      } catch (error) {
        console.error("Error loading resume:", error);
        setError("An unexpected error occurred. Please try again.");
        setIsDataLoading(false);
      }
    };

    if (id) {
      loadResume();
    }
    
    // Cleanup function to revoke object URLs
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, [id, kv, fs]);

  return (
      <main className="!pt-0">
        <nav className="resume-nav">
          <Link to="/" className="back-button">
            <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
            <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
          </Link>
        </nav>
        <div className="flex flex-row w-full max-lg:flex-col-reverse">
          <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
            {imageUrl && resumeUrl && (
                <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <img
                        src={imageUrl}
                        className="w-full h-full object-contain rounded-2xl"
                        title="resume"
                        alt='resume'
                    />
                  </a>
                </div>
            )}
          </section>

         <section className='feedback-section'>
           <h2 className='text-4xl !text-black font-bold'>Resume Review</h2>
           {error ? (
               <div className="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                 <p>{error}</p>
                 <button 
                   onClick={() => window.location.reload()} 
                   className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                 >
                   Try Again
                 </button>
               </div>
           ) : isDataLoading ? (
               <img
                   src='/images/resume-scan-2.gif'
                   className='w-full'
                   alt='scan'
               />
           ) : feedback ? (
               <div className='flex flex-col gap-8 animate-in fade-in'>
                  <Summary feedback={feedback}/>
                  <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                  <Details feedback={feedback} />
               </div>
           ) : (
               <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded mb-4">
                 <p>No feedback data available. Please try again.</p>
               </div>
           )}
         </section>
        </div>
      </main>
  )
}
export default Resume